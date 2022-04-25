const express = require('express')
const router = express.Router()
const con = require('../../database_config')
const initModels = require("../../models/init-models");
const { Sequelize } = require('sequelize');
const fs = require("fs");
const sequelize = new Sequelize('galeria', 'root', '', {
    host: 'localhost',
    dialect: "mysql"
});
var models = initModels(sequelize);
var Album = models.album
var Photo = models.photo
var Photo_abum = models.photo_album

router.get('/', async(req, res) => {
    const albums = await Album.findAll();
    console.log(albums.every(user => user instanceof Album));
    console.log("All albums:", JSON.stringify(albums, null, 2));
    res.send(albums)
})

router.get('/:id', async(req, res) => {
    console.log(req.params.id)
    const album = await Album.findAll({
        where: {
            album_id:req.params.id
        }
    }).then(async (r) =>{

        let  photos
        await Photo.findAll({
            where: {
                album_id:req.params.id
            }
        }).then(r =>{
            console.dir(r[0].dataValues)
            photos = r[0].dataValues
            // res.send(r[0].dataValues)
            for(i = 0; i<r.length; i++){
                
            }
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
            "photo_base64": Buffer.from(p).toString('base64')
        })
        let responce = {
            album_id: r[0].dataValues.album_id,
            album_name: r[0].dataValues.album_name,
            description: r[0].dataValues.description,

        }
        console.dir(r[0].dataValues)
        res.send(r[0].dataValues)
    });


})

router.post('/', async(req, res) => {
    console.log(req.body, "lol")
    let name = req.body.name
    let dsc = req.body.description

    const album = await Album.create({ album_id: '', album_name: name, description: dsc }).catch((err)=>console.log(err)).then(console.log("juz"));
    console.log(album.album_id);
    console.log(album.album_name);


    res.send('albumy post ')
})
router.put('/:id', async(req, res) => {
    console.log( req.body, req.params.id)
    await Album.update({ album_name: req.body.name, description: req.body.description }, {
        where: {
            album_id: req.params.id
        }
    });
    res.send('albumy put ')
})
router.delete('/:id', async(req, res) => {
    console.log(req.params.id)
    await Album.destroy({
        where: {
            album_id: req.params.id
        }
    });
    res.send('albumy delete')
})


module.exports = router