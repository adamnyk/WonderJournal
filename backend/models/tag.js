"use strict";

const db = require("../db");
const {
	NotFoundError,
	BadRequestError,
} = require("../expressError");

/** Related functions for tags. */

class Tag {
	/** Create tag with data: username, tagName
	 *
	 * Returns { id, name }
	 *
	 * Throws BadRequestError on duplicates.
	 **/

    static async create({username, tagName}) {
        tagName = tagName.toLowerCase()
		const duplicateCheck = await db.query(
			`SELECT name
          	 FROM tags
          	 WHERE name = $1 AND username = $2`,
			[tagName, username]
		);

		if (duplicateCheck.rows[0]) {
			throw new BadRequestError(`Duplicate tag: ${tagName}`);
		}


		const result = await db.query(
			`INSERT INTO tags(name, username)
           VALUES ($1, $2)
           RETURNING id, name, username`,
			[tagName, username]
		);

		const tag = result.rows[0];

		return tag;
    }

    /** Get tag from given id
     * 
     * Returns {id, name, username}
     * 
     * Throws NotFoundError if not found
     */
    static async get(id) {
        const result = await db.query(
            `SELECT id, name, username
            FROM tags
            WHERE id = $1`, [id]
        )
        const tag = result.rows[0]
        if (!tag) throw NotFoundError(`No tag with id: ${id}`)

        return tag
	}
	
    /** Get tag from given name
     * 
     * Returns {id, name, username}
     * 
     * Does not throw error if not foud. 
     */
    static async getByName(name) {
        const result = await db.query(
            `SELECT id, name, username
            FROM tags
            WHERE name = $1`, [name]
        )
        const tag = result.rows[0]

        return tag
    }

	/** Get all tags for given user.
	 *
	 * Returns [{ id, name}, ...]
	 **/

    static async getAll(username) {
		const userCheck = await db.query(
			`SELECT username
			From users
			WHERE username = $1`,
			[username]
		);
		const user = userCheck.rows[0];
        if (!user) throw new NotFoundError(`No user: ${username}`);
        
		const result = await db.query(
			`SELECT id, name
            FROM tags
           WHERE username = $1`,[username]
		);

		return result.rows;
	}


	/** Delete given tag
	 *
	 * Returns unefined
	 *
	 * Throws NotFoundError if user not found.
	 **/
    static async remove(id) {
        const result = await db.query(
            `DELETE
            FROM tags
            WHERE id = $1
            RETURNING id`, [id]
        )
        const tag = result.rows[0]
        if (!tag) throw new NotFoundError(`No tag with id: ${id}`)
    }
}

module.exports = Tag;
