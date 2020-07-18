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
function test() {
  const baseUrl = "https://mynumbercard.code4japan.org/static/data/";
  const dates = [
    "20170308",
    "20170515",
    "20170831",
    "20171201",
    "20180301",
    "20180701",
    "20181201",
    "20190401",
    "20190701",
    "20190916",
    "20191101",
    "20200120",
    "20200301",
    "20200401",
    "20200501",
    "20200601",
    "20200701",
  ];
  const filenames = [
    "all_prefectures.csv",
    "all_localgovs.csv",
    "summary_by_types.csv",
    "demographics.csv",
  ];
  let output = "";

  filenames.forEach((file: string) => {
    output = output + `\ncreate file ${file}`;
    console.log("load file " + file);
    const sheet = getSheetInstance(file);
    if (!sheet) {
      output = output + `\nsheet '${file}' can't be loaded.`;
    } else {
      output = output + `\n load ${file}.`;
      let keys = dates;
      if (file == "demographics.csv") {
        keys.shift();
      }
      keys.forEach((key: string) => {
        loadcsv(sheet, key, baseUrl + key + "/" + file);
      });
    }
  });
  return output;
  /*
  loadcsv(
    "https://mynumbercard.code4japan.org/static/data/20200601/demographics.csv",
    {
      sheetName: "20200601",
      fileName: "demographits",
    }
  );
  */
}
