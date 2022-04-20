const express = require('express')
const router = express.Router()
const con = require('../../database_config')
const initModels = require("../../models/init-models")
const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('galeria', 'root', '', {
    host: 'localhost',
    dialect: "mysql"
})
var models = initModels(sequelize)
var Comment = models.comment

// get all tags under specific photo
router.get('/:pid', async(req, res) => {
    const tag = await Tag.findAll({
        where: {
            tag_id:req.params.pid
        }
    }).then(r =>{
        console.dir(r[0].dataValues)
        res.send(r[0].dataValues)
    });

})



// get a specific tag by ID
router.get('/:id', async(req, res) => {
    const tag = await Comment.findAll({
        where: {
            tag_id:req.params.id
        }
    }).then(r =>{
        console.dir(r[0].dataValues)
        res.send(r[0].dataValues)
    });
})

// post a tag under specific photo
router.post('/:pid', async(req, res) => {
    let pid = req.params.pid
    let name = req.body.name
    const tag = await Tag.create({ tag_id: '', name: name, photo_id: pid})
    
})

// edit specific tag
router.put('/:id', async(req, res) => {
    await Tag.update({ name: req.query.name}, {
        where: {
            tag: req.params.id
        }
    });
    res.send('tag put ')
})

// delete specific tag
router.delete('/:id', async(req, res) => {
    await Tag.destroy({
        where: {
            tag: req.params.id
        }
    });
    res.send('tag delete')
})


module.exports = router