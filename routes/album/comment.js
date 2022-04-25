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


// get all comments under specific photo
router.get('/all/:pid', async(req, res) => {
    let responce = []
    let comments = []
    const comment = await Comment.findAll({
        where: {
            photo_id:req.params.pid
        }
    }).then(r =>{
        if(r){
            comments = r
        }


    });
    for(let i = 0; i< comments.length; i++){
        responce.push(comments[i].dataValues)
        console.log(comments[i].dataValues)
    }
    res.send(responce)
})

// get a specific comment
router.get('/one/:id', async(req, res) => {
    const comment = await Comment.findAll({
        where: {
            comment_id:req.params.id
        }
    }).then(r =>{
        console.dir(r[0].dataValues)
        res.send(r[0].dataValues)
    });
})

// post a comment under specific photo
router.post('/:pid', async(req, res) => {
    console.log(req.query)
    let pid = req.params.pid
    let nick = req.query.nickname
    let cont = req.query.content
    let date = req.query.date
    const comment = await Comment.create({ comment_id: '', nickname: nick, comment_date: new Date(), content: cont, photo_id: (pid)}).catch((err)=>res.send("photo with this id does not exist")).then(console.log("juz"));
    res.send('comment post ')
})

// edit specific comment
router.put('/:id', async(req, res) => {
    await Comment.update({ content: req.query.content}, {
        where: {
            comment_id: req.params.id
        }
    });
    res.send('comment put ')
})

// delete specific comment
router.delete('/:id', async(req, res) => {
    await Comment.destroy({
        where: {
            comment_id: req.params.id
        }
    });
    res.send('comment delete')
})


module.exports = router