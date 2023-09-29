/** Formats date into PSQL format date string
 * dateObject => "yyyy-mm-dd"
 *
 * Returns current date if no date object is passed
 */
// function formatDate(dateObject) {
// 	const date = dateObject || new Date();
// 	const year = -date.toLocaleString("default", { year: "numeric" });
// 	const month = date.toLocaleString("default", { month: "2-digit" });
// 	const day = date.toLocaleString("default", { day: "2-digit" });

// 	const dateFormat = year + "-" + month + "-" + day;

// 	return dateFormat;
// }

/** Trip timezone stamp from the postgres-node result
 *
 * '2023-09-27T06:00:00.000Z' => 9/27/2023
 *
 */
function formatDate(pgDate) {
	function trimLeadingZeros(string) {}
	const year = parseInt(pgDate.slice(0, 4));
	const month = parseInt(pgDate.slice(5, 7));
	const day = parseInt(pgDate.slice(8, 10));

	const dateFormat = `${month}/${day}/${year}`
	return dateFormat
}

export default formatDate;
