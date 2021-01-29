import Papaparse from "papaparse";
import fs from "fs";
import { DateTime } from "luxon";
import { exportLineByLineJSON } from "./utils/exportLineByLineJSON.js";
import { toNumber } from "./utils/toNumber.js";

async function main() {
  const movies = await new Promise((resolve, reject) =>
    Papaparse.parse(fs.createReadStream("./IMDb movies.csv"), {
      header: true,
      complete: (records) => resolve(records.data),
      error: (err) => reject(err),
    })
  );
  const numberFields = [
    "year",
    "duration",
    "avg_vote",
    "votes",
    "reviews_from_users",
    "reviews_from_critics",
  ];
  const movieHasPoster = movies
    .filter(({ imdb_title_id, year, date_published }) => {
      return (
        fs.existsSync(
          `./Poster/${year}/${imdb_title_id}/${imdb_title_id}.jpg`
        ) && !DateTime.fromISO(date_published).invalid
      );
    })
    .map(({ date_published, ...movie }) => ({
      date_published: DateTime.fromISO(date_published).toISO(),
      ...Object.fromEntries(
        Object.entries(movie).map(([key, value]) => {
          return [key, numberFields.includes(key) ? toNumber(value) : value];
        })
      ),
    }));
  exportLineByLineJSON("./IMDb movies.json", movieHasPoster);
}

await main();
