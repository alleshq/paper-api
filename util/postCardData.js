module.exports = (post, author) => ({
    id: post.id,
    title: post.title,
    excerpt: filterContent(post.content).length <= 150 ? filterContent(post.content) : filterContent(post.content).substring(0, 147) + "...",
    username: author,
    slug: post.slug,
    image: post.image,
    createdAt: post.createdAt
});

const filterContent = content => require("remove-markdown")(content).replace(/(\r\n|\n|\r)/gm," ").trim().split(/\s+/).join(" ");