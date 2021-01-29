import fs from "fs";

export function exportLineByLineJSON(dest, dataArray) {
  const writeStream = new fs.createWriteStream(dest);
  for (const data of dataArray) {
    writeStream.write(`${JSON.stringify(data)}\n`);
  }
  writeStream.end();
  writeStream.close();
}
