# gspreadsheet-importer

Import csv files to specified google spreadsheet automatically

## Lisence

MIT

## REQUIREMENT

- node version 14 or later

## INSTALL

### Clone and install clasp, login

```bash
yarn install
clasp login
clasp create mynumbercard-importer --type sheets
```

Copy the Spreadsheet URL.

If you don't have permission of using App Script API, you will see below message.

```bash
Error: Permission denied. Enable the Apps Script API:
https://script.google.com/home/usersettings
```

Open the URL and allow the permission.

### Set script ID and push latest code

Open `.clasp.json` and copy `scriptID` value, then delete `appscript.json`.
Copy `.clasp.json.sample` to `.clasp.json` and replace the `YOUR_SCRIPT_ID` by the copied `scriptId`.

```bash
rm appsscript.json
cp .clasp.json.sample .clasp.json # override
vi .clasp.json
```

Push latest code

```bash
% clasp push
? Manifest file has been updated. Do you want to push and overwrite? Yes
└─ src/Code.ts
└─ src/appsscript.json
Pushed 2 files.
```

### Create Google Cloud Project and set the ID

Goto [Google Cloud Platform Console](https://console.cloud.google.com/) and create new project.

![image](https://i.imgur.com/k5eGxWv.png)

Then copy プロジェクト番号(project ID), Open GAS page and set the ID by selecting the menu `Resource` -> `Cloud Platform Project`

![image](https://i.imgur.com/DEXNlnD.png)

Enter the project ID and press 設定 button.

If you do this first time the system shows link to creating Agreement page (同意画面). Please create it from the shown link.

After that, Press 設定 button again.

Then, please set the `projectID` by running `clasp apis`.

```bash
% clasp apis list
Open this link: https://script.google.com/d/.../edit

Go to *Resource > Cloud Platform Project...* and copy your projectId
(including "project-id-")
? What is your GCP projectId? [ENTER YOUR ID]
```

### Create credential and set

Then create credential

```bash
clasp open --creds
```

The command will open new browser, then please create new credential of `OAuth client` by`＋認証情報を作成` link, The application type should be `デスクトップアプリ`, any name is OK.

![](https://i.imgur.com/5mAsUmg.png)

After creating the credential, please download the credential data, then locate it as `.cred.json` at this project root holder.

![](https://i.imgur.com/ZY4uQhx.png)

Then login again.

```bash
claspclasp login --creds .creds.json
```

### Publish executable API

Open GAS window and make executable API.

![](https://i.imgur.com/YWgSPLe.png)

Then run the test script

```bash
% clasp run test
Running in dev mode.
No response.
```

It will create new sheet named `20200601` on the spreadsheet.

If the system says that `Script API executable not published/deployed.`, please publish the app as web API and retry again.
