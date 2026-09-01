import { Router } from "express";
import hmpoFormWizard from "hmpo-form-wizard";
import { formFieldsMiddleware } from "../../../../lib/form-fields.js";
import { steps } from "./steps.js";
import { fields } from "./fields.js";

export const summaryRouter = Router();

summaryRouter.use((req, res, next) => {
  res.locals.query = req.query; // Makes ?edit=true available as query.edit
  next();
});

summaryRouter.use(formFieldsMiddleware);

summaryRouter.use(
  hmpoFormWizard(steps, fields, {
    name: "summary",
    journeyName: "addressCRI",
    templatePath: "summary",
  })
);
