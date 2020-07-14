interface FileOption {
  sheetName: string;
  fileName: string;
  fileID?: string;
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
function init() {
  const token = PropertiesService.getScriptProperties().getProperty(
    PROP_DRIOVE_ID
  );
  if (token) {
    console.log(`Already initalized: drive ID = ${token}`);
  } else {
    console.log("initialize");
  }
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
