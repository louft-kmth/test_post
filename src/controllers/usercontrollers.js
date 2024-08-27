const database = require("../../database");

const getusers = (req, res) => {
	let sql = "SELECT * FROM users";
	const sqlvalues = [];

	if (req.query.language != null) {
		sqlvalues.push({
			column: "language",
			value: req.query.language,
			operator: "=",
		});
	}
	if (req.query.city != null) {
		sqlvalues.push({
			column: "city",
			value: req.query.city,
			operator: "=",
		});
	}

	sql = sqlvalues.reduce(
		(sql, { column, operator }, index) =>
			`${sql} ${index === 0 ? "WHERE" : "AND"} ${column} ${operator} ?`,
		sql,
	);

	database
		.query(
			sql,
			sqlvalues.map(({ value }) => value),
		)
		.then(([users]) => {
			res.status(200).json(users);
		})
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
};

const getusersid = (req, res) => {
	const id = parseInt(req.params.id);
	database
		.query("SELECT * FROM users WHERE id = ?", [id])
		.then(([users]) => {
			if (users[0] != null) {
				res.status(200).json(users[0]);
			} else {
				res.sendStatus(404);
			}
		})
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
};
const Postusers = (req, res) => {
	const { firstname, lastname, email, city, language } = req.body;
	database
		.query(
			"INSERT INTO users (firstname, lastname, email, city, language) VALUES (?,?,?,?,?)",
			[firstname, lastname, email, city, language],
		)
		.then(([result]) => {
			res.status(201).send({ id: result.insertId });
		})
		.catch((err) => {
			console.error(err);
			res.sendStatus(500);
		});
};

module.exports = {
	getusers,
	getusersid,
	Postusers,
};
