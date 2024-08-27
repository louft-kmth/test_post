const request = require("supertest");
const app = require("../src/app");

describe("GET /api/movies", () => {
	it("should return all movies", async () => {
		const response = await request(app).get("/api/movies");

		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.status).toEqual(200);
	});
});

describe("GET /api/movies/:id", () => {
	it("should return one movie", async () => {
		const response = await request(app).get("/api/movies/1");

		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.status).toEqual(200);
	});

	it("should return no movie", async () => {
		const response = await request(app).get("/api/movies/0");

		expect(response.status).toEqual(404);
	});
});

describe("POST /api/movies", () => {
	it("should return created movie", async () => {
		const newMovie = {
			title: "Star Wars",
			director: "George Lucas",
			year: "1977",
			color: "1",
			duration: 120,
		};

		const response = await request(app).post("/api/movies").send(newMovie);

		expect(response.status).toEqual(201);
		expect(response.body).toHaveProperty("id");
		expect(typeof response.body.id).toBe("number");
		expect(response.body).toHaveProperty("title", newMovie.title);
		expect(response.body).toHaveProperty("director", newMovie.director);
		expect(response.body).toHaveProperty("year", newMovie.year);
		expect(response.body).toHaveProperty("color", newMovie.color);
		expect(response.body).toHaveProperty("duration", newMovie.duration);

		const [result] = await database.query(
			"SELECT * FROM movies WHERE id=?",
			response.body.id,
		);

		const [movieInDatabase] = result;

		expect(movieInDatabase).toHaveProperty("id");
		expect(movieInDatabase).toHaveProperty("title", newMovie.title);
		expect(movieInDatabase).toHaveProperty("director", newMovie.director);
		expect(movieInDatabase).toHaveProperty("year", newMovie.year);
		expect(movieInDatabase).toHaveProperty("color", newMovie.color);
		expect(movieInDatabase).toHaveProperty("duration", newMovie.duration);
	});

	it("should return an error", async () => {
		const movieWithMissingProps = { title: "Harry Potter" };

		const response = await request(app)
			.post("/api/movies")
			.send(movieWithMissingProps);

		expect(response.status).toEqual(500);
	});
});
