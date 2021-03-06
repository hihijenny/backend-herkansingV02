const express = require('express');
const ejs = require('ejs');
const slug = require('slug');
const bodyParser = require('body-parser');
const multer  = require('multer')
const upload = multer({ dest: 'static/uploads/' })
const mongo = require('mongodb')

require('dotenv').config() //.env nog even fixen zodat niet iedereen mn ww ziet

let db = null;
const url = 'mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0.q5sp8.mongodb.net/'+process.env.DB_NAME+'?retryWrites=true&w=majority';

mongo.MongoClient.connect(url, function(err, client) {
    if (err) throw err; 
    db = client.db("datingapp")
})

express()
    .use('/static', express.static('static'))
    .set('view engine', 'ejs')  //aangeven welke template engine we gebruiken
    .set('views', 'view')   //aangeven in welke map de templates staan
    .use(bodyParser.urlencoded({extended:false}))
    .get('/', onadd)
    .post('/add', submit)
    .get('/profile/:id', showprofile)
    .get('/profiles', onprofiles)
    .get('/delete-profile/:id', ondeleteprofile)
    .get('/edit-profile/:id', onedit)
    .post('edit-profile', saveprofile)
    .get('*', on404)
    .listen(8000);


function onadd(req, res) {
    res.render('newprofile.ejs');
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
    // const id = slug(req.body.name).toLowerCase()
    const name = req.body.name;
    const interest1 = req.body.interest1;
    const interest2 = req.body.interest2;
    const about = req.body.about;

    console.log(name);
    console.log(req.body);

    db.collection('profiles') //pakt de collection profiles uit de db
        .insert({
            name: name, 
            interest1: interest1,
            interest2: interest2,
            about: about
        }, done);

        function done(err, data) {
            if (err) {
                next(err)
            } else {
               const id = data.insertedIds[0]
               res.redirect('/profile/' + id)
            }
        }
}

function showprofile(req, res) {
    const id = req.params.id;

    db.collection('profiles').findOne({
        _id: mongo.ObjectID(id)
    }, done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.render('yourprofile.ejs', { //render de template en geeft profiles mee als argument
                profile: data
            })
        }
    }
}

function saveprofile(req, res) {
    const interest1 = req.body.interest1;
    const interest2 = req.body.interest2;
    const about = req.body.about;

    db.collection('profiles') //pakt de collection profiles uit de db
        .insert({
            interest1: interest1,
            interest2: interest2,
            about: about
        }, done);

        function done(err, data) {
            if (err) {
                next(err)
            } else {
               const id = data.insertedIds[0]
               res.redirect('/profile/' + id)
            }
        }

}

function ondeleteprofile(req, res) {
    
    const id = req.params.id;

    db.collection('profiles').deleteOne({
        _id: mongo.ObjectID(id)
    }, done)
    
    function done(err) {
        if (err) {
            next(err)
        } else {
            res.redirect('/profiles')
        }
    }
}

function onedit(req, res) {

    const id = req.params.id;

    db.collection('profiles').findOne({
        _id: mongo.ObjectID(id)
    }, done)

    function done(err, data) {
        if (err) {
            next(err)
        } else {
            res.render('edit-profile.ejs', { 
                profile: data
            })
        }
    }
}

function on404(req, res) { 
    res.status(404).send('dit is een 404')
}

