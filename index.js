const express = require('express')
const bodyParser = require('body-parser');
const { Pool } = require('pg')

const app = express()
const port = 3000

app.use(bodyParser.text({type: '*/*'}));

const pool = new Pool({
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
    
    console.log(req.body);

    pool.query(insert, [url, req.body], (err, res) => {
	if (err) {
	    console.log(err);
	}
    })

    res.send('clip.enzobarrett.dev/' + url + '\n')
})

const select = 'SELECT clip FROM clips WHERE url=$1'

app.get('/*', (req, apiResponse, next) => {
    pool.query(select, [req.path.substr(1)], (err, res) => {
	apiResponse.send("hello world!\n");
	//if (err) {
	//    console.log(err);
	//}

	//try {
	//    apiResponse.send(res.rows[0]['clip'])
	//} catch(e) {
	//    ;
	//}
    })
})

app.listen(port, () => {
    console.log(`clipboard listening on port ${port}`)
})
