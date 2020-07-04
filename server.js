const logic = require('./logic.js')
var bodyParser=require('body-parser');
const express = require('express');
const port=process.env.PORT || 3000;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


app.get('/', (req, resp) => {
    var data = logic.getData();
    resp.setHeader("Access-Control-Allow-Origin", "*")    
    data.then((res) => {
        resp.setHeader('content-type', 'text/plain');
        resp.status(200).send(JSON.stringify(res));
    }).catch((err) => {
        resp.setHeader('content-type', 'text/plain');
        resp.status(500).send("error on our side");
    })
    
})

app.post('/addItem', (req, resp) => {
    let reqData = "";
    req.on('data', (data) => {
        reqData = data;
    });
    req.on('end', ()=> {
    
    let parsedData = JSON.parse(reqData);
    resp.setHeader("Access-Control-Allow-Origin", "*");
    logic.addDataToCSV(parsedData['Movie'], parsedData['Language'])
    .then((res) => {
        resp.setHeader('content-type', 'text/plain');
        resp.status(201).send(res);
    })
    .catch((err) => {
        if(err instanceof Error) {
        resp.setHeader('content-type', 'text/plain');
        resp.status(400).send("bad request");
        } else {
        resp.setHeader('content-type', 'text/plain');
        resp.status(500).send("error on our side");
        }
    });
});

})

app.listen(port, ()=>{
    console.log(`Server start running on ${port}`);
})