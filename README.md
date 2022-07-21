# gspreadsheet-importer
| ⚠️ This repository has been archived and will no longer be maintained. Thanks for all the stars, help and brainstorms! |

Import csv files to specified google spreadsheet automatically

## Lisence

MIT

## REQUIREMENT

- node version 14 or later

## INSTALL

### Clone this script

```bash
git clone git@github.com:codeforjapan/gspreadsheet-importer.git
cd gspreadsheet-importer
```

### Clone and install clasp, login

`clasp login` will open browser and ask your permissions.

```bash
yarn install
clasp login
clasp create [YOUR_PROJECT_NAME] --type standalone  # select `standalone` if you need to select
```

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
cp .clasp.json.sample .clasp.json # overwrite file
vi .clasp.json
```

Push latest code. Please answer `y` to confirmation of overwriting manifest.

```bash
% clasp push
? Manifest file has been updated. Do you want to push and overwrite? Yes
└─ src/Code.ts
└─ src/appsscript.json
Pushed 2 files.
```

### Create Google Cloud Project and set the ID

Goto [Google Cloud Platform Console](https://console.cloud.google.com/) and create new project.

![image](https://i.imgur.com/YMgaus6.png)

### Enable Google Drive API on the project

Please find `Google Drive API` from search box and enable it.

![image](https://i.imgur.com/P8f1B4Y.png)

### Copy project ID and set it to the script

Then copy `Project number` and `Project ID`. (You will use `Project ID` later).

![image](https://i.imgur.com/MvMvorJ.png)

Open GAS page by executing `clasp open` and set the copied `Project number` by selecting the menu `Resources` -> `Cloud Platform Project`

![image](https://i.imgur.com/fRsXKo7.png)

Paste the copied project ID and press `Set Project` button.

### Create agreement page

If you do this first time the system shows link to creating OAuth consent screen. Please create it from the shown link. (Internal user type is OK. Just set application name and save.)

![](https://i.imgur.com/1EDErbb.png)

After that, back to the google apps script page and press `Set Project` button again.

You will see below message. Now you can close this window.

![image](https://i.imgur.com/AbpyMq1.png)

### Set project ID

Then, please set the previously copied `Project ID` by running `clasp apis list`.

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

The command will open new browser, then please create new credential of `OAuth client ID` by`＋CREATE CREDENTIALS` link, The application type should be `Desktop App`, any name is OK.

![image](https://i.imgur.com/5mAsUmg.png)

After creating the credential, please download the credential data, then locate it as `.cred.json` at this project root holder.

![image](https://i.imgur.com/nZ5i1Xk.png)

```bash
mv ~/Downloads/client_secret_xxxxxx.apps.googleusercontent.com.json ./.cred.json
```

Then login using the credential file. Below command will open browser to allow permissions again.

```bash
clasp login --creds .creds.json
```

### Deploy Web API

Open GAS window and publish the script as a web api from publish -> Deploy as web app.

```bash
clasp open
```

![image](https://i.imgur.com/CJuEqj5.png)

### setup deploymant ID

Get deployment ID by running `clasp deployments` and copy the ID of `web app meta-version`.

```bash
% clasp deployments
2 Deployments.
- AKfycbw8ryblmM3eNxe0_...... @HEAD
- AKfycbw3395mg1mABA1YS...... @1 - web app meta-version # ← Copy this ID
```

Then craete .env file for the deployment

```bash
echo 'DEPLOYMENT_ID="[THE_DEPLOYMENT_ID]"' > .env
```

### initialize

You can initialize this script by running init function.

```bash
% clasp run init # it will require
Running in dev mode.
No response.
```

It will create new drive named `gspreadsheet-importer` on your root drive.

### test

You can run GAS function by using `clasp run`.
Please run test function by running this command.

```bash
clasp run test
```

This will import csv file from this site: https://mynumbercard.code4japan.org/ .

Please open your drive and confirm the files are imported. You can get Google Drive URL by blow command:

```bash
% clasp run getInitialDriveID
Running in dev mode.
https://drive.google.com/drive/folders/1WdDDE.....
```

### Write your own script

Please implement `sync()` method in the `Code.ts` file.
You can run this function by running `clasp run sync`.

### Publish the source from next time

If you changed the script and wants to apply the changes, please run:

```bash
make push
```
