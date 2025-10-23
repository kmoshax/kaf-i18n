import { $ } from "bun";

console.log("[🧹] [build] cleaning up old build...");

await $`rm -rf dist`.catch(() =>
	console.warn("[⚠️] [build] can not remove old build files.."),
);

console.log("[📦] [build] building package ...");

const result = await Bun.build({
	entrypoints: ["./src/index.ts"],
	outdir: "./dist",
	target: "bun",
	splitting: true,
	minify: true,
});

if (!result.success) {
	console.error("[❌] [build] building failed");

	for (const message of result.logs) console.error(message);

	process.exit(1);
}

console.log("[✅] [build] build successful!");
