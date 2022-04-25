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
var Tag = models.tag;

router.get('/', async(req, res) => {
    const tags = await Tag.findAll();
    console.log(tags.every(user => user instanceof Tag));
    console.log("All tags:", JSON.stringify(tags));
    res.send(tags)
})

router.get('/:id', async(req, res) => {
    console.log(req.params.id)
    const tag = await Tag.findAll({
        where: {
            tag_id:req.params.id
        }
    }).then(r =>{
        console.dir(r[0].dataValues)
        res.send(r[0].dataValues)
    });


})

router.post('/', async(req, res) => {
    console.log(req.body.name, "lol")
    let name = req.body.name

    const tag = await Tag.create({ tag_id: '',  tag_name: name }).catch((err)=>console.log(err)).then(console.log("juz"));


    res.send('location post ')
})
router.put('/:id', async(req, res) => {
    console.log( req.query.name, req.params.id)
    await Tag.update({tag_name: req.query.name }, {
        where: {
            tag_id: req.params.id
        }
    });
    res.send('location put ')
})
router.delete('/:id', async(req, res) => {
    console.log(req.params.id)
    await Tag.destroy({
        where: {
            tag_id: req.params.id
        }
    }).catch((err)=>console.log(err));
    res.send('location delete')
})


module.exports = router