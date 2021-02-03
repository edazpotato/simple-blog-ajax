import dotenv from "dotenv";
import express from "express";
import formidable from "express-formidable";
import fs from "fs";
import path from "path";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT ?? 80;

app.use(formidable());

app.use(express.static(path.join(__dirname, "..", "public")));

interface BlogPost {
	title: string;
	content: string;
	date: string;
	id: string;
	attachment?: any;
}

app.post("/create-a-fresh-spicy-new-post", (req, res) => {
	if (req.fields && req.fields.token) {
		if (req.fields.token !== process.env.POST_TOKEN) {
			return res.redirect(401, "/");
		}
		if (!req.fields.title || !req.fields.content) {
			return res.redirect(400, "/");
		}
		const date = "" + new Date();
		const post: BlogPost = {
			title: req.fields.title as string,
			content: req.fields.content as string,
			date,
			id: makeMeAPoggersPostID(req.fields.title as string, date)
		};
		if (req.files && req.files.attachment) {
			post.attachment = req.files.attachment;
			// tslint:disable-next-line:no-console
			console.log(req.files.attachment);
		}
		// tslint:disable-next-line:no-console
		console.log(post);
		const posts = JSON.parse(
			fs.readFileSync(path.join(__dirname, "..", "posts.json"), {
				encoding: "utf8",
				flag: "r"
			})
		).posts;
		posts.unshift(post);
		fs.writeFileSync(
			path.join(__dirname, "..", "posts.json"),
			JSON.stringify({ posts })
		);
		res.redirect(202, "/");
	} else {
		return res.redirect(400, "/");
	}
});

app.get("/get-dem-posts-boi|get-dem-posts-boi.json", (req, res) => {
	const posts = fs.readFileSync(path.join(__dirname, "..", "posts.json"), {
		encoding: "utf8",
		flag: "r"
	});
	res.json(JSON.parse(posts));
});

app.listen(port, () => {
	// tslint:disable-next-line:no-console
	console.log(`App being served on http://localhost:${port}`);
});

function makeMeAPoggersPostID(title: string, date: string) {
	return (
		title
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
		(
			Math.floor(Math.random() * Math.floor(Math.random() * 69)) *
			Math.floor(Math.random() * Math.floor(Math.random() * 69))
		).toString()
	);
}
