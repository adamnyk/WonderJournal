"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const Tag = require("../models/tag");

const tagNewSchema = require("../schemas/tagNew.json");

const { ensureCorrectUser, ensureLoggedIn } = require("../middleware/auth");
const { ensureTagAccess } = require("../middleware/tag");

const router = express.Router();

/** POST / { tag } => { tag : {id, name, username} }
 *
 * tag should be { tagName, username }
 *
 * Authorization required: correct user
 */

router.post("/", ensureCorrectUser, async function (req, res, next) {
	try {
		req.body.username = req.user.username;

		const validator = jsonschema.validate(req.body, tagNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const tag = await Tag.create(req.body);
		return res.status(201).json({ tag });
	} catch (err) {
		return next(err);
	}
});

/** GET  =>  { tags: { id, name } }
 *
 * Authorization required: logged in
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
	try {
		const tags = await Tag.getAll(req.user.username);
		return res.json({ tags });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /[tagId]  =>  { deleted: id }
 *
 * Authorization required: logged in as moment owner
 */

router.delete("/:tagId", ensureTagAccess, async function (req, res, next) {
	try {
		await Tag.remove(req.params.tagId);
		return res.json({ deleted: +req.params.tagId });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
