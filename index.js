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
        content: `
Hi! Welcome to Textbox.

This is a **Document**. Each document has its own unique 6 character code, for example, 69abwj.
In order to create your own document, you can go to the [homepage](/), but you'll need an AllesID to sign in with. If you want one, [fill in this form](https://forms.gle/4sukStiQ9Udp7N5z6).

When you create a document, you can select "Highlighting" and "Markdown". Highlighting is selected by default, and it is intended for when you write code. For example,
\`\`\`js
const getDoc = require("../../util/doc");

module.exports = async (req, res) => {
    const doc = await getDoc(req.params.code);
    if (!doc) return res.status(400).json({err: "invalidDocument"});

    res.status(200).type("text/plain").send(doc.content);
};
\`\`\`

With document highlighting enabled, it will automatically detect the language. You could also enable markdown, however, markdown often doesn't work too well with syntax highlighting *also* enabled.

In markdown, you can do things like make stuff **bold**, or *italic* or ~~cross stuff out~~.
You can also write code and specify the language, in order to have just parts of your doc highlighted, as seen above.

Documents have an api url, for example, https://textbox.alles.cx/api/v1/doc/69abwj. You can also request the raw document content (without markdown or highlighting rendered) by [appending /raw](https://textbox.alles.cx/api/v1/doc/69abwj). This could be used to download scripts, or to see the markdown formatting.

Additionally, every doc page has [Counter](https://counter.alles.cx) embedded, which means you can see how many views your doc has had in the last 24 hours, which can be useful. You can also add Counter to your own site, see the website for instructions.

Anyway, that's all for now. Did I mention you can embed images with markdown? Here's a nice one from Unsplash:

![Unsplash Image](https://images.unsplash.com/photo-1572731013456-5ed911024bfa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80)
_Source: [textbox/69abwj](https://textbox.alles.cx/69abwj)_
        `,
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