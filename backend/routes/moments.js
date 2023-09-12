"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const Moment = require("../models/moment");
const momentNewSchema = require("../schemas/momentNew.json");
const momentUpdateSchema = require("../schemas/momentUpdate.json");
// const momentSearchSchema = require("../schemas/momentSearch.json");

const router = express.Router({ mergeParams: true });


/** POST / { moment } => { moment }
 *
 * moment should be { title, text, username }
 *
 * Returns { id, title, text, username }
 *
 * Authorization required: admin or same user-as-:username 
 */

router.post("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, momentNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const moment = await Moment.create(req.params.username, req.body);
    return res.status(201).json({ moment });
  } catch (err) {
    return next(err);
  }
});

/** GET / =>
 *   { jobs: [ { id, title, salary, equity, companyHandle, companyName }, ...] }
 *
 * Can provide search filter in query:
 * - minSalary
 * - hasEquity (true returns only jobs with equity > 0, other values ignored)
 * - title (will find case-insensitive, partial matches)

 * Authorization required: none
 */

// router.get("/", async function (req, res, next) {
// //     const q = req.query;
    
// //   // arrive as strings from querystring, but we want as int/bool
// //   if (q.minSalary !== undefined) q.minSalary = +q.minSalary;
// //   q.hasEquity = q.hasEquity === "true";

//   try {
//     // const validator = jsonschema.validate(q, jobSearchSchema);
//     // if (!validator.valid) {
//     //   const errs = validator.errors.map(e => e.stack);
//     //   throw new BadRequestError(errs);
//     // }

//     const moments = await Moment.findAll(q);
//     return res.json({ jobs });
//   } catch (err) {
//     return next(err);
//   }
// });

/** GET /[momentId] => { moment }
 *
 * Returns { id, title, text }
 *
 * Authorization required: admin or same user-as-:username 
 */

router.get("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const moment = await Moment.get(req.params.username, req.params.id);
    return res.json({ moment });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[jobId]  { fld1, fld2, ... } => { job }
 *
 * Data can include: { title, salary, equity }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: admin or same user-as-:username 
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, jobUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const job = await Job.update(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin or same user-as-:username 
 */

router.delete("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    await Moment.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
