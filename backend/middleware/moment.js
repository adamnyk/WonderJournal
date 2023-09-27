"use strict";
const { UnauthorizedError } = require("../expressError");
const Moment = require("../models/moment");

/** Middleware to use when for moment routes.
 *
 * Requirements:
 * 		- provide a valid token (logged in)
 *  	- current user must be the owner of moment (either param or `id` in request body)
 *
 *  If not, raises Unauthorized.
 */
async function ensureMomentAccess(req, res, next) {
	try {

		// if (!req.user) throw new UnauthorizedError();


		const currentUser = req.user.username;

		if (!currentUser) throw new UnauthorizedError();

		const momentId = req.params.momentId || req.body.id;
		const moment = await Moment.get(momentId);

		if (moment.username !== currentUser) throw new UnauthorizedError();

		return next();
	} catch (err) {
		return next(err);
	}
}

module.exports = {
	ensureMomentAccess,
};
