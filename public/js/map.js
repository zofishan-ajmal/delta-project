// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style :  "mapbox://styles/mapbox/streets-v12",
  center: listing.geometry.coordinates, // starting position [longitude, latitude]
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25}).setHTML(
      `<h4> ${listing.location}</h4><p>Exact location provided after you booking</p>`
    )
  )
  .addTo(map);

