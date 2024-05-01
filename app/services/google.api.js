import { google } from "googleapis";
import chalk from "chalk";
import { auth2 } from "../configs/authConfig";

const { bgBlue } = chalk;

async function getAuthenticatedClient() {
  const OAuth2Client = google.auth.OAuth2;
  const oauth2Client = new OAuth2Client(
    auth2.client_id,
    auth2.client_secret,
    auth2.redirect_uris
  );
  oauth2Client.setCredentials({
    access_token: auth2.access_token,
    refresh_token: auth2.refresh_token,
  });
  return oauth2Client;
}

const getGoogleDriveFolders = async () => {
  try {
    const auth = await getAuthenticatedClient();
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.folder'",
      fields: "files(id, name)",
    });
    return res.data.files.find((folder) => folder.id === process.env.A_ID);
  } catch (error) {
    console.error("The API returned an error: ", error);
    throw new Error("Failed to fetch folders");
  }
};

const getGoogleDriveFolderFiles = async (folderId) => {
  try {
    const auth = await getAuthenticatedClient();
    const drive = google.drive({ version: "v3", auth });
    const res = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: "files(id, name, mimeType,parents,trashed)",
    });

    return res.data.files;
  } catch (error) {
    console.error("The API returned an error: ", error);
    throw new Error("Failed to fetch files");
  }
};

async function exportGoogleDocAsText(fileId) {
  try {
    const auth = await getAuthenticatedClient();
    const drive = google.drive({ version: "v3", auth });
    const response = await drive.files.export(
      {
        fileId: fileId,
        mimeType: "text/html",
      },
      { responseType: "stream" }
    );

    let documentText = "";
    return new Promise((resolve, reject) => {
      response.data.on("data", (chunk) => (documentText += chunk));
      response.data.on("end", () => resolve(documentText));
      response.data.on("error", reject);
    });
  } catch (error) {
    console.error("The API returned an error: ", error);
    throw new Error("Failed to fetch document");
  }
}

export async function getGoogleDrivePage(pathPage) {
  const test = await getGoogleDriveFolders();
  // console.log(bgGreen("getGoogleDriveFolders"), test);
  const files = await getGoogleDriveFolderFiles(test.id);
  // console.log(bgBlue("getGoogleDriveFolderFiles"), files);
  const currentPage = files.find((file) => {
    if (
      file.mineType !== "application/vnd.google-apps.folder" &&
      file.name === pathPage
    ) {
      return file;
    }
  });

  return currentPage?.id
    ? await exportGoogleDocAsText(currentPage.id)
    : "No content";
}
