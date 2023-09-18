"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const Moment = require("../models/moment");
const momentNewSchema = require("../schemas/momentNew.json");
const momentUpdateSchema = require("../schemas/momentUpdate.json");
// const momentSearchSchema = require("../schemas/momentSearch.json");

const { ensureMomentAccess } = require("../middleware/moment")
const {ensureCorrectUser} = require("../middleware/auth")

const router = express.Router();



/** POST / { moment } => { moment }
 *
 * moment should be { title, text, username }
 *
 * Returns { id, title, text, username }
 *
 * Authorization required: logged in 
 */

router.post("/", ensureCorrectUser, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, momentNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const moment = await Moment.create(req.body);
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
 * Authorization required: moment owner
 */

router.get("/:momentId", ensureMomentAccess, async function (req, res, next) {
  try {
    const moment = await Moment.get(req.params.momentId);
    return res.json({ moment });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[momentId]  { key: val, key2 : val2, ... } => { moment }
 *
 * Data can include: { title, text, date }
 *
 * Returns { id, title, text, date, username }
 *
 * Authorization required: moment owner
 * 
 * ***WARNING*** This route can change the username FK of the moment. Be sure to use json validation to prevent this. 
 */

router.patch("/:momentId", ensureMomentAccess, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, momentUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const moment = await Moment.update(req.params.momentId, req.body);
    return res.json({ moment });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin or same user-as-:username 
 */

router.delete("/:momentId", ensureMomentAccess,async function (req, res, next) {
  try {
    await Moment.remove(req.params.momentId);
    return res.json({ deleted: +req.params.momentId });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
