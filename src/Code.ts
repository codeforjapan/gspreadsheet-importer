const PROP_DRIOVE_ID = "drive_id";

/**
 * initialize the script environment
 */
function init() {
  const token = PropertiesService.getScriptProperties().getProperty(
    PROP_DRIOVE_ID
  );
  var output = "";
  if (token) {
    output = `Already initalized: drive ID = ${token}`;
  } else {
    const folder = DriveApp.createFolder("gspreadsheet-importer");
    if (folder) {
      output = `A new folder was created. ID=${folder.getId()}\n`;
      PropertiesService.getScriptProperties().setProperty(
        PROP_DRIOVE_ID,
        folder.getId()
      );
      output = output + "Initialized.";
    } else {
      output = "Failed to create new folder.\n";
    }
  }
  return output;
}
/**
 * get SpreadSheet class instance of specified file name
 * @param filename of the spreadsheet
 */
function getSheetInstance(
  filename: string
): GoogleAppsScript.Spreadsheet.Spreadsheet {
  const folder = getFolder();
  if (folder == null) {
    console.error(
      "folder is not able to be created. maybe script is not initialized"
    );
    return null;
  }
  const files = folder.getFilesByName(filename);
  if (files.hasNext()) {
    const file = files.next();
    return SpreadsheetApp.openById(file.getId());
  } else {
    const sheet = SpreadsheetApp.create(filename);
    // save to initial folder
    const file = DriveApp.getFileById(sheet.getId());
    folder.addFile(file);
    return sheet;
  }
}
/**
 * load csv data into speficic file
 * @param url
 * @param options
 */
function loadcsv(
  spreadsheetObj: GoogleAppsScript.Spreadsheet.Spreadsheet,
  sheetname: string,
  url: string
) {
  console.log(`load sheet from ${url}`);
  var response = UrlFetchApp.fetch(url);
  var data = response.getContentText();
  var sheet = spreadsheetObj.getSheetByName(sheetname);
  if (sheet) {
    spreadsheetObj.deleteSheet(sheet);
  }
  sheet = spreadsheetObj.insertSheet(sheetname);
  var csv = Utilities.parseCsv(data);
  sheet.getRange(1, 1, csv.length, csv[0].length).setValues(csv);
}
/**
 * get data folder instance
 */
function getFolder(): GoogleAppsScript.Drive.Folder | null {
  const token = PropertiesService.getScriptProperties().getProperty(
    PROP_DRIOVE_ID
  );
  if (token) {
    return DriveApp.getFolderById(token);
  } else {
    return null;
  }
}
/**
 * get initial drive ID
 */
function getInitialDriveID() {
  var output = "";
  const folder = getFolder();
  if (folder != null) {
    output = folder.getUrl();
  } else {
    output =
      output + "The folder doesn't exist. maybe script is not initialized.";
  }
  return output;
}
/**
 * Please write your own function referencing the test() method
 */
function sync() {
  // MAGIC IS HERE
}
/**
 * test method
 */
function test() {
  // feed URL
  const feedurl = "https://mynumbercard.code4japan.org/feed-1.json";
  /*
  the feed-1.json is a json file which contains the csv data like this
  ```
  {
    feed_url: "https://mynumbercard.code4japan.org/feed-1.json",
    home_page_url: "https://mynumbercard.code4japan.org",
    items: [
      {
        name: "all_localgovs.csv",
        files: [
          {
            dir: "20200701",
            href: "/static/data/20200701/all_localgovs.csv"
          },
          {
            dir: "20200601",
            href: "/static/data/20200601/all_localgovs.csv"
          },
          ...
        ]
      },
      {
        name: "all_prefectures",
        items: [...]
      }...
    ]
  } 
  */
  // get json
  var response = UrlFetchApp.fetch(feedurl);
  var data = JSON.parse(response.getContentText());
  // base URL
  const baseURL = data.home_page_url;
  // Logging
  var output = `base URL is '${baseURL}`;
  // loop file names
  data.items.forEach((file: any) => {
    output = output + `\ncreate file ${file.name}`;
    console.log("load file " + file.name);
    // get Sheet instance from file name
    const sheet = getSheetInstance(file.name);
    if (!sheet) {
      output = output + `\nsheet '${file.name}' can't be loaded.`;
    } else {
      output = output + `\n load ${file.name}.`;
      // loop files
      file.files.forEach((item: any) => {
        // load csv into the sheet instance
        loadcsv(sheet, item.dir, baseURL + item.href);
      });
    }
  });
  return output;
}
