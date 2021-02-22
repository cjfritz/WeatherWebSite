const fetch = require('./request');

const apiKey = 'ee1c217a3f18b8532a79c5772e75aa3b';
const baseUrl = 'http://api.weatherstack.com/current?access_key={access_key}&query={query}&units=f';

const responseHandler = response => {
    console.log('weather response:', response);
    if (response.error || response.message) {
        throw new Error('Could not get weather data for location.');
    } else {
        return response;
    }
};

const getWeatherData = async ({ lat, long }) => {
    const query = `${lat},${long}`;
    const url = baseUrl.replace('{access_key}', apiKey).replace('{query}', encodeURIComponent(query));
    const body = await fetch(url)
        .then(responseBody => responseHandler(responseBody))
        .catch(error => console.log(error.message));

    if (!body) { return null }

    const { current: { temperature, feelslike: feelsLike, weather_descriptions: weatherDescs, humidity } = {} } = body || {};
    return {
        temperature,
        feelsLike,
        weatherDescription: weatherDescs[0],
        humidity,
    };
};

module.exports = { getWeatherData };
