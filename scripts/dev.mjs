// Accept the preview runner's host/port arguments and native Next dev arguments.
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const args = process.argv
	.slice(2)
	.filter((v) => v !== "--strictPort")
	.map((v) => (v === "--host" ? "--hostname" : v));
const dev = spawn(
	process.execPath,
	[require.resolve("next/dist/bin/next"), "dev", "--webpack", ...args],
	{ stdio: "inherit" },
);
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => dev.kill(sig));
dev.on("exit", (code) => process.exit(code ?? 1));
