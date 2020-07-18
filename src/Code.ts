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
  const files = {
    all_prefectures: {
      "20170308":
        "https://mynumbercard.code4japan.org/static/data/20170308/all_prefectures.csv",
      "20170515":
        "https://mynumbercard.code4japan.org/static/data/20170515/all_prefectures.csv",
      "20170831":
        "https://mynumbercard.code4japan.org/static/data/20170831/all_prefectures.csv",
      "20171201":
        "https://mynumbercard.code4japan.org/static/data/20171201/all_prefectures.csv",
      "20180301":
        "https://mynumbercard.code4japan.org/static/data/20180301/all_prefectures.csv",
      "20180701":
        "https://mynumbercard.code4japan.org/static/data/20180701/all_prefectures.csv",
      "20181201":
        "https://mynumbercard.code4japan.org/static/data/20181201/all_prefectures.csv",
      "20190401":
        "https://mynumbercard.code4japan.org/static/data/20190401/all_prefectures.csv",
      "20190701":
        "https://mynumbercard.code4japan.org/static/data/20190701/all_prefectures.csv",
      "20190916":
        "https://mynumbercard.code4japan.org/static/data/20190916/all_prefectures.csv",
      "20191101":
        "https://mynumbercard.code4japan.org/static/data/20191101/all_prefectures.csv",
      "20200120":
        "https://mynumbercard.code4japan.org/static/data/20200120/all_prefectures.csv",
      "20200301":
        "https://mynumbercard.code4japan.org/static/data/20200301/all_prefectures.csv",
      "20200401":
        "https://mynumbercard.code4japan.org/static/data/20200401/all_prefectures.csv",
      "20200501":
        "https://mynumbercard.code4japan.org/static/data/20200501/all_prefectures.csv",
      "20200601":
        "https://mynumbercard.code4japan.org/static/data/20200601/all_prefectures.csv",
      "20200701":
        "https://mynumbercard.code4japan.org/static/data/20200701/all_prefectures.csv",
    },
  };
  let output = "";
  for (let key in files.all_prefectures) {
    const sheet = getSheetInstance("prefectures");
    if (!sheet) {
      output = output + `\nsheet 'prefectures' can't be loaded.`;
    } else {
      output = output + `\n load ${key}.`;
      loadcsv(sheet, key, files.all_prefectures[key]);
    }
  }
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
