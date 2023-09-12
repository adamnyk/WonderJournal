"use strict";

const db = require("../db");
const { NotFoundError, UnauthorizedError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for companies. */

class Moment {
	/** Create a moment (from data), update db, return new moment data.
	 *
	 * json request body should be { title, type }
	 *
	 * Returns { id, title, type, username }
	 **/

	static async create(username, { title, text }) {
		const preCheck = await db.query(
			`SELECT username
      		FROM users
      		WHERE username = $1`, [username]);
    const user = preCheck.rows[0];
    
    if (!user) throw new NotFoundError(`No user: ${username}`);

		const result = await db.query(
			`INSERT INTO moments (title,
                               	text,
                                username)
           VALUES ($1, $2, $3)
           RETURNING id, title, text, username`,
			[title, text, username]
		);
		let moment = result.rows[0];

		return moment;
	}

	/** Find all moments of specified user(optional filter on searchFilters).
	 *
	 * searchFilters (all optional):
	 * - username (returns all moments belonging to user)
	 * - hasMedia (true returns only jobs with at least one object of associated media)
	 * - hasTag (will find results that contain one or more tags)
	 * - title (will find case-insensitive, partial matches)
	 * - text (will find case-insensitive, partial matches)
	 *
	 * Returns [{ id, title, momentText, username }, ...]
	 * */

	static async findAll({ username, hasMedia, tag, title, text } = {}) {
		let query = `SELECT m.id,
                        m.title,
                        m.text,
                        m.username,
                 FROM moments
                   LEFT JOIN media AS med ON c.handle = j.company_handle`;
		let whereExpressions = [];
		let queryValues = [];

		// For each possible search term, add to whereExpressions and
		// queryValues so we can generate the right SQL

		if (username) {
			queryValues.push(username);
			whereExpressions.push(`m.username = $${queryValues.length}`);
		}

		if (hasMedia === true) {
			queryValues.push(hasMedia);
			whereExpressions.push(`media $${queryValues.length}`);
		}

		if (hasEquity === true) {
			whereExpressions.push(`equity > 0`);
		}

		if (title !== undefined) {
			queryValues.push(`%${title}%`);
			whereExpressions.push(`title ILIKE $${queryValues.length}`);
		}

		if (whereExpressions.length > 0) {
			query += " WHERE " + whereExpressions.join(" AND ");
		}

		// Finalize query and return results

		query += " ORDER BY id";
		const jobsRes = await db.query(query, queryValues);

		// Optional 2nd query for media
		if (hasMedia !== undefined) {
			let mediaQuery = `SELECT id`;
		}

		return jobsRes.rows;
	}

	/** Given a moment id, return data about moment.
	 *
	 * Returns { id, title, text, username}
	 *   where media is { mediaId, mediaURL}
	 *
	 * Throws NotFoundError if not found.
	 **/

	static async get(username, id) {
		const momentRes = await db.query(
			`SELECT id,
                  title,
                  text,
                  username
           FROM moments
           WHERE id = $1 AND username = $2`,
			[id, username]
		);

		const moment = momentRes.rows[0];

		if (!moment) throw new NotFoundError(`No moment: ${id}`);

		const mediaRes = await db.query(
			`SELECT id,
                  url
           FROM media
           WHERE moment_id = $1`,
			[moment.id]
		);

		moment.media = mediaRes.rows;

		return moment;
	}

	/** Update moment data with `data`.
	 *
	 * This is a "partial update" --- it's fine if data doesn't contain
	 * all the fields; this only changes provided ones.
	 *
	 * Data can include: { title, text }
	 *
	 * Returns { id, title, text, username }
	 *
	 * Throws NotFoundError if not found.
	 */

	static async update(id, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {});
		const idVarIdx = "$" + (values.length + 1);

		const querySql = `UPDATE moments 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                title, 
                                text, 
                                username`;
		const result = await db.query(querySql, [...values, id]);
		const moment = result.rows[0];

		if (!moment) throw new NotFoundError(`No moment: ${id}`);

		return moment;
	}

	/** Delete given moment from database; returns undefined.
	 *
	 * Throws NotFoundError if company not found.
	 **/

	static async remove(id) {
		const result = await db.query(
			`DELETE
           FROM moments
           WHERE id = $1
           RETURNING id`,
			[id]
		);
		const moment = result.rows[0];

		if (!moment) throw new NotFoundError(`No moment: ${id}`);
	}
}

module.exports = Moment;
