const express = require('express')

express()
    .use('/static', express.static('static'))
    .get('/', onhome)
    .get('/about', onabout)
    .get('/contact', oncontact)
    .get('*', on404)
    .listen(8000);

function onhome(req, res) {
    res.send('<h1>Home</h1>\n');
}

function onabout(req, res) {
    res.send('<h1>Ik eet graag pasta</h1>\n');
}

function oncontact(req, res) {
    res.send('<h1>Ik ben een Jenny</h1>\n');
}

function on404(req, res) { 
    res.status(404).send('dit is een 404')
}

