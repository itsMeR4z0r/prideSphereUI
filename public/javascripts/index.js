let map = null;
mapboxgl.accessToken = 'pk.eyJ1IjoiaXNhYWMyMDgxIiwiYSI6ImNqdzBvaDk1MzAyNTA0OG1teWVhZHI1MncifQ.Heg3a17kDWdwNSjZcMOZGQ';
$(document).ready(function () {


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/isaac2081/clp8ag0r000yo01nwe2mx402n',
                center: [lon == 0 ? position.coords.longitude : lon, lat == 0 ? position.coords.latitude : lat],
                zoom: 15,
                trackUserLocation: true
            });

            let geolocate = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                }, // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true, // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true
            });
            map.addControl(geolocate);
            map.addControl(new mapboxgl.NavigationControl());
            map.on('load', function () {
                if (lon == 0 && lat == 0) {
                    geolocate.trigger();
                }
            });
        });
    } else {
        map = new mapboxgl.Map({
            container: 'map', style: 'mapbox://styles/isaac2081/clp8ag0r000yo01nwe2mx402n', zoom: 14, center: [lon, lat]

        });
        let geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            }, // When active the map will receive updates to the device's location as it changes.
            trackUserLocation: true, // Draw an arrow next to the location dot to indicate which direction the device is heading.
            showUserHeading: true
        });
        map.addControl(geolocate);
        map.addControl(new mapboxgl.NavigationControl());
        map.on('load', function () {
            if (lon == 0 && lat == 0) {
                geolocate.trigger();
            }
        });
    }

});