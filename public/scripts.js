mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpc2h5YTAwMjQiLCJhIjoiY201d2ozYXo0MGZndTJuc2Fwa2ltYWZ0ZCJ9.QIwymvTByM_Tmez0vnjAVg';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [0, 0], // Initial position [longitude, latitude]
  zoom: 2
});

// Function to add markers for recycling centers
function addCenterMarkers(centers) {
  centers.forEach(center => {
    const coordinates = center.properties.lat && center.properties.lon ? [center.properties.lon, center.properties.lat] : [center.lon, center.lat];
    const popupContent = `
      <h3>${center.properties.name || "Recycling Center"}</h3>
      <p>${center.properties.address || "Address not available"}</p>
    `;

    new mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup().setHTML(popupContent)) // Add popup with name and address
      .addTo(map);
  });
}

// Get user's current location with high accuracy
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      var userLocation = [position.coords.longitude, position.coords.latitude];
      map.setCenter(userLocation);
      map.setZoom(15);

      // Add a marker for the user's location
      new mapboxgl.Marker({ color: 'red' })
        .setLngLat(userLocation)
        .setPopup(new mapboxgl.Popup().setHTML('<h3>Your Location</h3>'))
        .addTo(map);

      // Fetch and display nearby recycling centers
      fetch(`/api/recycling-centers?lat=${position.coords.latitude}&lng=${position.coords.longitude}`)
        .then(response => response.json())
        .then(data => addCenterMarkers(data.features)) // Access the features array from the response
        .catch(error => console.error("Error fetching recycling centers:", error));
    },
    error => {
      console.error("Error obtaining geolocation:", error);
      alert("Geolocation is not supported by this browser.");
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
} else {
  alert("Geolocation is not supported by this browser.");
}
