// typedoc-ast.js
import fs from "fs";

import { Application } from "typedoc";

import path from "path";

import { createSubCategory } from "./upgrade-ast";

const ExitCodes = {
  Ok: 0,
  OptionError: 1,
  CompileError: 3,
  ValidationError: 4,
  OutputError: 5,
  ExceptionThrown: 6,
};

// export async function generateAst(app: Application) {
//   const start = Date.now();

//   if (app.options.getValue("version")) {
//     console.log(app.toString());
//     return ExitCodes.Ok;
//   }

//   if (app.options.getValue("help")) {
//     console.log(app.options.getHelp());
//     return ExitCodes.Ok;
//   }

//   if (app.options.getValue("showConfig")) {
//     console.log(app.options.getRawValues());
//     return ExitCodes.Ok;
//   }

//   if (app.logger.hasErrors()) {
//     return ExitCodes.OptionError;
//   }
//   if (
//     app.options.getValue("treatWarningsAsErrors") &&
//     app.logger.hasWarnings()
//   ) {
//     return ExitCodes.OptionError;
//   }

//   if (app.options.getValue("watch")) {
//     app.convertAndWatch(async project => {
//       const json = app.options.getValue("json");

//       if (!json || app.options.isSet("out")) {
//         await app.generateDocs(project, app.options.getValue("out"));
//       }

//       if (json) {
//         await app.generateJson(project, json);
//       }
//     });
//     return ExitCodes.Ok;
//   }

//   const project = app.convert();
//   if (!project) {
//     return ExitCodes.CompileError;
//   }
//   if (
//     app.options.getValue("treatWarningsAsErrors") &&
//     app.logger.hasWarnings()
//   ) {
//     return ExitCodes.CompileError;
//   }

//   const preValidationWarnCount = app.logger.warningCount;
//   app.validate(project);

//   //const projectWithSubCategory = await createSubCategory(project!);
//   const hadValidationWarnings =
//     app.logger.warningCount !== preValidationWarnCount;
//   if (app.logger.hasErrors()) {
//     return ExitCodes.ValidationError;
//   }
//   if (
//     hadValidationWarnings &&
//     (app.options.getValue("treatWarningsAsErrors") ||
//       app.options.getValue("treatValidationWarningsAsErrors"))
//   ) {
//     return ExitCodes.ValidationError;
//   }

//   if (app.options.getValue("emit") !== "none") {
//     const json = app.options.getValue("json");
//     if (!json || app.options.isSet("out")) {
//       await app.generateDocs(project, app.options.getValue("out"));
//       await app.generateJson(project, json!);

//       const ast = JSON.parse(fs.readFileSync(json!, "utf-8"));

//       // ast.subCategories = projectWithSubCategory.subCategory?.toObject(
//       //   app.serializer,
//       // );
//       // fs.writeFileSync(
//       //   path.resolve(__dirname, json!),
//       //   JSON.stringify(ast, null, 2),
//       // );
//     }

//     if (app.logger.hasErrors()) {
//       return ExitCodes.OutputError;
//     }
//     if (
//       app.options.getValue("treatWarningsAsErrors") &&
//       app.logger.hasWarnings()
//     ) {
//       return ExitCodes.OutputError;
//     }
//   }

//   app.logger.verbose(`Full run took ${Date.now() - start}ms`);
//   return ExitCodes.Ok;
// }
export async function generateAst(app: Application) {
  const start = Date.now();

  if (app.options.getValue("version")) {
    console.log(app.toString());
    return ExitCodes.Ok;
  }

  if (app.options.getValue("help")) {
    console.log(app.options.getHelp());
    return ExitCodes.Ok;
  }

  if (app.options.getValue("showConfig")) {
    console.log(app.options.getRawValues());
    return ExitCodes.Ok;
  }

  if (app.logger.hasErrors()) {
    return ExitCodes.OptionError;
  }
  if (
    app.options.getValue("treatWarningsAsErrors") &&
    app.logger.hasWarnings()
  ) {
    return ExitCodes.OptionError;
  }

  // if (app.options.getValue("watch")) {
  //   app.convertAndWatch(async project => {
  //     const json = app.options.getValue("json");

  //     if (!json || app.options.isSet("out")) {
  //       await app.generateDocs(project, app.options.getValue("out"));
  //     }

  //     if (json) {
  //       await app.generateJson(project, json);
  //     }
  //   });
  //   return ExitCodes.Ok;
  // }

  // const project = app.convert();
  const astPath = path.resolve(
    __dirname,
    "./../everscale-inpage-provider/ast.json",
  );
  const ast = JSON.parse(fs.readFileSync(astPath, "utf-8"));
  let project = app.deserializer.reviveProject(ast);

  project = await createSubCategory(project!);
  if (!project) {
    return ExitCodes.CompileError;
  }
  if (
    app.options.getValue("treatWarningsAsErrors") &&
    app.logger.hasWarnings()
  ) {
    return ExitCodes.CompileError;
  }

  const preValidationWarnCount = app.logger.warningCount;
  app.validate(project);
  const hadValidationWarnings =
    app.logger.warningCount !== preValidationWarnCount;
  if (app.logger.hasErrors()) {
    return ExitCodes.ValidationError;
  }
  if (
    hadValidationWarnings &&
    (app.options.getValue("treatWarningsAsErrors") ||
      app.options.getValue("treatValidationWarningsAsErrors"))
  ) {
    return ExitCodes.ValidationError;
  }

  if (app.options.getValue("emit") !== "none") {
    const json = app.options.getValue("json");
    if (!json || app.options.isSet("out")) {
      await app.generateDocs(project, app.options.getValue("out"));
    }

    // if (json) {
    //   await app.generateJson(project, json);
    // }

    if (app.logger.hasErrors()) {
      return ExitCodes.OutputError;
    }
    if (
      app.options.getValue("treatWarningsAsErrors") &&
      app.logger.hasWarnings()
    ) {
      return ExitCodes.OutputError;
    }
  }

  app.logger.verbose(`Full run took ${Date.now() - start}ms`);
  return ExitCodes.Ok;
}
