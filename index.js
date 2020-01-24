// -------  FILL THESE IN -------
const SOURCE_DIR = "/Users/adam.rackis/P4/depot/LoL/__MAIN__/DevRoot/Client/fe/rcp-fe-lol-friend-finder/translations";
const DEST_DIR = "/Users/adam.rackis/P4/depot/LoL/__MAIN__/DevRoot/Client/fe/rcp-fe-lol-social/translations";
// ------------------------------

const fs = require("fs");
const path = require("path");
const glob = require("glob");
const colors = require("colors");

const targetGlob = "**/*.json";
const foundFiles = glob.sync(targetGlob, { cwd: SOURCE_DIR });

const conflicts = new Map([]);

for (let file of foundFiles) {
  const sourceFile = fs.readFileSync(path.join(SOURCE_DIR, file), { encoding: "utf8" });
  const destFile = fs.readFileSync(path.join(DEST_DIR, file), { encoding: "utf8" });

  const source = eval("(" + sourceFile + ")");
  const dest = eval("(" + destFile + ")");

  Object.keys(source).forEach(k => {
    if (dest[k] && dest[k] != source[k]) {
      if (!conflicts.has(k)){
        conflicts.set(k, []);
      }
      conflicts.get(k).push(file);
      //console.log(colors.red(`Mismatch in ${file} -> ${k}. Source: \n${source[k]}\nCurrent value in destination:\n${dest[k]}\n`));
    }
  });
}

let logs = [];
for (let pair of conflicts) {
  logs.push(`${pair[0]}: ${pair[1].length}`);
  for (let file of pair[1]){
    logs.push(file);
  }
  logs.push("");
}

fs.writeFileSync("./conflicts.txt", logs.join("\n"));
