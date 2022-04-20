const express = require('express')
const { randomUUID } = require('crypto');
const router = express.Router()
const con = require('../../database_config')
const initModels = require("../../models/init-models");
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('galeria', 'root', '', {
    host: 'localhost',
    dialect: "mysql"
});
// const fs = require('//const fs = require(\'fs\');\n' +
//     '// const formidable = require(\'formidable\')');
// Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
const formidable = require('formidable')
var models = initModels(sequelize);

var Photo = models.photo
//tutaj zwracasz jeszcze zdiecie w res.send, wywyłaj responce jako JSON i dam dodaj jszcze oprocz informacji o photo to jeszcze binarnie zapisany plik encodeowany w base64 ogniskowa backend normalsy ambient occlusin bloom smartcontract object pooler: // zadanie : Co autor miał na myśli - res.send czy res.json
// app.get('/', function(req, res){
//     res.json({  });
// });

// to jest opisane tutaj https://stackoverflow.com/questions/65044928/node-express-sending-image-files-with-json-as-api-response tu tez jest odpiedz https://www.php.net/docs.php
const path = require('path');

const Udi = function () {
    return randomUUID();
}

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
// const formidable = require('formidable')   - to jest do obslugi form-data super mega dzięki nie wiedziałem :DDD

router.post('/', async(req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        let title = fields.title
        let loc = fields.location_id
        let date = fields.date


        let oldPath = files.photo.filepath;
        let rawData = fs.readFileSync(oldPath)
        let photo_uid = Udi();

        //zapisz zdiecie do folderu public a nazwe daj uid i rozszerzenie to samo gdzie jest to rozszerzewnie to już kurwa nie raczysz powiedzieć


        fs.writeFile(`public/${photo_uid}.png` , rawData, function(err){
            if(err) console.log(err)
            console.log("Successfully uploaded photo")

        })
    });

    // zedytuj tak, aby dodawalo sie do tabeli photopath (dodalam w bazie danych kolumne photopath i jako value daj )// tego nawet nie ma w tej jebanej bazie danych
    const photo = await Album.create({ photo_id: '', photo_title: title, photo_date: date , location_id : loc , photopath : " " }).then(console.log("JSU ale ale ale !!!"));

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
//usun w bazie danych wyszukac uid zdiecia do usuniecia i usuń je z foldery /public za pomoca biblioteki fs nie ma sprawy :)
router.delete('/public/:id', async(req, res) => {
    console.log(req.params.id)
    await Photo.destroy({
        where: {
            photo_id: req.params.id
        }
    });
    fs.unlinkSync(`public/${req.params.id}.png` , function(err){
        if(err) console.log(err)
        console.log("Successfully deleted photo")

    })
    res.send('photo delete')
})


module.exports = router


// Wiktorzyca — 18.04.2022
// to ci ktorzy nie wiedza mozemy dzisiaj pogadac na dc to wam powiem i wytłumacze
// [15:23]
// i @ghll trzeba poprawic /photo aby przesyłac zdięcie, zmieniac jego nazwe i zapisywać do odpowiedniego folderu

// ghll — 18.04.2022
// Ta ale wogole nie ma tych enpoitow od taga i komentarzy w postamanie
// [15:43]
// To napisz komentarze w tym pliki co jeszcze trzeba zrobić

// Wiktorzyca — Dziś(20.04.2022) o 17:55
// napisalam ci w tym pliku


//Miłej zabawy w sprawdzaniu czy działa ;D

