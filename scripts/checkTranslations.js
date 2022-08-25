/* eslint-disable no-console */
const yaml = require("js-yaml");
const fs = require("node:fs");
const path = require("node:path");

function loadYaml() {
  const locales = path.resolve(__dirname, "../src/locales");
  const dirs = fs.readdirSync(locales, { withFileTypes: true });
  const all = [];

  for (const dir of dirs) {
    const out = {};
    out.lang = dir.name;
    out.data = {};

    if (!dir.isDirectory()) {
      continue; //  probably a system file like .DS_STORE
    }

    const langDir = path.resolve(locales, dir.name);
    const dirAndFiles = fs.readdirSync(langDir, { withFileTypes: true });

    for (const entry of dirAndFiles) {
      if (entry.isDirectory()) {
        // handle nested folders?
        console.log("I dont current work with nested dirs!");
        continue;
      }

      if (!entry.name.endsWith(".yml") && !entry.name.endsWith(".yaml")) {
        console.log(`Not reading file ${entry.name} not yaml/yml file`);
        continue;
      }
      // read file and merge into single object
      const yml = yaml.load(fs.readFileSync(path.resolve(langDir, entry.name)));
      out.data = { ...yml, ...out.data };
    }
    all.push(out);
  }

  return all;
}

function compareKeys(set1, set2, set1lang, set2lang, parent) {
  const issues = [];
  const warnings = [];
  for (const key of Object.keys(set1)) {
    const set1Field = set1[key];
    const set2Field = set2[key];

    if (!set2Field) {
      // example:
      // missing homepage:title in cy
      // missing errormessage in en
      issues.push(`Missing ${parent ? parent + ":" : ""}${key} in ${set2lang}`);
      continue;
    }

    if (Array.isArray(set1Field)) {
      const set1ArrayLength = set1Field.length;
      const set2ArrayLength = set2Field.length;
      if (set1ArrayLength !== set2ArrayLength) {
        warnings.push(
          `Array ${key} length in ${set2lang} does not match same array in ${set1lang}`
        );
      }
    }

    if (typeof set1Field === "object" && !Array.isArray(set1Field)) {
      const parentKey = parent ? `${parent}:${key}` : parent; // handle if we're nested more than one level down
      const nestedResults = compareKeys(
        set1Field,
        set2Field,
        set1lang,
        set2lang,
        parentKey
      );
      issues.push(...nestedResults.issues);
      warnings.push(...nestedResults.warnings);
    }
  }
  return { issues, warnings };
}

function run() {
  try {
    const yamlData = loadYaml();
    const firstLang = yamlData.shift();
    const secondLang = yamlData.shift();

    const results1 = compareKeys(
      firstLang.data,
      secondLang.data,
      firstLang.lang,
      secondLang.lang
    );
    //compare second language to the first to check all fields match.
    const results2 = compareKeys(
      secondLang,
      firstLang,
      secondLang.lang,
      firstLang.lang
    );
    const allIssues = [...results1.issues, ...results2.issues];
    const allWarnings = [...results1.warnings, ...results2.warnings];

    for (const warning of allWarnings) {
      console.log(warning);
    }

    for (const issue of allIssues) {
      console.log(issue);
    }
    if (allIssues.length != 0) {
      console.log("******Finished with issues******\n");
      // process.exit(1);
    }
    console.log("Finished with no issues.\n");
  } catch (err) {
    console.error(err);
  }
}

run();
