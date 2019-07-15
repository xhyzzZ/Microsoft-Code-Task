const express = require('express');
const csv = require("csvtojson");
const url = require('url');
const readFile = require('fs').readFile;
const fs = require('fs');
const jsonexport = require('jsonexport');
const filePath = './source/input.csv';

// source data is from intput.csv
// follow the form localhost:3000/?xxx==xxx  to do some query
const app = express();

let items = [];

// convert json to csv
csv()
    .fromFile(filePath)
    .then((jsonArrayObj) => {
        items = jsonArrayObj;
        console.log(jsonArrayObj);
    })

//decode url
app.get('/', function (req, res, err) {
    const queryString = decodeURI(url.parse(req.url).query)
    const queryArray = queryString.split(/and|or/);
    var match = "Match";
    var column = "";
    var row = "";
    for (var i = 0; i < queryArray.length; i++) {
        const query = queryArray[i];

        // first operator ==
        if (query.includes("==")) {
            column = query.split("==")[0];
            row = query.split("==")[1];
            if (column === "*") {
                let bool = false;
                items.forEach((h) => {
                    for (var key in h) {
                        if (h[key] === JSON.parse(row)) {
                            h[key] = match;
                            console.log(items);
                            bool = true;
                        }
                    }
                })
                if (!bool) {
                    res.status(400).json({error: "We don't have the query term"});
                }
            } else {
                let bool = false;
                items.forEach((e) => {
                    for (key in e) {
                        if (key === column) {
                            bool = true;
                        }
                    }
                })
                if (bool) {
                    let bol = false;
                    items.forEach((e) => {
                        if (e[column] === JSON.parse(row)) {
                            e[column] = match;
                            console.log(items);
                            bol = true;
                        }
                    })
                    if (!bol) {
                        res.status(400).json({error: "We don't have such value"});
                    }
                } else {
                    res.status(400).json({error: "We don't have the query column name"});
                }
            }
        }

        // second operator !=
        else if (query.includes("!=")) {
            column = query.split("!=")[0];
            row = query.split("!=")[1];

            if (column === "*") {
                let bool = false;
                items.forEach((h) => {
                    for (var key in h){
                        if (h[key] !== JSON.parse(row)) {
                            console.log(2);
                            h[key] = match;
                            console.log(items);
                            bool = true;
                        }
                    }
                })
                if (!bool) {
                    res.status(400).json({error: "The query term is equal to all values in the csv"});
                }
            } else {
                let bool = false;
                items.forEach((e) => {
                    for (key in e) {
                        if (key === column) {
                            bool = true;
                        }
                    }
                })
                if (bool) {
                    items.forEach((e) => {
                        if (e[column] !== JSON.parse(row)) {
                            console.log(2);
                            e[column] = match;
                            console.log(items);
                        }
                    })
                } else {
                    res.status(400).json({error: "We don't have the query column name"});
                }
            }
        }

        // third operator $=
        else if (query.includes("$=")) {
            column = query.split("$=")[0];
            row = query.split("$=")[1];
            const lower = column.toLowerCase();
            const upper = column.toUpperCase();
            let bool = false;
            items.forEach((e) => {
                for (var key in e) {
                    if ((column !== key) &&
                        (upper === key) &&
                        (e[upper] === JSON.parse(row))) {
                        e[key] = match;
                        console.log(items);
                        bool = true;
                    }
                    if ((column !== key) &&
                        (lower === key) &&
                        (e[lower] === JSON.parse(row))) {
                        e[key] = match;
                        console.log(items);
                        bool = true;
                    }
                }
            })
            if (!bool) {
                res.status(400).json({error: "We don't have the query column name"});
            }
        }

        // forth operator &=
        else if (query.includes("&=")) {
            column = query.split("&=")[0];
            row = query.split("&=")[1];
            row = row.slice(1, -1)

            if (column === "*") {
                let bool = false;
                items.forEach((h) => {
                    for (var key in h){
                        const val = (h[key]).toString();
                        if (val.includes(row) === true) {
                            h[key] = match;
                            console.log(items);
                            bool = true;
                        }
                    }
                })
                if (!bool) {
                    res.status(400).json({error: "We don't have the query term"});
                }
            } else {
                let bool = false;
                items.forEach((e) => {
                    for (key in e) {
                        if (key === column) {
                            bool = true;
                        }
                    }
                })
                if (bool) {
                    let bol = false;
                    items.forEach((e) => {
                        if (e[column].includes(row) === true) {
                            e[column] = match;
                            console.log(items);
                            bol = true
                        }
                    })
                    if (!bol) {
                        res.status(400).json({error: "We don't contain such substring"});
                    }
                } else {
                    res.status(400).json({error: "We don't have the query column name"});
                }
            }
        }
        // other condition
        else {
            res.status(401).json({error: "Query: " + query + " don't have correct operator!"});
        }
    }
    res.send(items);

    // json to csv, and output to source/output.csv
    jsonexport(items,function(err, csv){
        if(err) return console.log(err);
        console.log(csv);
        fs.writeFile('./source/output.csv', csv, (err) => {
            if (err) {
                console.log(err);
            }
        })
    });
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log("The server is running");
})
