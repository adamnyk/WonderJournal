const { BadRequestError } = require("../expressError");

/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make the SET clause of an SQL UPDATE
 * statement.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 *   like { firstName: "first_name", age: "age" }
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {firstName: 'Aliya', age: 32} =>
 *   { setCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aliya', 32] }
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
	const keys = Object.keys(dataToUpdate);
	if (keys.length === 0) throw new BadRequestError("No data");

	// {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
	const cols = keys.map(
		(colName, idx) => `"${jsToSql?.[colName] || colName}"=$${idx + 1}`
	);

	return {
		setCols: cols.join(", "),
		values: Object.values(dataToUpdate),
	};
}


/**
 * Helper for making selective update queries.
 *
 * The calling function can use it to make query text and paramaters of an SQL INSERT
 * statement.
 *
 * @param dataToUpdate {Object} {field1: newVal, field2: newVal, ...}
 * @param jsToSql {Object} maps js-style data fields to database column names,
 *   like { firstName: "first_name", age: "age" }
 *
 * @returns {Object} {sqlSetCols, dataToInsert}
 *
 * @example {firstName: 'Aliya', age: 32} =>
 *   { insertCols: '(first_name, age)',
       values: '($1, $2)'
 *     params: ['Aliya', 32] }
 */
function sqlForPartialInsert(dataToInsert, jsToSql) {
	const keys = Object.keys(dataToInsert);
	if (keys.length === 0) throw new BadRequestError("No data");

	// {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
	const cols = keys.map((colName) => jsToSql?.[colName] || colName);
	const values = cols.map((col, idx) => `$${idx+1}`);

	return {
		insertCols: "(" + cols.join(", ") + ")",
		values: "(" + values.join(", ") + ")",
		params: Object.values(dataToInsert),
	};
}

module.exports = { sqlForPartialUpdate, sqlForPartialInsert };
