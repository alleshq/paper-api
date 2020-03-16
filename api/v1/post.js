const db = require("../../db");
const config = require("../../config");
const credentials = require("../../credentials");
const axios = require("axios");
const md = require("../../util/md");

module.exports = async (req, res) => {
	//Get Author
	var author;
	try {
		author = (
			await axios.get(
				`${config.apiUrl}/user?username=${encodeURIComponent(
					req.params.username
				)}`,
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

	//Get Post
	const post = await db.Post.findOne({
		where: {
			authorId: author.id,
			slug: req.params.slug
		}
	});
	if (!post) return res.status(400).json({err: "invalidPost"});

	res.json({
		id: post.id,
		author: {
			id: author.id,
			username: author.username,
			name: author.name,
			nickname: author.nickname,
			about: author.about,
			plus: author.plus
		},
		slug: post.slug,
		title: post.title,
		rawContent: post.content,
		htmlContent: md(post.content),
		image: post.image,
		createdAt: post.createdAt,
		updatedAt:
			post.updatedAt.getTime() !== post.createdAt.getTime()
				? post.updatedAt
				: null
	});
};
