const db = require("../../db");
const postCardData = require("../../util/postCardData");
const getUser = require("../../util/getUser");

module.exports = async (req, res) => {
	//Search Parameter
	var searchWithUsername;
	if (typeof req.query.id === "string") {
		searchWithUsername = false;
	} else if (typeof req.query.username === "string") {
		searchWithUsername = true;
	} else {
		return res.status(400).json({err: "invalidQueryParameters"});
	}

	//Get User from Alles API
	var user;
	try {
		user = await getUser(
			searchWithUsername ? req.query.username : req.query.id,
			searchWithUsername
		);
	} catch (err) {
		if (err.response && err.response.data.err === "invalidUser") {
			return res.status(400).json({err: "invalidUser"});
		} else {
			return res.status(500).json({err: "internalError"});
		}
	}

	//Form Response
	const response = {
		id: user.id,
		username: user.username,
		name: user.name,
		about: user.about,
		plus: user.plus
	};

	//Get Posts
	if (typeof req.query.posts !== "undefined") {
		const posts = await db.Post.findAll({
			where: {
				authorId: user.id
			},
			order: [["createdAt", "DESC"]]
		});
		response.posts = posts.map(post => postCardData(post, user.username));
	}

	//Respond
	res.json(response);
};
