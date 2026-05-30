const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const source = path.join(root, "variables.json");
const target = path.join(root, "dist", "variables.json");

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.copyFileSync(source, target);
