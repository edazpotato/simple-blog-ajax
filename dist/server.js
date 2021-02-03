"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const express_formidable_1 = __importDefault(require("express-formidable"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = express_1.default();
const port = (_a = process.env.SERVER_PORT) !== null && _a !== void 0 ? _a : 80;
app.use(express_formidable_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
app.post("/create-a-fresh-spicy-new-post", (req, res) => {
    if (req.fields && req.fields.token) {
        if (req.fields.token !== process.env.POST_TOKEN) {
            return res.redirect(401, "/");
        }
        if (!req.fields.title || !req.fields.content) {
            return res.redirect(400, "/");
        }
        const date = "" + new Date();
        const post = {
            title: req.fields.title,
            content: req.fields.content,
            date,
            id: makeMeAPoggersPostID(req.fields.title, date)
        };
        if (req.files && req.files.attachment) {
            post.attachment = req.files.attachment;
            // tslint:disable-next-line:no-console
            console.log(req.files.attachment);
        }
        // tslint:disable-next-line:no-console
        console.log(post);
        const posts = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "posts.json"), {
            encoding: "utf8",
            flag: "r"
        })).posts;
        posts.unshift(post);
        fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "posts.json"), JSON.stringify({ posts }));
        res.redirect(202, "/");
    }
    else {
        return res.redirect(400, "/");
    }
});
app.get("/get-dem-posts-boi|get-dem-posts-boi.json", (req, res) => {
    const posts = fs_1.default.readFileSync(path_1.default.join(__dirname, "..", "posts.json"), {
        encoding: "utf8",
        flag: "r"
    });
    res.json(JSON.parse(posts));
});
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`App being served on http://localhost:${port}`);
});
function makeMeAPoggersPostID(title, date) {
    return (title
        .replace(/\W+(?!$)/g, "-")
        .toLowerCase()
        .replace(/\W$/, "")
        .toLowerCase() +
        "_" +
        date
            .replace(/\W+(?!$)/g, "-")
            .toLowerCase()
            .replace(/\W$/, "")
            .toLowerCase() +
        "_" +
        (Math.floor(Math.random() * Math.floor(Math.random() * 69)) *
            Math.floor(Math.random() * Math.floor(Math.random() * 69))).toString());
}
//# sourceMappingURL=server.js.map