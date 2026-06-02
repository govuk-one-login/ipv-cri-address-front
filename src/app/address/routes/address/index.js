import { Router } from "express";
import hmpoFormWizard from "hmpo-form-wizard";

import { steps } from "./steps.js";
import { fields } from "./fields.js";
import { sharedFields } from "../sharedFields.js";

export const addressRouter = Router();

const allFields = {
  ...fields,
  ...sharedFields,
};

addressRouter.use((req, res, next) => {
  res.locals.query = req.query; // Makes ?edit=true available as query.edit
  next();
});

addressRouter.use(
  hmpoFormWizard(steps, allFields, {
    name: "address",
    journeyName: "addressCRI",
    templatePath: "address",
  })
);
