import Papaparse from "papaparse";
import fs from "fs";

import { readLineByLineJSON } from "./utils/readLineByLineJSON.js";
import { exportLineByLineJSON } from "./utils/exportLineByLineJSON.js";

async function main() {
  const movies = await readLineByLineJSON("./IMDb movies.json");
  const names = await new Promise((resolve, reject) =>
    Papaparse.parse(fs.createReadStream("./IMDb names.csv"), {
      header: true,
      complete: (records) => resolve(records.data),
      error: (err) => reject(err),
    })
  );
  const principals = await new Promise((resolve, reject) =>
    Papaparse.parse(fs.createReadStream("./IMDb title_principals.csv"), {
      header: true,
      complete: (records) => resolve(records.data),
      error: (err) => reject(err),
    })
  );
  const imdbMovieIds = new Set(
    movies.map(({ imdb_title_id }) => imdb_title_id)
  );
  const imdbNameIds = new Set(names.map(({ imdb_name_id }) => imdb_name_id));
  const cleanupPrincipals = principals.filter(
    ({ imdb_title_id, imdb_name_id }) =>
      imdbMovieIds.has(imdb_title_id) && imdbNameIds.has(imdb_name_id)
  );
  exportLineByLineJSON("./IMDb title_principals.json", cleanupPrincipals);
}

await main();
