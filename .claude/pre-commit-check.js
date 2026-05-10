const fs = require("fs");
const { spawnSync, spawn } = require("child_process");
const http = require("http");

const d = JSON.parse(fs.readFileSync(0, "utf8"));
if (!/git commit/.test(d.tool_input.command || "")) process.exit(0);

console.log("\n--- Pre-commit check ---");

const build = spawnSync("npm", ["run", "build"], { stdio: "inherit", shell: true });
if (build.status !== 0) {
  process.stderr.write("Build failed — commit blocked\n");
  process.exit(2);
}

console.log("Starting preview server...");
const preview = spawn("npm", ["run", "preview"], { shell: true, stdio: "ignore" });

const done = (code, msg) => {
  preview.kill();
  if (msg) process.stderr.write(msg + "\n");
  process.exit(code);
};

const check = (attempts = 0) => {
  http
    .get("http://localhost:4173", (res) => {
      if (res.statusCode >= 200 && res.statusCode < 500) {
        console.log("Smoke test passed ✓\n");
        done(0);
      } else {
        done(2, `Smoke test failed (HTTP ${res.statusCode}) — commit blocked`);
      }
    })
    .on("error", () => {
      if (attempts < 15) setTimeout(() => check(attempts + 1), 500);
      else done(2, "Preview server did not respond — commit blocked");
    });
};

setTimeout(() => check(), 1000);
