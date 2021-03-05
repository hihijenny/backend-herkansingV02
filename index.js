const express = require('express');
const ejs = require('ejs');
const slug = require('slug');
const bodyParser = require('body-parser');
const multer  = require('multer')
const upload = multer({ dest: 'static/uploads/' })
const mongo = require('mongodb')

require('dotenv').config()

let db = null;
const url = 'mongodb+srv://JennyN:IkBenLeuk@cluster0.q5sp8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongo.MongoClient.connect(url, function(err, client) {
    if (err) throw err; 
    db = client.db("datingapp")
})

express()
    .use('/static', express.static('static'))
    .set('view engine', 'ejs')  //aangeven welke template engine we gebruiken
    .set('views', 'view')   //aangeven in welke map de templates staan
    .use(bodyParser.urlencoded({extended:true}))
    .get('/', onhome)
    .get('/add', onadd)
    .post('/add', submit)
    .get('/profiles', onprofiles)
    .get('*', on404)
    .listen(8000);

function onhome(req, res) {
    res.render('home.ejs', { title: 'homepagina'});
}

function onadd(req, res) {
    res.render('keuzes.ejs');
}

function onprofiles(req, res) { 

    db.collection('profiles') //pakt de collection profiles uit de db
        .find().toArray(done) //pakt de info uit profiles en zet dit in een array

    function done(err, data) { //maakt een function done aan en die word aangeroepen als de .toArray method klaar is. 
        if (err) { // als er een error is laat die dan zien
            next(err)
        } else {
            
            res.render('profiles.ejs', { //render de template en geeft profiles mee als argument
                profiles: data
            })
        }
    }
}

function submit (req, res) {
    const id = slug(req.body.name).toLowerCase()
    const about = req.body.about
    const interest = req.body.interest

    console.log(id)
    console.log(about)
    console.log(interest)
    //ingevoerde data naar de database sturen

    res.redirect('/' + id)
}

function on404(req, res) { 
    res.status(404).send('dit is een 404')
}

