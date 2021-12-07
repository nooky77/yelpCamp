mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: campGps.coordinates, // starting position [lng, lat]
    zoom: 12, // starting zoom
});

const marker = new mapboxgl.Marker()
    .setLngLat(campGps.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h5>${campTitle}</h5><p>${campLocation}</p>`
        )
    )
    .addTo(map);
