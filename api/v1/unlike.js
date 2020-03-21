const db = require("../../db");
const getUser = require("../../util/getUser");

module.exports = async (req, res) => {
	//Get Author
	var author;
	try {
		author = await getUser(req.params.username, true);
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

	//Get Liked
	const like = (
		await post.getLikes({
			where: {
				userId: req.user.id
			}
		})
	)[0];
	if (!like) return res.json({});

	//Remove Like
	await like.destroy();

	//Response
	res.json({});
};
