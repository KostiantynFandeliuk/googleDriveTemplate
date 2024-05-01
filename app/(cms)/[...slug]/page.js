"use client";

import { useEffect, useState } from "react";
import { configs } from "@/app/files";
import { usePathname } from "next/navigation";

// import chalk from "chalk";
// import { parse } from "node-html-parser";

// import { getGoogleDrivePage } from "@/app/services/google.api";

// const { bgGreenBright } = chalk;

// function removeStyles(htmlContent) {
//   const root = parse(htmlContent);

//   const allElements = root.querySelectorAll("*");
//   allElements.forEach((element) => {
//     element.removeAttribute("style");
//   });
//   return root.toString();
// }

export default function Page(props) {
  const pathname = usePathname();
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const gettest = async () => {
      const response = await fetch("/test/a", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response?.json();

      const importedModule = await import(
        `@/app/files/pages/${pathname.split("/").join("")}`
      );

      setHtmlContent(importedModule.content);
    };

    gettest();
  }, [pathname]);

  return (
    <main>
      {/* {content} */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </main>
  );
}
