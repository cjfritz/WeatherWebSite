const fetch = require('./request');

const apiKey = 'pk.eyJ1IjoiY2pmcml0eiIsImEiOiJja2U5ZDBlMXkyMDRjMndsdW5hdDByNnJ4In0.akhL7QHzYGCEqcDwmnd-Bw';
const baseUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json?access_token={access_key}&limit=1';

const responseHandler = response => {
    console.log('geocode response:', response);
    if (response.error || response.message) {
        throw new Error('Could not get forward geocode for location.');
    } else {
        return response;
    }
};

const getForwardGeocode = async query => {
    // if you enter "Jack & Jill", the B/E will interpret that as Jack&Jill, thinking Jack and Jill as two separate
    // query params, so we need to define them as one with encodeURIComponent
    const url = baseUrl.replace('{access_key}', apiKey).replace('{query}', encodeURIComponent(query)); 
    const body = await fetch(url)
        .then(response => responseHandler(response))
        .catch(error => { console.log(error.message) });

    if (!body || !body.features.length) { return null }

    const location = body?.features[0].center;
    const placeName = body?.features[0].place_name;
    return {
        lat: location[1],
        long: location[0],
        placeName,
    };
};

module.exports = { getForwardGeocode };
