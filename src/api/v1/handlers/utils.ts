import fs from "fs";
import path from "path";

export interface Pages {
  [id: string]: Page;
}

export interface Page {
  name: string;
  tableOfContent?: string;
  content: string;
  colNum?: number;
}

export interface ApiReferenceResponse {
  pagesHtml: Pages;
}

export const makeApiReferenceResponse = (
  projectName: string,
): ApiReferenceResponse => {
  const directoryPath = path.join(
    __dirname,
    `./../../../../docs/build/${projectName.toLowerCase()}/`,
  );

  const pages: Pages = {};
  try {
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
      const filePath = path.join(directoryPath, file);

      if (fs.statSync(filePath).isFile() && file.endsWith(".html")) {
        const fileContent = fs.readFileSync(filePath, "utf8");

        const page: Page = {
          colNum: 0,
          name: file.replace(".html", "").toLowerCase(),
          content: fileContent,
        };

        pages[page.name.toLowerCase()] = page;
      }
    }
  } catch (err) {
    console.error(err);
  }

  return {
    pagesHtml: pages,
  };
};
