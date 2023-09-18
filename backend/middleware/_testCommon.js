const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
	// noinspection SqlWithoutWhere
	await db.query("DELETE FROM moments");
	// noinspection SqlWithoutWhere
	await db.query("DELETE FROM users");

	await db.query(
		`
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email)
        VALUES ('testuser', $1, 'Test1', 'User2', 'u1@email.com'),
               ('testuser2', $2, 'Test2', 'User2', 'u2@email.com')
        RETURNING username`,
		[
			await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
			await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
		]
	);

	await db.query(`
    INSERT INTO moments(id, title, text, username)
    VALUES ('1', 'M1', 'M1 text', 'testuser' ),
           ('2', 'M2', 'M2 text', 'testuser2')`);
}

async function commonBeforeEach() {
	await db.query("BEGIN");
}

async function commonAfterEach() {
	await db.query("ROLLBACK");
}

async function commonAfterAll() {
	await db.end();
}

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
};
