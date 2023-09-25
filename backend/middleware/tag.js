const { UnauthorizedError } = require("../expressError");
const Tag = require("../models/moment");

/** Middleware to use when for tag routes.
 *
 * Requirements:
 * 		- provide a valid token (logged in)
 *  	- current user must be the owner of tag (either param or `id` in request body)
 *
 *  If not, raises Unauthorized.
 */
async function ensureTagAccess(req, res, next) {
	try {
		const currentUser = req.user.username;
		if (!currentUser) throw new UnauthorizedError();

		const tagId = req.params.tagId || req.body.id;
		const tag = await Tag.get(tagId);

		if (tag.username !== currentUser) throw new UnauthorizedError();

		return next();
	} catch (err) {
		return next(err);
	}
}

module.exports = {
	ensureTagAccess,
};
