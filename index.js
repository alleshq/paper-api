//Express
const express = require("express");
const app = express();

//Database
const db = require("./db");
db.sync({force: true}).then(async () => {

    const post1 = await db.Post.create({
        id: require("uuid/v4")(),
        authorId: "00000000-0000-0000-0000-000000000000",
        slug: "building-paper",
        title: "Building Paper",
        content: "blah blah blah blah",
        image: "https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Fforbestechcouncil%2Ffiles%2F2019%2F01%2Fcanva-photo-editor-8-7.jpg"
    });

    const post2 = await db.Post.create({
        id: require("uuid/v4")(),
        authorId: "00000000-0000-0000-0000-000000000000",
        slug: "spectare",
        title: "Spectare.",
        content: "Spectare is a video platform for people, not ads.",
        image: "https://media.sproutsocial.com/uploads/2017/08/Social-Media-Video-Specs-Feature-Image.png"
    });

    const like1 = await db.PostLike.create({
        userId: "00000000-0000-0000-0000-000000000000"
    });
    await post1.addPostLike(like1);

    const like2 = await db.PostLike.create({
        userId: "00000000-0000-0000-0000-000000000000"
    });
    await post2.addPostLike(like2);

    //Express Listen
    app.listen(8081, async () => {
        console.log("Listening on Express");
    });
});

//Body Parser
const bodyParser = require("body-parser");
const { post } = require("./api/v1/_");
app.use(bodyParser.json({extended: false}));

//Internal Error Handling
app.use((err, req, res, next) => {
    res.status(500).json({err: "internalError"});
});

//API
app.use("/api/v1", require("./api/v1/_"));

//404
app.use((req, res) => {
    res.status(404).json({err: "invalidRoute"});
});