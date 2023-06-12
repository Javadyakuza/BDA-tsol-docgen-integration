import express, { NextFunction, Response, Request } from "express";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import { getApiReference } from "./api/v1/handlers/get";

import {
  Application,
  ArgumentsReader,
  TypeDocReader,
  PackageJsonReader,
  TSConfigReader,
  Renderer,
  DefaultTheme,
  ReflectionKind,
} from "typedoc";

import { generateAst } from "./ast";
import { EVERSCALE_INPAGE_PROVIDER } from "./typedoc-config";

// declare module "express" {
//   interface Request {
//     user?: User;
//     txt2ImgRequest?: APITypes.TextToImageRequest;
//     callbackUrl?: string;
//   }
//   interface Response {
//     txt2ImgResponse?: IGeneration;
//   }
// }
const app = express();
const port = 3000;

app.use(
  session({
    secret: "config.SESSION_SECRET",
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.get("/api/v1/get/api-reference", getApiReference);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res
    .status(500)
    .json({ error: `Internal Server Error: ${err.message}` })
    .send(`Internal Server Error: ${err.message}`);
});

async function main() {
  const typedocApp = new Application();
  typedocApp.options.addReader(new ArgumentsReader(0));
  typedocApp.options.addReader(new TypeDocReader());
  typedocApp.options.addReader(new PackageJsonReader());
  typedocApp.options.addReader(new TSConfigReader());
  typedocApp.options.addReader(new ArgumentsReader(300));
  await typedocApp.bootstrapWithPlugins(EVERSCALE_INPAGE_PROVIDER);
  await generateAst(typedocApp);

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server is listening on port ${port}.`);
  });
}

if (require.main === module) {
  main();
}
