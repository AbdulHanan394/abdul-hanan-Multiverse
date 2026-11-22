// Package the verified Next prerender plus the same API adapter for a Worker host.
// Full navigations use the indexable HTML files; framework chunks hydrate them normally.
import fs from "node:fs/promises";
import path from "node:path";
import { build } from "esbuild";
const root = process.cwd();
const files = {};
const mime = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".woff2": "font/woff2",
	".webp": "image/webp",
	".svg": "image/svg+xml",
	".xml": "application/xml",
	".txt": "text/plain; charset=utf-8",
	".json": "application/json",
};
async function add(route, disk) {
	const bytes = await fs.readFile(disk);
	files[route] = [
		mime[path.extname(route)] || "text/html; charset=utf-8",
		bytes.toString("base64"),
	];
}
async function walk(dir, prefix) {
	for (const e of await fs.readdir(dir, { withFileTypes: true })) {
		const disk = path.join(dir, e.name),
			url = prefix + "/" + e.name;
		if (e.isDirectory()) await walk(disk, url);
		else if (!e.name.endsWith(".map")) await add(url, disk);
	}
}
await walk("public", "");
await walk(".next/static", "/_next/static");
const app = ".next/server/app";
await add("/", app + "/index.html");
await add("/404", app + "/_not-found.html");
async function addPages(dir, route) {
	for (const e of await fs.readdir(dir, { withFileTypes: true })) {
		if (e.isDirectory() && !e.name.includes(".") && !e.name.startsWith("["))
			await addPages(path.join(dir, e.name), route + "/" + e.name);
		else if (e.isFile() && e.name.endsWith(".html"))
			await add(route + "/" + e.name.slice(0, -5), path.join(dir, e.name));
	}
}
await addPages(app + "/projects", "/projects");
await addPages(app + "/worlds", "/worlds");
for (const name of ["sitemap.xml", "robots.txt"])
	await add("/" + name, app + "/" + name + ".body");
const worker = `import { handleApi } from "./services/api.ts";
const files=${JSON.stringify(files)};
export default { async fetch(request,env) {
 const url=new URL(request.url), key=url.pathname.replace(/\\/$/,"")||"/";
 if(key.startsWith("/api/"))return handleApi(request,env);
 if(!["GET","HEAD"].includes(request.method))return new Response(null,{status:405});
 // Next emits percent-encoded route folder brackets in chunk URLs.
 const assetKey = key.startsWith("/_next/static/") ? key.replace(/%5B/gi,"[").replace(/%5D/gi,"]") : key;
 const hit=Object.hasOwn(files,assetKey),[type,b64]=hit?files[assetKey]:files["/404"];
 const headers={"Content-Type":type,"X-Content-Type-Options":"nosniff","Cache-Control":!hit?"no-store":key.startsWith("/_next/static/")?"public,max-age=31536000,immutable":type.startsWith("text/html")?"no-cache":"public,max-age=3600"};
 return new Response(request.method==="HEAD"?null:Uint8Array.from(atob(b64),c=>c.charCodeAt(0)),{status:hit?200:404,headers});
}};`;
await fs.mkdir("dist/server", { recursive: true });
await fs.mkdir("dist/.openai", { recursive: true });
await fs.copyFile(".openai/hosting.json", "dist/.openai/hosting.json");
await build({
	stdin: { contents: worker, resolveDir: root, loader: "js" },
	outfile: "dist/server/index.js",
	platform: "browser",
	format: "esm",
	target: "es2022",
	minify: true,
	bundle: true,
});
console.log("Packaged", Object.keys(files).length, "routes and assets.");
