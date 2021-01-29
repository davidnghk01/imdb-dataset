import fs from "fs";
import readline from "readline";

export async function readLineByLineJSON(src) {
  const fileStream = fs.createReadStream(src);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  const results = [];
  for await (const line of rl) {
    results.push(JSON.parse(line));
  }
  return results;
}
