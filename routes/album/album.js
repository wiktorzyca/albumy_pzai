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
    let page
    let size
    if(req.query.page==undefined) page = 1; else page = parseInt(req.query.page)
    if(req.query.size==undefined) size = 0; else size = parseInt(req.query.size)
    console.log(req.query, size, page)
    let responce = []
    let  photos = []
    let photosSpliced = []
    const album = await Album.findAll({
        where: {
            album_id:req.params.id
        }
    }).then(async (r) =>{
        if(r[0]){responce.push({
            album_id: r[0].dataValues.album_id,
            album_name: r[0].dataValues.album_name,
            description: r[0].dataValues.description,
        })

        }else{
            return res.send("no albom")
        }
        })


        // else{
        //
        //     // let responce = {
        //     //     album_id: r[0].dataValues.album_id,
        //     //     album_name: r[0].dataValues.album_name,
        //     //     description: r[0].dataValues.description,
        //     //
        //     // }
        //
        //     // res.send(responce)
        // }
         await Photo.findAll({
            where: {
                album_id:req.params.id
            }
        }).then(re =>{
            if(re!==undefined){
                console.dir(re)
            }
            photos = re
             if(size!==0 ){
                 photosSpliced = photos.slice((page-1)*(size), size*(page))
             }
             else{
                 photosSpliced= photos
             }
        });

        console.log("slices", photosSpliced, "gdfh", page, size*page)
        for(let i = 0; i<photosSpliced.length; i++){
            console.log(photosSpliced[i].dataValues, "drsgrfdgdgrdgfrd")
            let p = fs.readFileSync("public/"+photosSpliced[i].dataValues.photopath ,'utf8' , (err, data) => {
                if (err) {
                    console.error(err)
                    return
                }
                // console.log(datadata)

            })
            let lol = {
                "id" : photosSpliced[i].dataValues.photo_id,
                "photo_title" : photosSpliced[i].dataValues.photo_title,
                "photo_date": photosSpliced[i].dataValues.photo_date,
                "location_id": photosSpliced[i].dataValues.location_id,
                "photo_base64": Buffer.from("").toString('base64')
            }
            responce.push(lol)
        }
        console.log("RESSSSSSSSSSSSSS", responce)



    res.send(responce)



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