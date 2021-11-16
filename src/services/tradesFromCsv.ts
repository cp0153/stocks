// import * as fs from 'fs';
// import * as path from 'path';
// import * as csv from 'fast-csv';
import csvtojsonV2 from "csvtojson/v2";


// csv.createReadStream(path.resolve(__dirname, 'assets', 'trades.csv'))
//     .pipe(csv.parse({ headers: true }))
//     .on('error', error => console.error(error))
//     .on('data', row => console.log(row))
//     .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));

export async function readTradesFromCsv(file: Buffer) {
    let csv = file.toString();
    csvtojsonV2().fromString(csv).then(function (trades) {
        console.log(trades);
        for (const trade of trades) {
            // recreate or create new users portfolio

        }
    });
}
