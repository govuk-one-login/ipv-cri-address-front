import { Router } from "express";
import hmpoFormWizard from "hmpo-form-wizard";
import { formFieldsMiddleware } from "../../../../lib/form-fields.js";
import { steps } from "./steps.js";
import { fields } from "./fields.js";
import { sharedFields } from "../sharedFields.js";

export const previousRouter = Router();

const allFields = {
  ...fields,
  ...sharedFields,
};

previousRouter.use((req, res, next) => {
  res.locals.query = req.query; // Makes ?edit=true available as query.edit
  next();
});

previousRouter.use(formFieldsMiddleware);

previousRouter.use(
  hmpoFormWizard(steps, allFields, {
    name: "previous",
    journeyName: "addressCRI",
    templatePath: "previous",
  })
);
