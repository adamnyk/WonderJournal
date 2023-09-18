"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate, sqlForPartialInsert } = require("../helpers/sql");

/** Related functions for companies. */

class Moment {
	/** Create a moment (from data), update db, return new moment data.
	 *
	 * Data should be { title, text, username } and can optionally include {date}
	 *
	 * Returns { id, title, text, date, username }
	 **/

	static async create(data) {
		const { insertCols, values, params } = sqlForPartialInsert(data);
		const query = `INSERT into moments ${insertCols}
						VALUES ${values}
						RETURNING id, title, text, date, username`;
		const result = await db.query(query, params);

		let moment = result.rows[0];

		return moment;
	}

	/** Find all moments of specified user(optional filter on searchFilters).
	 *
	 * searchFilters (all optional):
	 * - username (returns all moments belonging to user)
	 * - title (will find case-insensitive, partial matches)
	 * - tag (will find results that contain one or more tags)
	 * - text (will find case-insensitive, partial matches)
	 * - hasMedia (true returns only jobs with at least one object of associated media)
	 *
	 * Returns [{ id, title, momentText, username }, ...]
	 * */

	static async findAll(username, searchFilters = {}) {
		const preCheck = await db.query(
			`SELECT username
			From users
			WHERE username = $1`,
			[username]
		);
		const user = preCheck.rows[0];
		if (!user) throw new NotFoundError(`No user: ${username}`);

		const { tag, title } = searchFilters;
		let query = `SELECT m.id,
                        m.title,
                        m.text,
						COALESCE(json_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '[]') AS tags
                 	FROM moments m
					LEFT JOIN moments_tags mt ON mt.moment_id = m.id
					LEFT JOIN tags t ON t.id = mt.tag_id
                `;
		let whereExpressions = [];
		let queryValues = [];

		// For each possible search term, add to whereExpressions and
		// queryValues so we can generate the right SQL

		if (username) {
			queryValues.push(username);
			whereExpressions.push(`m.username = $${queryValues.length}`);
		}

		if (title !== undefined) {
			queryValues.push(`%${title}%`);
			whereExpressions.push(`m.title ILIKE $${queryValues.length}`);
		}

		if (whereExpressions.length > 0) {
			query += " WHERE " + whereExpressions.join(" AND ");
		}

		query += ` GROUP BY m.id`;

		if (tag !== undefined) {
			queryValues.push(tag);
			query += ` HAVING $${queryValues.length} = ANY (array_agg(t.name)) `;
		}
		// Finalize query and return results

		query += ` ORDER BY m.id`;

		console.log(queryValues);
		console.log(whereExpressions);
		console.log(query);
		const momentRes = await db.query(query, queryValues);

		return momentRes.rows;
	}

	/** Given a moment id, return data about moment.
	 *
	 * Returns { id, title, text, username}
	 *   where media is { id, url, type}
	 *
	 * Throws NotFoundError if not found.
	 **/

	static async get(id) {
		const momentRes = await db.query(
			`SELECT id,
                  title,
                  text,
				  date,
                  username
           FROM moments
           WHERE id = $1`,
			[id]
		);

		const moment = momentRes.rows[0];

		if (!moment) throw new NotFoundError(`No moment: ${id}`);

		const mediaRes = await db.query(
			`SELECT id,
                  url,
				  type
           FROM moment_media
           WHERE moment_id = $1`,
			[moment.id]
		);

		moment.media = mediaRes.rows;

		const tagRes = await db.query(
			`SELECT id, name
			FROM tags
			JOIN moments_tags mt ON id = mt.tag_id
			WHERE mt.moment_id = $1`,
			[moment.id]
		);
		moment.tags = tagRes.rows;

		return moment;
	}

	/** Update moment data with `data`.
	 *
	 * This is a "partial update" --- it's fine if data doesn't contain
	 * all the fields; this only changes provided ones.
	 *
	 * Data can include: { title, text, date}
	 *
	 * Returns { id, title, text, username }
	 *
	 * Throws NotFoundError if not found.
	 *
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
								date,
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

	/** Tag given moment with given tag
	 *
	 * returns momentId and tagId if successful.
	 */
	static async applyTag(momentId, tagId) {
		const result = await db.query(
			`INSERT INTO moments_tags (moment_id, tag_id)
			VALUES ($1, $2)
			RETURNING moment_id, tag_id
			`,
			[momentId, tagId]
		);
		return result.rows[0];
	}

	/** Removes given tag from given moment
	 *
	 * returns undefined
	 */
	static async removeTag(momentId, tagId) {
		await db.query(
			`DELETE
			FROM moments_tags
			WHERE moment_id = $1 AND tag_id = $2`,
			[momentId, tagId]
		);
	}
}

module.exports = Moment;
