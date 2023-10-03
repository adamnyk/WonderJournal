"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const Moment = require("../models/moment");
const Tag = require("../models/tag");
const mime = require("mime/lite");

const router = new express.Router();

const {
	uploadS3Object,
	deleteS3Object,
	deleteS3Directory,
} = require("../aws/aws");
const momentNewSchema = require("../schemas/momentNew.json");
const momentUpdateSchema = require("../schemas/momentUpdate.json");
const momentSearchSchema = require("../schemas/momentSearch.json");
const tagNewSchema = require("../schemas/tagNew.json");

const { ensureLoggedIn } = require("../middleware/auth");
const { ensureMomentAccess } = require("../middleware/moment");

/** POST / { moment } => { moment }
 *
 * moment should be { title, text, [date] }
 *
 * Returns { id, title, text, date, username }
 *
 * Authorization required: logged in
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
	try {
		req.body.username = req.user.username;

		const validator = jsonschema.validate(req.body, momentNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const moment = await Moment.create(req.body);
		return res.status(201).json({ moment });
	} catch (err) {
		return next(err);
	}
});

/** GET / =>
 *   { moments: [ { id, title, text, tags }, ...] }
 * where tags is [ tag.name, ...]
 *
 * Can provide search filter in query:
 * - minSalary
 * - hasEquity (true returns only jobs with equity > 0, other values ignored)
 * - title (will find case-insensitive, partial matches)

 * Authorization required: none
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
	const q = req.query;

	// // arrive as strings from querystring, but we want as int/bool
	// if (q.minSalary !== undefined) q.minSalary = +q.minSalary;
	q.hasMedia = q.hasMedia === "true";

	try {
		const validator = jsonschema.validate(q, momentSearchSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const moments = await Moment.findAll(req.user.username, q);
		return res.json({ moments });
	} catch (err) {
		return next(err);
	}
});

/** GET /[momentId] => { moment }
 *
 * Returns { id, title, text }
 *
 * Authorization required: logged in as moment owner
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
 * Authorization required: logged in as moment owner
 *
 * ***WARNING*** This route can change the username FK of the moment. Be sure to use json validation to prevent this.
 */

router.patch("/:momentId", ensureMomentAccess, async function (req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, momentUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map((e) => e.stack);
			throw new BadRequestError(errs);
		}

		const moment = await Moment.update(req.params.momentId, req.body);
		return res.json({ moment });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /[momentId]  =>  { deleted: id }
 *
 * Deletes all associated media from S3
 *
 * Authorization required: logged in as moment owner
 */

router.delete(
	"/:momentId",
	ensureMomentAccess,
	async function (req, res, next) {
		try {
			const { momentId } = req.params;
			await Moment.remove(momentId);
			await deleteS3Directory(req.users.username, momentId);
			return res.json({ deleted: +momentId });
		} catch (err) {
			return next(err);
		}
	}
);

/********************************
 * TAGS
 */

/** POST /[momentId]/tags/  =>  { tagged: tagName  }
 *
 * Applies tag to a moment
 * Creates a new tag if one does not exist.
 *
 * request body =  { tagName }
 *
 * Authorization required: logged in as moment owner
 */

router.post(
	"/:momentId/tags/",
	ensureMomentAccess,
	async function (req, res, next) {
		try {
			const tagName = req.body.tagName.toLowerCase();
			let tagCheck = await Tag.getByName(tagName);
			console.log("tagcheck", tagCheck);
			if (tagCheck) {
				throw new BadRequestError(`A tag with that name already exists.`);
			}
			
			req.body.username = req.user.username;
			const validator = jsonschema.validate(req.body, tagNewSchema);
			if (!validator.valid) {
				const errs = validator.errors.map((e) => e.stack);
				throw new BadRequestError(errs);
			}
			const tag = await Tag.create(req.body);

			const { momentId } = req.params;
			await Moment.applyTag(momentId, tag.id);
			return res.json({ tag });
		} catch (err) {
			return next(err);
		}
	}
);

/** POST /[momentId]/tags/[tagId]  =>  { tagged: tagId  }
 *
 * Applies tag to a moment
 *
 * Authorization required: logged in as moment owner
 */

router.post(
	"/:momentId/tags/:tagId",
	ensureMomentAccess,
	async function (req, res, next) {
		try {
			const { momentId, tagId } = req.params;
			await Moment.applyTag(momentId, tagId);
			return res.json({ tagged: tagId });
		} catch (err) {
			return next(err);
		}
	}
);

/** DELETE /[momentId]/tags/[tagId]  =>  { tag: tagId applied to moment: momentId  }
 *
 * Authorization required: logged in as moment owner
 */

router.delete(
	"/:momentId/tags/:tagId",
	ensureMomentAccess,
	async function (req, res, next) {
		try {
			const { momentId, tagId } = req.params;
			await Moment.removeTag(momentId, tagId);
			return res.json({ untagged: +momentId });
		} catch (err) {
			return next(err);
		}
	}
);

/********************************
 * MOMENT MEDIA
 */

/** POST /[momentId]/tags/[tagId]  =>  { tag: tagId applied to moment: momentId  }
 *
 * Uploads media file to S3
 *
 * Authorization required: logged in as moment owner
 */

router.post(
	"/:momentId/media",
	ensureMomentAccess,
	async function (req, res, next) {
		const { username } = req.user;
		try {
			const mimetype = mime.getType(filepath);
			const url = await uploadS3Object(username, params.momentId, filepath);
			await Moment.addMedia(username, { type, url });

			return res.json({ tagged: +momentId });
		} catch (err) {
			return next(err);
		}
	}
);

module.exports = router;
