const fs = require('fs');
const csv = require('csv-parser');

const parseCsvData = async (airportsFilePath, routesFilePath) => {

    const airportsData = await parseCsvFile(airportsFilePath);
    const routesData = await parseCsvFile(routesFilePath);

    return { airportsData, routesData };
};

/*=== The parseCsvFile function is used to read a CSV file asynchronously and parse its content into a JavaScript object ===*/
const parseCsvFile = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        /*=== fs.createReadStream(filePath) creates a readable stream from the file specified by filePath. This stream will read the file's content piece by piece rather than loading the entire file into memory at once, making it suitable for reading large files.=== */

        /*=== .pipe(csv()) pipes the data from the file stream into the csv-parser module, which is responsible for parsing the CSV content.The csv-parser converts each line of the CSV into a JavaScript object, where each row in the CSV corresponds to a JavaScript object with key-value pairs (e.g., each CSV column becomes a key and its value becomes the corresponding value).=== */


        /*=== .on('data', (data) => results.push(data)):
The data event is emitted each time a new row from the CSV file is parsed.
Each data object represents a row from the CSV, where the keys are column names, and the values are the corresponding values from that row.
The data object is pushed into the results array, which will eventually hold all the rows of the CSV as objects.


.on('end', () => resolve(results)):
When the entire CSV file has been read and parsed, the end event is triggered.
At this point, the results array, which contains all the parsed rows, is passed to the resolve() function of the promise, completing the asynchronous operation and returning=== */
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(err));
    });
};

module.exports = { parseCsvData };
