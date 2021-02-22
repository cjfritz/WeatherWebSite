console.log('client js loaded');

// grab the DOM node for the weather form
const weatherForm = document.querySelector('form');
// selector for the input field, which will grab the value from using search.value
const search = document.querySelector('input'); // can find by class as well

// you can target specific classes with querySelector('.<selector>')
// you can select specific elements with IDs with querySelector('#<selector>) like below
const line1 = document.querySelector('#line1');
line1.textContent = ''; // update the text with textContext
const line2 = document.querySelector('#line2');
line2.textContent = ''; // update the text with textContext

// going to use the web fetch api to make requests (automatically exposed in web, no need to install or require)
const getWeather = address => {
    line1.textContent = 'Loading...';
    fetch(`/weather?address=${address}`)
    .then(response => response.json())
    .then(data => {
        console.log('data:', data);
        if (data.error) {
            line1.textContent = `Error: ${data.error}`;
        } else {
            const { feelsLike, placeName, temperature, weatherDescription, humidity } = data;

            line1.textContent = `For ${placeName}, it is currently ${temperature}°F${temperature !== feelsLike ? ` but feels like ${feelsLike}°F.` : '.'}`;
            line2.textContent = `The weather is described as ${weatherDescription.toLowerCase()} with a humidity of ${humidity}%`;
        }
    })
    .catch(err => console.error(err))
};

const clearLines = () => {
    line1.textContent = '';
    line2.textContent = '';
};


// setup a listener to determine when the form is submitted
// Note: submitting will cause a page refresh, which is old, legacy behavior.  We can change that to preserve the page state.
weatherForm.addEventListener('submit', event => {
    // prevent the refresh on submission
    event.preventDefault();

    const location = search.value;
    
    clearLines();
    getWeather(location);
})