const insane = require("insane");
const marked = require("marked");
const hljs = require("hljs");

marked.setOptions({
    breaks: true,
    highlight: (code, lang) =>
        lang && hljs.getLanguage(lang)
        ? hljs.highlight(lang, code).value
        : hljs.highlightAuto(code).value
});

module.exports = content => marked(insane(content));