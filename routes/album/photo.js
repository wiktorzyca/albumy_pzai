const express = require('express')
const router = express.Router()
const con = require('../../database_config')
const initModels = require("../../models/init-models");
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('galeria', 'root', '', {
    host: 'localhost',
    dialect: "mysql"
});
const fs = require('fs');
const formidable = require('formidable')
var models = initModels(sequelize);

//var Album = models.album
var Photo = models.photo
//tutaj zwracasz jeszcze zdiecie w res.send, wywyłaj responce jako JSON i dam dodaj jszcze oprocz informacji o photo to jeszcze binarnie zapisany plik encodeowany w base64:
// to jest opisane tutaj https://stackoverflow.com/questions/65044928/node-express-sending-image-files-with-json-as-api-response
router.get('/:id', async(req, res) => {
    console.log(req.params.id)
    const photo = await Photo.findAll({
        where: {
            photo_id:req.params.id
        }
    }).then(r =>{
        console.dir(r[0].dataValues)
        res.send(r[0].dataValues)
    });


})
// tutaj przyjmujesz jako form data (to tez zmien w postmanie w body na form-data)
// obslugujesz request za pomoca:
//const fs = require('fs');         - to jest do dzialan na plikach
// const formidable = require('formidable')   - to jest do obslugi form-data

router.post('/', async(req, res) => {
    // console.log(req.query)
    // let title = req.query.title
    // let loc = req.query.location_id
    // let date = req.query.date

    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        // params
        let title = fields.title
        let loc = fields.location_id
        let date = fields.date


        let oldPath = files.photo.filepath;
        let rawData = fs.readFileSync(oldPath)
        //napisz funkcje ktora wyrenderuje ci uid zdięcia i bedzie zwracala uid
        //zapisz zdiecie do folderu public a nazwe daj uid i rozszerzenie to samo
        fs.writeFile('public/'+ uid ,zdiecia, rawData, function(err){
            if(err) console.log(err)
            console.log("Successfully uploaded photo")

        })
    });

    // zedytuj tak, aby dodawalo sie do tabeli photopath (dodalam w bazie danych kolumne photopath i jako value daj )
    const photo = await Album.create({ photo_id: '', photo_title: title, photo_date: date , location_id : loc }).then(console.log("juz"));

    res.send('photo post ')
})
router.put('/:id', async(req, res) => {
    console.log( req.params, req.query)
    await Photo.update({ photo_title: req.query.title, photo_date: req.query.date , location_id :  req.query.location_id }, {
        where: {
            photo_id: req.params.id
        }
    });
    res.send('photo put ')
})
//usun w bazie danych wyszukac uid zdiecia do usuniecia i usuń je z foldery /public za pomoca biblioteki fs
router.delete('/:id', async(req, res) => {
    console.log(req.params.id)
    await Photo.destroy({
        where: {
            photo_id: req.params.id
        }
    });
    res.send('photo delete')
})


module.exports = router