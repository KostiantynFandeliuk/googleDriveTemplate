import chalk from "chalk";
import { parse } from "node-html-parser";

import { getGoogleDrivePage } from "@/app/services/google.api";

const { bgGreenBright } = chalk;

function removeStyles(htmlContent) {
  const root = parse(htmlContent);

  const allElements = root.querySelectorAll("*");
  allElements.forEach((element) => {
    element.removeAttribute("style");
  });
  return root.toString();
}

export default async function Page(props) {
  console.log(bgGreenBright("PATH"), props);

  const htmlContent = await getGoogleDrivePage(props.params.slug.join("/"));

  // console.log("foldersList", foldersList);
  const root = 1 ? removeStyles(htmlContent) : htmlContent;

  return (
    <main>
      <div dangerouslySetInnerHTML={{ __html: root.toString() }} />
    </main>
  );
}
