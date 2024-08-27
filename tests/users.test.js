const request = require("supertest");
const database = require("../database");
const app = require("../src/app");
const crypto = require("node:crypto");

afterAll(() => database.end());
//test pour les utilisateurs existants
describe("GET /api/users", () => {
	it("should return all users", async () => {
		const response = await request(app).get("/api/users");

		expect(response.headers["content-type"]).toMatch(/json/);

		expect(response.status).toEqual(200);
	});
});

describe("GET /api/users/:id", () => {
	it("should return one user", async () => {
		const response = await request(app).get("/api/users/1");

		expect(response.headers["content-type"]).toMatch(/json/);

		expect(response.status).toEqual(200);
	});

	it("should return no user", async () => {
		const response = await request(app).get("/api/users/0");

		expect(response.status).toEqual(404);
	});
});
//test pour POST creation utilisateurs:
describe("POST /api/users", () => {
	it("should return created user", async () => {
		const newUser = {
			firstname: "Marie",
			lastname: "Martin",
			email: `${crypto.randomUUID()}@wild.co`,
			city: "Paris",
			language: "French",
		};
		const response = await request(app).post("/api/users").send(newUser);

		expect(response.status).toEqual(201);
		expect(response.body).toHaveProperty("id");
		expect(typeof response.body.id).toBe("number");
		expect(response.body).toHaveProperty("firstname", newUser.firstname);
		expect(response.body).toHaveProperty("lastname", newUser.lastname);
		expect(response.body).toHaveProperty("email", newUser.email);
		expect(response.body).toHaveProperty("city", newUser.city);
		expect(response.body).toHaveProperty("language", newUser.language);

		const [result] = await database.query(
			"SELECT * FROM users WHERE id=?",
			response.body.id,
		);

		const [userInDatabase] = result;

		expect(userInDatabase).toHaveProperty("id");
		expect(userInDatabase).toHaveProperty("firstname", newUser.firstname);
		expect(userInDatabase).toHaveProperty("lastname", newUser.lastname);
		expect(userInDatabase).toHaveProperty("email", newUser.email);
		expect(userInDatabase).toHaveProperty("city", newUser.city);
		expect(userInDatabase).toHaveProperty("language", newUser.language);
	});
	it("should return an error", async () => {
		const userWithMissingProps = { firstname: "tata" };

		const response = await request(app)
			.post("/api/users")
			.send(userWithMissingProps);

		expect(response.status).toEqual(500);
	});
});
