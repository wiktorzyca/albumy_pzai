const express = require('express')
let mysql = require('mysql');
const bodyParser = require('body-parser');


const app = express()
const port = 4444

const album = require('./routes/album/album')
const comment = require('./routes/album/comment')
const photo = require('./routes/album/photo')
app.use(bodyParser());
app.use(express.json());

app.use('/album',album)
app.use('/comment',comment)
app.use('/photo',photo)





app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})