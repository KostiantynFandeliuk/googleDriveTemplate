//app/api/test/route.js
import { promises } from "fs";
import path from "path";
import chalk from "chalk";
import { parse } from "node-html-parser";
import { configs } from "@/app/files";

function removeStyles(htmlContent) {
  const root = parse(htmlContent);

  const allElements = root.querySelectorAll("*");
  allElements.forEach((element) => {
    element.removeAttribute("style");
  });
  return root.toString();
}

import {
  exportGoogleDocAsText,
  getGoogleDrivePage,
  getGoogleDriveFolderFiles,
  getGoogleDriveFolders,
  watchChanges,
} from "@/app/services/google.api";
import { NextResponse } from "next/server";

const { bgGreenBright } = chalk;

export async function GET(request) {
  const folders = await getGoogleDriveFolders(process.env.A_ID);
  const files = await getGoogleDriveFolderFiles(folders.id);

  const configsDirectory = path.resolve(process.cwd(), "app/files/configs.js");
  const pageDirectory = path.resolve(process.cwd(), "app/files/pages");

  await promises.writeFile(
    configsDirectory,
    `export const configs = ${JSON.stringify(files)}`,
    "utf8"
  );

  // watchChanges().catch(console.error);

  files.map(async (fileName) => {
    const fixName = fileName.name === "index" ? "home" : fileName.name;
    const filePath = path.join(pageDirectory, `${fixName}.js`);

    if (fileName.mimeType === "application/vnd.google-apps.folder") return;

    try {
      const contentHTML = await exportGoogleDocAsText(fileName.id);

      const fileContent = `export const content = '${removeStyles(
        contentHTML
      )}'`;

      if (contentHTML.length) {
        await promises.writeFile(filePath, fileContent, "utf8");
      }
    } catch (error) {
      console.error(`Ошибка при создании файла ${filePath}:`, error);
    }
  });

  return NextResponse.json({ files });
}
