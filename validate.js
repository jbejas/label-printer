const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const jsrsasign = require('jsrsasign');
const fs = require('fs');
const app = express();
const port = 9001;

const options = {
    key: fs.readFileSync('./ssl/key.key'),
    cert: fs.readFileSync('./ssl/certificate.crt')
};

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

app.post('/', (req, res) => {
    res.send('POST: Hello World!')
});

app.get('/', (req, res) => {
    res.send('GET: Hello World!')
});

app.post('/get-public-certificate', (req, res) => {
    const certificate = fs.readFileSync('./ssl/certificate.crt', 'utf-8');
    res.send(certificate)
});

app.post('/validate', (req, res) => {
    const pk = fs.readFileSync('./ssl/key.key', 'utf-8');
    const sig = new jsrsasign.KJUR.crypto.Signature({ alg: 'SHA1withRSA' })
    sig.init(pk)
    sig.updateString(req.body.toSign);
    const hex = sig.sign();
    const response = jsrsasign.stob64(jsrsasign.hextorstr(hex));
    res.send(response)
});

//app.listen(port, () => console.log(`Label Printer server listening on port ${port}!`));

https.createServer(options, app)
.listen(port, () => {
    console.log(`Label Printer server listening on port ${port}!`)
});
