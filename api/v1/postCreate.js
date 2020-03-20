const db = require("../../db");
const config = require("../../config");
const uuid = require("uuid").v4;

module.exports = async (req, res) => {
	//Validate Body
	if (
        typeof req.body.title !== "string" ||
		typeof req.body.image !== "string" ||
		typeof req.body.content !== "string"
	)
		return res.status(400).json({err: "invalidBodyParameters"});
    const title = req.body.title.trim();
    const slug = req.params.slug;
	const image = req.body.image.trim();
	const content = req.body.content.trim();
	if (
		title.length < config.inputBounds.title.min ||
		title.length > config.inputBounds.title.max ||
		slug.length < config.inputBounds.slug.min ||
		slug.length > config.inputBounds.slug.max ||
		image.length < config.inputBounds.image.min ||
		image.length > config.inputBounds.image.max ||
		content.length < config.inputBounds.content.min ||
		content.length > config.inputBounds.content.max
	)
		return res.status(400).json({err: "invalidBodyParameters"});
	if (!validUrl(image) || !image.startsWith("https://"))
        return res.status(400).json({err: "badImageUrl"});
    if (slug !== makeSlug(slug))
        return res.status(400).json({err: "badSlug"});

	//Check slug is not already in use
	const alreadyExists = await db.Post.findOne({
		where: {
			authorId: req.user.id,
			slug
		}
	});
	if (alreadyExists) return res.status(400).json({err: "badSlug"});

	//Create Post
	const post = await db.Post.create({
        id: uuid(),
        authorId: req.user.id,
        slug,
        title,
        content,
        image
	});

	//Response
	res.json({
        id: post.id,
        username: req.user.username,
        slug: post.slug
    });
};

//Check Valid URL
const validUrl = str => {
	// https://stackoverflow.com/a/5717133/12913019
	var pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
		"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
		"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
		"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
		"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i"
	); // fragment locator
	return !!pattern.test(str);
};

//Make a post slug
const makeSlug = v =>
	v
		.toLowerCase()
		.replace(/[^\w]+/g, "-")
		.substr(0, config.inputBounds.slug.max);
