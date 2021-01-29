import fs, { promises as asyncfs } from "fs";
import { createGzip } from "zlib";
import { readLineByLineJSON } from "./utils/readLineByLineJSON.js";

import { createStringifyStream } from "big-json";

async function main() {
  const movies = await readLineByLineJSON("./IMDb movies.json");

  const principals = await readLineByLineJSON("./IMDb title_principals.json");
  const names = JSON.parse(
    await asyncfs.readFile("./IMDb names.json", { encoding: "utf8" })
  );

  const principalsMap = principals.reduce((current, principal) => {
    const key = principal.imdb_title_id;
    if (current[key]) current[key].push(principal);
    else current[key] = [principal];
    return current;
  }, {});
  const combinedMovies = movies.map((movie, index) => {
    process.stdout.write(
      `Processed movie ${index} records - current id : ${movie.imdb_title_id} \r`
    );
    const { imdb_title_id: movieId } = movie;
    const moviePrincipals = principalsMap[movieId].sort(
      ({ order: orderA }, { order: orderB }) => Number(orderA) - Number(orderB)
    );
    return {
      ...movie,
      principals: moviePrincipals,
    };
  });
  process.stdout.write(`\n`);

  createStringifyStream({
    body: {
      movies: combinedMovies,
      names,
    },
  })
    .pipe(createGzip())
    .pipe(fs.createWriteStream("./IMDb.json.gz"));
}

await main();
