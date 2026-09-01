/**
 * Nunjucks Helpers
 *
 * Replaces hmpo-components' locals.js middleware and filter registrations.
 * Provides:
 * - res.locals.translate / res.locals.t — translation with Nunjucks rendering
 * - res.locals.ctx — dotted-path accessor for res.locals
 * - "translate" Nunjucks filter (pipe syntax: {{ "key" | translate }})
 */

import nunjucks from "nunjucks";

/**
 * Creates the translate locals middleware.
 *
 * This replicates hmpo-components lib/locals.js — it provides res.locals.translate
 * which calls req.translate (from hmpo-i18n) and then recursively renders any
 * Nunjucks {{ }} expressions found within the translation string.
 *
 * @param {object} app - Express app (for app.locals)
 * @param {object} env - Nunjucks environment
 * @param {object} [opts] - Options (noCache for dev mode)
 * @returns {Function} Express middleware
 */
export function createTranslateMiddleware(app, env, opts = {}) {
  const renderCache = new Map();
  const noCache = opts.noCache ?? env.opts?.noCache ?? false;

  function renderString(value, context, path) {
    value = String(value);
    if (!value.includes("{{") && !value.includes("{%")) return value;

    let tmpl;
    if (!noCache && renderCache.has(value)) {
      tmpl = renderCache.get(value);
    } else {
      tmpl = new nunjucks.Template(
        value,
        env,
        "locale:" + (context.htmlLang || "en") + ":" + path
      );
      if (!noCache) {
        renderCache.set(value, tmpl);
      }
    }

    return tmpl.render(context);
  }

  function recursiveRender(value, context, path) {
    if (Array.isArray(value)) {
      return value.map((item, index) =>
        recursiveRender(item, context, path + "." + index)
      );
    }

    if (value && typeof value === "object") {
      const result = {};
      for (const key of Object.keys(value)) {
        result[key] = recursiveRender(value[key], context, path + "." + key);
      }
      return result;
    }

    return renderString(value, context, path);
  }

  return (req, res, next) => {
    Object.assign(res.locals, app.locals);

    res.locals.t = res.locals.translate = (key, options) => {
      options = options || {};
      const txt = req.translate ? req.translate(key, options) : key;
      if (txt === false || txt === undefined || txt === null) return;
      if (options.noRender) return txt;
      return recursiveRender(txt, options.context || res.locals, String(key));
    };

    res.locals.ctx = (key) =>
      key
        ? key.split(".").reduce((a, k) => a && a[k], res.locals)
        : res.locals;

    next();
  };
}

/**
 * Registers the "translate" Nunjucks filter on the environment.
 *
 * Usage in templates: {{ "pages.myPage.title" | translate }}
 *
 * The filter calls res.locals.translate (set by createTranslateMiddleware).
 * In Nunjucks filters, `this.ctx` provides access to the template context.
 *
 * @param {object} env - Nunjucks environment
 */
export function registerTranslateFilter(env) {
  env.addFilter("translate", function (txt, options) {
    return this.ctx.translate ? this.ctx.translate(txt, options) : txt;
  });
}

/**
 * Sets up all Nunjucks helpers needed to replace hmpo-components.
 *
 * Call this after nunjucks.configure() and before routes are mounted:
 *
 *   import { setupNunjucksHelpers } from './lib/nunjucks-helpers.js';
 *   const nunjucksEnv = app.get('nunjucks');
 *   setupNunjucksHelpers(app, nunjucksEnv);
 *
 * Then mount the translate middleware on your router:
 *
 *   import { createTranslateMiddleware } from './lib/nunjucks-helpers.js';
 *   router.use(createTranslateMiddleware(app, nunjucksEnv));
 *
 * @param {object} app - Express app
 * @param {object} env - Nunjucks environment
 */
export function setupNunjucksHelpers(app, env) {
  registerTranslateFilter(env);
}
