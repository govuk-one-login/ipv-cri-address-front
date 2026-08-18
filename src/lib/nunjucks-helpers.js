/**
 * Nunjucks helpers — replicates hmpo-components lib/locals.js behaviour
 * for translation rendering and template context.
 */

import nunjucks from "nunjucks";

const templateCache = new Map();

/**
 * Recursively render Nunjucks expressions ({{ }}) in a string using the
 * provided context. Caches compiled templates unless noCache is set.
 *
 * @param {string} str - String potentially containing {{ expressions }}
 * @param {object} context - Template context (res.locals)
 * @param {object} opts - Options (noCache)
 * @returns {string} Rendered string
 */
function renderNunjucksExpressions(str, context, opts = {}) {
  if (typeof str !== "string") return str;
  if (!str.includes("{{")) return str;

  let template;
  if (!opts.noCache && templateCache.has(str)) {
    template = templateCache.get(str);
  } else {
    template = new nunjucks.Template(str);
    if (!opts.noCache) {
      templateCache.set(str, template);
    }
  }

  return template.render(context);
}

/**
 * Get a value from an object using a dotted path.
 *
 * @param {object} obj - Source object
 * @param {string} path - Dotted path (e.g. 'options.fields.name')
 * @returns {*} Value at path or undefined
 */
function getByDottedPath(obj, path) {
  if (!obj || !path) return undefined;
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined) return undefined;
    current = current[part];
  }
  return current;
}

/**
 * Create Express middleware that sets up translate/t/ctx on res.locals,
 * replicating the behaviour of hmpo-components lib/locals.js.
 *
 * @param {object} app - Express app instance
 * @param {object} env - Nunjucks environment (unused but matches hmpo-components signature)
 * @param {object} opts - Options: { noCache, noRender }
 * @returns {Function} Express middleware
 */
export function createTranslateMiddleware(app, env, opts = {}) {
  return function translateMiddleware(req, res, next) {
    // Copy app.locals to res.locals (replicating hmpo-components behaviour)
    if (app && app.locals) {
      for (const [key, value] of Object.entries(app.locals)) {
        if (!(key in res.locals)) {
          res.locals[key] = value;
        }
      }
    }

    // Set up the translate function that renders Nunjucks expressions in results
    const translateFn = function translate(key, translateOpts) {
      // Call req.translate if available
      const reqTranslate = req && req.translate;
      if (!reqTranslate) return key;

      const result = reqTranslate(key, translateOpts);
      if (result === undefined || result === null) return result;

      // Handle arrays
      if (Array.isArray(result)) {
        if (opts.noRender) return result;
        return result.map((item) =>
          typeof item === "string"
            ? renderNunjucksExpressions(item, res.locals, opts)
            : item
        );
      }

      // Render Nunjucks expressions in the result
      if (typeof result === "string" && !opts.noRender) {
        return renderNunjucksExpressions(result, res.locals, opts);
      }

      return result;
    };

    res.locals.translate = translateFn;
    res.locals.t = translateFn;

    // Set up ctx — dotted-path accessor for res.locals
    res.locals.ctx = function ctx(path) {
      return getByDottedPath(res.locals, path);
    };

    next();
  };
}

/**
 * Register a 'translate' Nunjucks filter that calls this.ctx.translate.
 *
 * @param {object} env - Nunjucks environment
 */
export function registerTranslateFilter(env) {
  env.addFilter("translate", function translateFilter(key, filterOpts) {
    const ctx = this.ctx || {};
    const translate = ctx.translate;
    if (!translate) return key;
    return translate(key, filterOpts);
  });
}

/**
 * Convenience function: sets up translate filter on the Nunjucks environment.
 *
 * @param {object} app - Express app instance
 * @param {object} env - Nunjucks environment
 */
export function setupNunjucksHelpers(app, env) {
  registerTranslateFilter(env);
}
