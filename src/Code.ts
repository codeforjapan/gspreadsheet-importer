function loadcsv(url: string, sheetname: string) {
  var response = UrlFetchApp.fetch(url);
  var data = response.getContentText();
  var spreadsheetObj = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheetObj.getSheetByName(sheetname);
  if (sheet != null) {
    spreadsheetObj.deleteSheet(sheet);
  }
  sheet = spreadsheetObj.insertSheet(sheetname);
  var csv = Utilities.parseCsv(data);
  sheet.getRange(1, 1, csv.length, csv[0].length).setValues(csv);
}
function test() {
  loadcsv(
    "https://mynumbercard.code4japan.org/static/demographics-def6a69047912fc2c4b313a88ed61f89.csv",
    "20200601"
  );
}
