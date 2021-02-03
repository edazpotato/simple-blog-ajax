// Service worker for fun and games ;)
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("js/unpaid-intern.js");
}

// Anchor links
showdown.extension("header-anchors", function () {
	var ancTpl =
		'$1<a id="user-content-$3" class="anchor" href="#$3" aria-hidden="true"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>$4';

	return [
		{
			type: "html",
			regex: /(<h([1-3]) id="([^"]+?)">)(.*<\/h\2>)/g,
			replace: ancTpl
		}
	];
});

const lightModeTheme = `/* Solirised light *//*
Orginal Style from ethanschoonover.com/solarized (c) Jeremy Hull <sourdrums@gmail.com>
*/

.hljs, code {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #fdf6e3;
  color: #657b83;
}

.hljs-comment,
.hljs-quote {
  color: #93a1a1;
}

/* Solarized Green */
.hljs-keyword,
.hljs-selector-tag,
.hljs-addition {
  color: #859900;
}

/* Solarized Cyan */
.hljs-number,
.hljs-string,
.hljs-meta .hljs-meta-string,
.hljs-literal,
.hljs-doctag,
.hljs-regexp {
  color: #2aa198;
}

/* Solarized Blue */
.hljs-title,
.hljs-section,
.hljs-name,
.hljs-selector-id,
.hljs-selector-class {
  color: #268bd2;
}

/* Solarized Yellow */
.hljs-attribute,
.hljs-attr,
.hljs-variable,
.hljs-template-variable,
.hljs-class .hljs-title,
.hljs-type {
  color: #b58900;
}

/* Solarized Orange */
.hljs-symbol,
.hljs-bullet,
.hljs-subst,
.hljs-meta,
.hljs-meta .hljs-keyword,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-link {
  color: #cb4b16;
}

/* Solarized Red */
.hljs-built_in,
.hljs-deletion {
  color: #dc322f;
}

.hljs-formula {
  background: #eee8d5;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}`;
const darkModeTheme = `/* Solirised dark *//*
Orginal Style from ethanschoonover.com/solarized (c) Jeremy Hull <sourdrums@gmail.com>
*/

.hljs, code {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #002b36;
  color: #839496;
}

.hljs-comment,
.hljs-quote {
  color: #586e75;
}

/* Solarized Green */
.hljs-keyword,
.hljs-selector-tag,
.hljs-addition {
  color: #859900;
}

/* Solarized Cyan */
.hljs-number,
.hljs-string,
.hljs-meta .hljs-meta-string,
.hljs-literal,
.hljs-doctag,
.hljs-regexp {
  color: #2aa198;
}

/* Solarized Blue */
.hljs-title,
.hljs-section,
.hljs-name,
.hljs-selector-id,
.hljs-selector-class {
  color: #268bd2;
}

/* Solarized Yellow */
.hljs-attribute,
.hljs-attr,
.hljs-variable,
.hljs-template-variable,
.hljs-class .hljs-title,
.hljs-type {
  color: #b58900;
}

/* Solarized Orange */
.hljs-symbol,
.hljs-bullet,
.hljs-subst,
.hljs-meta,
.hljs-meta .hljs-keyword,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-link {
  color: #cb4b16;
}

/* Solarized Red */
.hljs-built_in,
.hljs-deletion {
  color: #dc322f;
}

.hljs-formula {
  background: #073642;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}`;

// CODE
let darkMode = true;
const darkModeStyleEl = document.createElement("style");
document.head.appendChild(darkModeStyleEl);
function onDarkModeChange() {
	darkModeStyleEl.innerHTML = darkMode ? darkModeTheme : lightModeTheme;
}
onDarkModeChange();

const showdownOptions = {
	omitExtraWLInCodeBlocks: true,
	ghCompatibleHeaderId: true,
	headerLevelStart: 3,
	strikethrough: true,
	tables: true,
	tablesHeaderId: true,
	tasklists: true,
	simpleLineBreaks: true,
	ghMentions: true,
	backslashEscapesHTMLTags: true,
	underline: true,
	simplifiedAutoLink: true,
	extensions: ["header-anchors"]
};

async function doTheThings() {
	const el = document.getElementById("tree-leg");
	el.innerHTML = "<h1>LOADING!!!!!</h1>";

	// get data
	const result = await fetch("/get-dem-posts-boi.json");
	const data = JSON.parse(await result.text());

	el.innerHTML = "";

	// Loop through posts
	data.posts.forEach((post) => {
		//console.log(post);
		const converter = new showdown.Converter({
			...showdownOptions,
			prefixHeaderId: post.id
		});

		// Create post element
		const postEl = document.createElement("atricle");
		postEl.className = "post";

		const postHeaderEl = document.createElement("header");
		postHeaderEl.className = "post-header";
		postEl.appendChild(postHeaderEl);

		// Create post title
		const postTitle = document.createElement("h3");
		postTitle.className = "post-title";
		postTitle.innerText = post.title;
		postHeaderEl.appendChild(postTitle);

		// Create post link
		const postLink = document.createElement("h3");
		postLink.className = "post-link";
		// TODO;: create href using post.id

		// Create post date section
		const postDateEl = document.createElement("time");
		postDateEl.className = "post-date";
		const postDate = new Date(post.date);
		postDateEl.innerHTML = `Posted on <strong>${postDate.toLocaleDateString()}</strong> at <strong>${postDate.toLocaleTimeString()}</strong>`;
		postHeaderEl.appendChild(postDateEl);

		// Add divider between header and content
		const dividerEl = document.createElement("hr");
		dividerEl.className = "post-divider";
		postEl.appendChild(dividerEl);

		// Create post body
		const postContent = document.createElement("section");
		postContent.className = "post-content";
		// Parse markdown into HTML
		postContent.innerHTML = converter.makeHtml(post.content);
		postEl.appendChild(postContent);

		el.appendChild(postEl);
	});

	// Now hylight the syntaxes
	document
		.querySelectorAll("pre code")
		.forEach(
			(code) =>
				(code.innerHTML = hljs.highlightAuto(code.textContent).value)
		);
}

doTheThings();
