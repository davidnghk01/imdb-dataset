import Papaparse from "papaparse";
import fs from "fs";
import { readLineByLineJSON } from "./utils/readLineByLineJSON.js";
import { createStringifyStream } from "big-json";
import { toNumber } from "./utils/toNumber.js";

async function main() {
  const principals = await readLineByLineJSON("./IMDb title_principals.json");

  const names = await new Promise((resolve, reject) =>
    Papaparse.parse(fs.createReadStream("./IMDb names.csv"), {
      header: true,
      complete: (records) => resolve(records.data),
      error: (err) => reject(err),
    })
  );
  const numberFields = [
    "height",
    "spouses",
    "divorces",
    "spouses_with_children",
    "children",
  ];
  const principalsMap = principals.reduce((current, principal) => {
    const key = principal.imdb_name_id;
    if (current[key]) current[key].push(principal);
    else current[key] = [principal];
    return current;
  }, {});

  const cleanupNames = Object.fromEntries(
    names
      .filter(({ imdb_name_id }) => principalsMap[imdb_name_id] !== undefined)
      .map((name, index) => {
        process.stdout.write(
          `Processed name ${index} records - current id : ${name.imdb_name_id} \r`
        );
        const namePrincipals = principalsMap[name.imdb_name_id];
        return [
          name.imdb_name_id,
          {
            ...Object.fromEntries(
              Object.entries(name).map(([key, value]) => {
                return [
                  key,
                  numberFields.includes(key) ? toNumber(value) : value,
                ];
              })
            ),
            principals: namePrincipals,
          },
        ];
      })
  );
  process.stdout.write(`\n`);

  createStringifyStream({
    body: cleanupNames,
  }).pipe(fs.createWriteStream("./IMDb names.json"));
}

await main();
