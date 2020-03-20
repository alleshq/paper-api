const db = require("../../db");

module.exports = async (req, res) => {
	//Get Post
	const post = await db.Post.findOne({
		where: {
			authorId: req.user.id,
			slug: req.params.slug
		}
	});
	if (!post) return res.status(400).json({err: "invalidPost"});

	//Delete Post
	await post.destroy();

	//Response
	res.json({});
};
