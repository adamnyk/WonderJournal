import axios from "axios";

const VITE_BASE_URL =
	import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:3001";


/** API Module.
 *
 * A collection of methods used to get/send to to the API.
 */

// the token for interactive with the API will be stored here.
let token;

function setApiToken(newToken) {
	token = newToken;
}

async function request(endpoint, data = {}, method = "get") {
	console.debug("API Call:", endpoint, data, method, token);

	const url = `${VITE_BASE_URL}/${endpoint}`;
	console.log(url)
	const headers = {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json'
	};
	const params = method === "get" ? data : {};

	try {
		return (await axios({ url, method, data, params, headers })).data;
	} catch (err) {
		console.error("API Error:", err.response);
		let message = err.response.data.error.message;
		throw Array.isArray(message) ? message : [message];
	}
}

// Individual API routes

async function loginApi({ username, password }) {
	let res = await request("auth/token", { username, password }, "post");
	return res.token;
}

async function getUser(username) {
	let res = await request(`users/${username}`);
	return res.user;
}

async function signupApi(data = { username, password, firstName, email }) {
	let res = await request(`auth/register`, data, "post");
	return res.token;
}

/** Update Current User
 *
 *  Data can include:
 *   { firstName, lastName, password, email }
 * Returns { username, firstName, lastName, email }
 *
 */
async function updateUser(username, data = { firstName, lastName, email }) {
	let res = await request(`users/${username}`, data, "patch");
	return res.user;
}

async function momentCreateApi(data = { title, text, date: undefined }) {
	let res = await request(`moments/`, data, "post");
	return res.moment;
}

async function momentGetApi(momentId) {
	let res = await request(`moments/${momentId}`);
	return res.moment;
}

async function momentGetAllApi(title) {
	let res = await request(`moments/`, {title});
	return res.moments;
}

/** Tag Moment
 * 
 * 	Creates new tag and applies it to moment
 */
async function addNewMomentTagApi(momentId, data = {tagName}) {
	let res = await request(`moments/${momentId}/tags`, data, "post")
	return res.tag
}

export {
	setApiToken,
	signupApi,
	loginApi,
	getUser,
	momentCreateApi,
	momentGetApi,
	momentGetAllApi,
	addNewMomentTagApi
};
