const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongo = require('mongodb')

require('dotenv').config(); //Variabele in je .env zetten die niet mee gaat naar git maar wel kunnen ophalen in de code.

let db = null;
const url = 'mongodb+srv://' + process.env.DB_USER + ':'+process.env.DB_PASS + '@cluster0.q5sp8.mongodb.net/' + process.env.DB_NAME + '?retryWrites=true&w=majority';

mongo.MongoClient.connect(url, function(err, client) {
    if (err) throw err; 
    db = client.db('datingapp');
});

express()
    .use('/static', express.static('static')) 
    .set('view engine', 'ejs') 
    .set('views', 'view')   //aangeven in welke map de templates staan
    .use(bodyParser.urlencoded({extended:false}))
    .get('/', onadd) //dit is de 'homepage' hier vult de gebruik zijn info in. 
    .post('/add', submit) // Na verzenden van fomrulier kom je hier, voert submit functie uit. 
    .get('/profile/:id', showprofile) //Laat een specifiek profiel zien op basis van Id
    .get('/profiles', onprofiles) //Laat alle profielen zien
    .get('/delete-profile/:id', ondeleteprofile) //Delete een specifiek profiel op basis van Id
    .get('/edit-profile/:id', onedit) //edit een specifiek profiel op basis van Id
    .post('/edit-profile', saveprofile) //Roept functie saveprofile aan om het profiel aan te passen in de database
    .get('*', on404)
    .listen(8000);

function onadd(req, res) {
    res.render('newprofile.ejs');
}

//Laat alle profiles zien
function onprofiles(req, res) { 

    db.collection('profiles') //pakt de collection profiles uit de db
        .find().toArray(done); //pakt de info uit profiles en zet dit in een array

    function done(err, data) { //maakt een function done aan en die word aangeroepen als de .toArray method klaar is. 
        if (err) { // als er een error is laat die dan zien
            next(err);
        } else {
             
            res.render('profiles.ejs', { //render de template en geeft profiles mee als argument
                profiles: data
            });
        }
    }
}

function submit(req, res) {

    const name = req.body.name; //Hier zetten we de ingestuurde data uit het formulier in variabelen
    const interest1 = req.body.interest1;
    const interest2 = req.body.interest2;
    const about = req.body.about;

    db.collection('profiles') //pakt de collection profiles uit de db
        .insert({
            name: name, //zet het antwoord van de gebruiker in de database
            interest1: interest1,
            interest2: interest2,
            about: about
        }, done);

        function done(err, data) {
            if (err) {
                next(err);
            } else {
               const id = data.insertedIds[0];
               res.redirect('/profile/' + id); //redirect naar profile pagina + de Id 
            }
        }
}

function showprofile(req, res) {
    const id = req.params.id; //pak de Id uit de URL 

    db.collection('profiles').findOne({
        _id: mongo.ObjectID(id)
    }, done);

    function done(err, data) {
        if (err) {
            next(err);
        } else {
            res.render('yourprofile.ejs', { //render de template en geeft profiles mee als argument
                profile: data
            });
        }
    }
}

//zoekt profiel en redirect naar het aanpassen van profiel
function onedit(req, res) {

    const id = req.params.id;

    db.collection('profiles').findOne({
        _id: mongo.ObjectID(id),
    }, done);

    function done(err, data) {
        if (err) {
            next(err);
        } else {
            res.render('edit-profile.ejs', { 
                profile: data
            });
        }
    }
}

// Editen en opslaan van profiel
function saveprofile(req, res) {

    const id = req.body.profile_id; //pakken de id uit de hidden input field om die te updaten.
    const interest1 = req.body.interest1;
    const interest2 = req.body.interest2;
    const about = req.body.about;
        
    db.collection('profiles').updateOne({
        _id: mongo.ObjectID(id)},
        {
            $set: {
                interest1: interest1,
                interest2: interest2,
                about: about
            }
        });
    
    res.redirect('/profile/' + id);
}




//Deleten van profiel
function ondeleteprofile(req, res) {
    
    const id = req.params.id;

    db.collection('profiles').deleteOne({
        _id: mongo.ObjectID(id)
    }, done);
    
    function done(err) {
        if (err) {
            next(err);
        } else {
            res.redirect('/profiles');
        }
    }
}


function on404(req, res) { 
    res.status(404).send('dit is een 404');
}
