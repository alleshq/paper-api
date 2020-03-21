const db = require("../../db");
const postCardData = require("../../util/postCardData");
const getUser = require("../../util/getUser");

module.exports = async (req, res) => {
	res.json({
		posts: await Promise.all(
			(
				await db.Post.findAll({
					order: [["createdAt", "DESC"]],
					limit: 30
				})
			).map(async p => {
				const author = await getUser(p.authorId);
				return postCardData(p, author.username);
			})
		)
	});
};
