
var fs = require('fs');

function getData() {
    return new Promise((resolve, reject) => {
        setTimeout(()=> {
            fs.readFile('movies.csv', 'UTF-8', (err, data) => {
                if(err) reject("error");
                try {
                let converted = convertToJSON(data);
                resolve(converted);
                } catch (e) {
                    reject(e);
                }
            })
        }, 1000);
    });
}

function convertToJSON(data) {
    if(typeof data !== 'string') throw new Error(`need string. but we got ${typeof data}`);
    let rowSplit = data.split('\r\n');
    var headers = rowSplit[0].split(',');
    if(headers[0] !== 'Movie' && headers[1] !== 'Language') throw new Error("No headers match");
    let finalresult = {};
    let result = [];
    for(let i = 1; i < rowSplit.length-1; i++) {
        let temp = rowSplit[i].split(',');
        let tempRes = {};
        tempRes["Movie"] = temp[0];
        tempRes["Language"] = temp[1];
        result.push(tempRes);
    }
    finalresult["data"] = result;
    return finalresult;
}

function addDataToCSV(title, lang) {
    return new Promise((resolve, reject) => {
        try {
        fs.appendFile('movies.csv', `${title},${lang}\r\n`, 'UTF-8', (err) => {
            if(err) reject(err);
            resolve("success");
        });
    } catch (e) {
        reject(new Error("bad request"));
    }
    });
}

module.exports = {getData, addDataToCSV};

