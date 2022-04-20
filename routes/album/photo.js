const express = require('express')
const router = express.Router()
const con = require('../../database_config')
const initModels = require("../../models/init-models");
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('galeria', 'root', '', {
    host: 'localhost',
    dialect: "mysql"
});
var models = initModels(sequelize);
//var Album = models.album
var Photo = models.photo

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
// obslugujesz request za pomoca
router.post('/', async(req, res) => {
    console.log(req.query)
    let title = req.query.title
    let loc = req.query.location_id
    let date = req.query.date

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