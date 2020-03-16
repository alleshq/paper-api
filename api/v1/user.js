const config = require("../../config");
const credentials = require("../../credentials");
const axios = require("axios");
const db = require("../../db");
const postCardData = require("../../util/postCardData");

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
		user = (
			await axios.get(
				`${config.apiUrl}/user?${
					searchWithUsername
						? `username=${encodeURIComponent(req.query.username)}`
						: `id=${encodeURIComponent(req.query.id)}`
				}`,
				{
					auth: {
						username: credentials.allesOAuth.id,
						password: credentials.allesOAuth.secret
					}
				}
			)
		).data;
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
			order: ["createdAt"]
		});
		response.posts = posts.map(post => postCardData(post, user.username));
	}

	//Respond
	res.json(response);
};
