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
var PhotoTag = models.photo_tag
var Location = models.location
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
router.get('/tag/:tag', async(req, res)=>{
    let  photosTags = []
    // let photoIds = []
    let responce = []

    await PhotoTag.findAll({
        where: {
            tag_id:req.params.tag
        }
    }).catch(err=> console.log(err)).then(r =>{
        if(r == undefined || r ==[]) res.send("no tag")
        else{
            photosTags = r
        }

        // res.send(r[0].dataValues)
    });
    console.log(photosTags, "]]]",req.params.tag)
    if(photosTags.length>0){
        for(let i = 0; i<photosTags.length; i++){
            await Photo.findAll({
                where: {
                    photo_id: photosTags[i].photo_id
                }
            }).catch(err=> console.log(err)).then(r =>{
                if(r == undefined || r ==[]) res.send("no photos")
                else{
                    let p = fs.readFileSync("public/"+r[0].dataValues.photopath ,'utf8' , (err, data) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                        // console.log(datadata)

                    })
                    let lol = {
                        "id" : r[0].dataValues.photo_idid,
                        "photo_title" : r[0].dataValues.photo_title,
                        "photo_date": r[0].dataValues.photo_date,
                        "location_id": r[0].dataValues.location_id,
                        "photo_base64": Buffer.from('').toString('base64')
                    }
                    responce.push(lol)
                }


            });

        }

    }
    res.send(responce)
})

router.get('/', async(req, res)=>{
    // console.log(req.query.location_name)
    // let name = ""
    let  photos = []
    let responce = []
    // await Location.findAll({
    //     where: {
    //         name:req.params.locationName
    //     }
    // }).then(r =>{
    //     if(r[0]){
    //         console.dir(r[0].dataValues)
    //         name = r[0].dataValues.name
    //     }
    //     else
    //         res.send("no location with this name")
    // });

    await Photo.findAll({
        where: {
            location_id:req.query.locationId
        }
    }).catch(err=> console.log(err)).then(r =>{
        if(r == undefined || r ==[]) res.send("no location")
        else{
            photos = r
        }

        // res.send(r[0].dataValues)
    });
    for(let i = 0; i<photos.length; i++){
        console.log(photos[i].dataValues)
        let p = fs.readFileSync("public/"+photos[i].dataValues.photopath ,'utf8' , (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            console.log(data)

        })
        let lol = {
            "id" : photos[i].dataValues.photo_id,
            "photo_title" : photos[i].dataValues.photo_title,
            "photo_date": photos[i].dataValues.photo_date,
            "location_id": photos[i].dataValues.location_id,
            "photo_base64": Buffer.from("").toString('base64')
        }
        responce.push(lol)
    }

    res.send(responce)
})

router.post('/', async(req, res) => {
    const form = formidable({ multiples: true });

    let photoMax = await Photo.max("photo_id")
    console.log("fdgdgbdb", photoMax)
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        let title = fields.title
        let loc = fields.location_id
        let date = fields.date
        let album_id = fields.album_id
        let tags = (fields.tags).split(",")
        console.log(tags, "DD")


        let oldPath = files.photo.filepath;
        let rawData = fs.readFileSync(oldPath)
        let photo_uid = uuidv4();

        fs.writeFile(`public/`+photo_uid , rawData, async(err)=>{
            if(err) console.log(err)
            console.log("Successfully uploaded photo")
            const photo = await Photo.create({ photo_id: photoMax+1, photo_title: title, photo_date: new Date() , location_id : loc , photopath : photo_uid, album_id: album_id }).then(async(p)=>{
                console.log(p)
                for(let i = 0; i<tags.length; i++){
                    PhotoTag.create({photo_tag_id: '', photo_id: photoMax+1, tag_id: parseInt(tags[i])}).catch(err=> console.log(err)).then(console.log("juz"))
                }
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


