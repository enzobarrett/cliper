const express = require('express')
const bodyParser = require('body-parser');
const { Pool } = require('pg')
const path = require('path');

const app = express()
const port = 3000

app.use(bodyParser.text({type: '*/*'}));

var env = process.argv[2] || 'prod';

var host = 'localhost';

if (env == 'prod')
    host = 'postgres';

const pool = new Pool({
    host: host,
    user: 'postgres',
    password: 'mycoolpassword'
})

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
	result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const insert = 'INSERT INTO clips VALUES ($1, $2)'

app.post('/', (req, res, next) => {
    const url = makeid(4)

    pool.query(insert, [url, req.body], (err, res) => {
	if (err) {
	    next(err)
	}
    })

    res.send('clip.enzobarrett.dev/' + url + '\n')
})

const select = 'SELECT clip FROM clips WHERE url=$1'

app.get(/\/.{4}/, (req, apiResponse, next) => {
    pool.query(select, [req.path.substr(1)], (err, res) => {
	if (err) {
	    next(err);
	}

	if (res.rows != undefined)
	    apiResponse.send(res.rows[0]['clip'])
	else
	    apiResponse.send('invalid url\n');
    })
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
})

app.listen(port, () => {
    console.log(`clipboard listening on port ${port}`)
})
