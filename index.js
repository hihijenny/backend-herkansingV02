const express = require('express');
const ejs = require('ejs');
const slug = require('slug');
const bodyParser = require('body-parser');
const multer  = require('multer')
const upload = multer({ dest: 'static/uploads/' })


express()
    .use('/static', express.static('static'))
    .set('view engine', 'ejs')  //aangeven welke template engine we gebruiken
    .set('views', 'view')   //aangeven in welke map de templates staan
    .use(bodyParser.urlencoded({extended:true}))
    .get('/', onhome)
    .get('/about', onabout)
    .get('/contact', oncontact)
    .get('/add', onadd)
    .post('/add', submit)
    .get('*', on404)
    .listen(8000);

function onhome(req, res) {
    res.render('home.ejs', { title: 'homepagina'});
}

function onabout(req, res) {
    res.send('<h1>Ik eet graag pasta</h1>\n');
}

function oncontact(req, res) {
    res.send('<h1>Ik ben een Jenny</h1>\n');
}

function onadd(req, res) {
    res.render('keuzes.ejs');
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

