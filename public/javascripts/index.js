let map = null;
mapboxgl.accessToken = 'pk.eyJ1IjoiaXNhYWMyMDgxIiwiYSI6ImNqdzBvaDk1MzAyNTA0OG1teWVhZHI1MncifQ.Heg3a17kDWdwNSjZcMOZGQ';
$(document).ready(function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [position.coords.longitude, position.coords.latitude],
                zoom: 15,
                trackUserLocation: true
            });

            map.addControl(new mapboxgl.NavigationControl());

            let geolocate = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                }, // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true, // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true
            });

            map.addControl(geolocate);

            map.on('load', function () {
                geolocate.trigger();
            });
        });
    } else {
        map = new mapboxgl.Map({
            container: 'map', style: 'mapbox://styles/mapbox/streets-v12', zoom: 14
        });
        map.addControl(new mapboxgl.NavigationControl());
    }

});