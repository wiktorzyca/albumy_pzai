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
var Location = models.location;

router.get('/', async(req, res) => {
    const locations = await Location.findAll();
    console.log(locations.every(user => user instanceof Location));
    console.log("All locations:", JSON.stringify(locations));
    res.send(locations)
})

router.get('/:id', async(req, res) => {
    console.log(req.params.id)
    const location = await Location.findAll({
        where: {
            location_id:req.params.id
        }
    }).then(r =>{
        if(r[0]){
            console.dir(r[0].dataValues)
            res.send(r[0].dataValues)
        }
        else
            res.send("no location with this id")
    });


})

router.post('/', async(req, res) => {
    console.log(req.body, "lol")
    let city = req.body.city
    let country = req.body.country
    let name = req.body.name

    const location = await Location.create({ location_id: '', city: city, country: country, name: name }).catch((err)=>console.log(err)).then(console.log("juz"));


    res.send('location post ')
})
router.put('/:id', async(req, res) => {
    console.log( req.body, req.params.id)
    await Location.update({city: req.body.city, country: req.body.country, name: req.body.name }, {
        where: {
            location_id: req.params.id
        }
    });
    res.send('location put ')
})
router.delete('/:id', async(req, res) => {
    console.log(req.params.id)
    await Location.destroy({
        where: {
            location_id: req.params.id
        }
    }).catch((err)=>console.log(err));
    res.send('location delete')
})


module.exports = router