const path = require('path');
const express = require('express');
const hbs = require('hbs');

const { getForwardGeocode, getWeatherData } = require('../services');

console.log(path.join(__dirname, '../public/index.js'));
console.log(__filename);

const app = express();

/* app.set will allow you to set a variable to a particular value
example: for hbs, it expects a view directory by default
- if we want it to be templates, we must set 'views' to point to the path for templates (this has been done)
*/

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templates/views'));
hbs.registerPartials(path.join(__dirname, '../templates/partials'))

// serve static assets by specifying a folder where everything (html, css, images, js, etc...)
// you want to show in the browser will be located
app.use(express.static(path.join(__dirname, '../public')))

// you can access query strings passed to the endpoints with req.query
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Home Page',
        name: 'Caleb',
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Caleb',
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Caleb',
        message: 'This is a help message',
    });
});

app.get('/weather', async (req, res) => {
    const { address } = req.query;

    const sendError = error => {
        res.send({
            error
        })
    };

    if (!address) {
       return sendError('Address is required.');
    }

    const location = await getForwardGeocode(address);

    if (!location) {
        return sendError('Invalid location.');
    }

    const weatherData = await getWeatherData(location);

    if (!weatherData) {
        return sendError('No weather data for that location.');
    }

    res.send({ ...weatherData, placeName: location.placeName });
});

// express routing supports regex so you can have separate catch-alls for certain directories
app.get('/help/*', (req, res) => {
    res.render('pageNotFound', {
        title: '404',
        name: 'Caleb',
        notFoundText: 'Help article not found.',
    });
});

// express reads routes defined by app.get in first-come/first-serve order, so the wildcard for our 404 must come last
app.get('*', (req, res) => {
    res.render('pageNotFound', {
        title: '404',
        name: 'Caleb',
        notFoundText: 'Page not found.',
    });
});

app.listen(3000, () => {
    console.log('server running');
});
