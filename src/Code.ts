interface FileOption {
  sheetName: string; // sheet name
  fileName: string; // file or Drive name
  fileID?: string; // Google Drive/File ID
  createNew?: boolean; // create new File even if the same name of file/drive is existing. Ignored if the FileID option is specified.
}
const PROP_DRIOVE_ID = "drive_id";

function loadcsv(url: string, options: FileOption) {
  var response = UrlFetchApp.fetch(url);
  var data = response.getContentText();
  var spreadsheetObj = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheetObj.getSheetByName(options.sheetName);
  if (sheet != null) {
    spreadsheetObj.deleteSheet(sheet);
  }
  sheet = spreadsheetObj.insertSheet(options.sheetName);
  var csv = Utilities.parseCsv(data);
  sheet.getRange(1, 1, csv.length, csv[0].length).setValues(csv);
}
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
function getInitialDriveID() {
  const token = PropertiesService.getScriptProperties().getProperty(
    PROP_DRIOVE_ID
  );
  var output = "";
  if (token) {
    const folder = DriveApp.getFolderById(token);
    if (folder) {
      output = folder.getUrl();
    } else {
      output = output + "The folder doesn't exist. please run init() first.";
    }
  } else {
    output = output + "The folder doesn't exist. please run init() first.";
  }
  return output;
}
function test() {
  loadcsv(
    "https://mynumbercard.code4japan.org/static/data/20200601/demographics.csv",
    {
      sheetName: "20200601",
      fileName: "demographits",
    }
  );
}
