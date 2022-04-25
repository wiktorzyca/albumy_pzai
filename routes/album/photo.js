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
const fs = require('fs');
const formidable = require('formidable')
var models = initModels(sequelize);

var Photo = models.photo
const path = require('path');
const Photo_album = models.photo_album

const { v4: uuidv4 } = require('uuid');

router.get('/:id', async(req, res) => {
    console.log(req.params.id)
    let  photo
        await Photo.findAll({
        where: {
            photo_id:req.params.id
        }
    }).then(r =>{
        console.dir(r[0].dataValues)
            photo = r[0].dataValues
        // res.send(r[0].dataValues)
    });
    let p = fs.readFileSync("public/"+photo.photopath ,'utf8' , (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(data)

    })
    res.send({
        "id" : photo.id,
        "photo_title" : photo.photo_title,
        "photo_date": photo.photo_date,
        "location_id": photo.location_id,
        "album_id": photo.album_id,
        "photo_base64": Buffer.from(p).toString('base64')
    })




})

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
        let album_id = fields.album_id


        let oldPath = files.photo.filepath;
        let rawData = fs.readFileSync(oldPath)
        let photo_uid = uuidv4();

        fs.writeFile(`public/`+photo_uid , rawData, async(err)=>{
            if(err) console.log(err)
            console.log("Successfully uploaded photo")
            const photo = await Photo.create({ photo_id: '', photo_title: title, photo_date: new Date() , location_id : loc , photopath : photo_uid, album_id: album_id }).then(async(p)=>{
                console.log(p)
                // const photo_album = await Photo_album.create({ photo_album_id: '', album_id: album_id, photo_id: p.photo_id }).then(console.log());
            } );






        })
    });

    res.send('photo post ')
})
router.put('/:id', async(req, res) => {
    console.log( req.params, req.query)
    await Photo.update({ photo_title: req.query.title , location_id :  req.query.location_id }, {
        where: {
            photo_id: req.params.id
        }
    });
    res.send('photo put ')
})
//usun w bazie danych wyszukac uid zdiecia do usuniecia i usuń je z foldery /public za pomoca biblioteki fs nie ma sprawy :)
router.delete('/:id', async(req, res) => {
    console.log(req.params.id)
    let photo

        await Photo.findAll({
        where: {
            photo_id:req.params.id
        }
    }).then(r =>{
        console.dir(r[0].dataValues)
            photo = r[0].dataValues
        //res.send(r[0].dataValues)
    });
    await Photo.destroy({
        where: {
            photo_id: req.params.id
        }
    });
    fs.unlinkSync('./public/'+photo.photopath)
    res.send('photo delete'+photo.photopath)
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

