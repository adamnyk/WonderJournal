"use strict";

const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../expressError");
const { ensureMomentAccess } = require("./moment");
const {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("ensureMomentAccess", function () {
	test("works: param", function () {
		const req = {
			params: { momentId: "1" },
			user: { username: "testuser" },
		};
		const res = {};
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		ensureMomentAccess(req, res, next);
	});

	test("works: reqest body", function () {
		const req = {
			body: { id: "1" },
			params: {},
			user: { username: "testuser" },
		};
		const res = {};
		const next = function (err) {
			expect(err).toBeFalsy();
		};
		ensureMomentAccess(req, res, next);
	});

	test("unauth: mismatch param", function () {
		const req = {
			params: { momentId: "1" },
			user: { username: "testuser2" },
		};
		const res = {};
		const next = function (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		};
		ensureMomentAccess(req, res, next);
	});

	test("unauth: mismatch reqest body", function () {
		const req = {
			body: { id: "1" },
			params: {},
			user: { username: "testuser2" },
		};
		const res = {};
		const next = function (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		};
		ensureMomentAccess(req, res, next);
	});

	test("unauth: if anon", function () {
		const req = {
			params: { username: "testuser" },
			user:{}
		};
		const res = {};
		const next = function (err) {
			expect(err instanceof UnauthorizedError).toBeTruthy();
		};
		ensureMomentAccess(req, res, next);
	});
});
