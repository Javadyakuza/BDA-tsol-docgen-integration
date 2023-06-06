import { Request, Response, NextFunction } from "express";
import { ApiReferenceResponse, makeApiReferenceResponse } from "./utils";

export async function getApiReference(
  req: Request & { projectName?: string },
  res: Response & { apiReference?: ApiReferenceResponse },
  next: NextFunction,
) {
  try {
    const projectName = (req.query.projectName as string).toLowerCase();

    if (!projectName) {
      res.status(404).send("Project not found");
      return;
    }

    const apiReference = makeApiReferenceResponse(projectName);
    // console.log(apiReference);
    if (!apiReference) {
      throw new Error("apiReference is not defined");
    }

    res.apiReference = apiReference;
    res.json(apiReference);
    next();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
}
