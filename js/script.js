const location_input = document.querySelector("[data-location-input]");

const locations = places({
    appId: "plJWFUG4IFF8",
    apiKey: "7a416b7bdb76b93e1019cf473c749801",
    container: location_input,
    templates: {
        value: function(suggestion) {
            return suggestion.name;
        }
    }
}).configure({
    type: "city"
});

locations.on("change", e => {
    const place = e.suggestion;
    if (place === null) return;
    const url = `https://api.darksky.net/forecast/9d767f5a274ebe27e994541f8412bd28/${
        place.latlng.lat
    },${place.latlng.lng}?units=auto`;
    const proxy = "https://cors-anywhere.herokuapp.com/";
    fetch(proxy + url)
        .then(res => res.json())
        .then(data => {
            update_weather(data.currently, place.name);
            location_input.value = "";
            return;
        });
});

const icon = new Skycons({ color: "#222" });
icon.set("icon", "clear-day");
icon.play();

function update_weather(data, place) {
    const status_element = document.querySelector("[data-status]");
    const location_element = document.querySelector("[data-location]");
    const wind_element = document.querySelector("[data-wind]");
    const temperature_element = document.querySelector("[data-temperature]");
    const precipitation_element = document.querySelector(
        "[data-precipitation]"
    );

    status_element.textContent = data.summary;
    location_element.textContent = place;
    wind_element.textContent = data.windSpeed;
    temperature_element.textContent = data.temperature;
    precipitation_element.textContent = `${(
        data.precipProbability * 100
    ).toFixed(2)}%`;
    icon.set("icon", data.icon);
    icon.play();
}
