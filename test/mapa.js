// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var dL, dF = 0;

function initMap() {
    //Mapa personalizado gris
    var styledMapType = new google.maps.StyledMapType(
        [{
                "elementType": "geometry",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            },
            {
                "elementType": "labels.icon",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [{
                    "color": "#f5f5f5"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#bdbdbd"
                }]
            },
            {
                "featureType": "administrative.neighborhood",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#ffffff"
                }]
            },
            {
                "featureType": "road",
                "elementType": "labels",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#757575"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#dadada"
                }]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#616161"
                }]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            },
            {
                "featureType": "transit.line",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#e5e5e5"
                }]
            },
            {
                "featureType": "transit.station",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#eeeeee"
                }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{
                    "color": "#c9c9c9"
                }]
            },
            {
                "featureType": "water",
                "elementType": "labels.text",
                "stylers": [{
                    "visibility": "off"
                }]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [{
                    "color": "#9e9e9e"
                }]
            }
        ], {
            name: 'Styled Map'
        });
    //Mapa nuevo
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 28.665208,
            lng: -106.060155
        },
        zoom: 12,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: 'none',
        zoomControl: false
    });
    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
    var sombra = document.getElementById('sombreado');
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(sombra);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow({
            pixelOffset: new google.maps.Size(0, -10),
            disableAutoPan: true
    });
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var iconBase = 'img/';
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29),
        icon: iconBase + 'ubicacion_32.png'
    });

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();
        var offsetLat = 0.001;
        const curPosition = new google.maps.LatLng(lat,lng);
        
        //Get Local District
        var localDistrict = getLocalDistrict(curPosition);
        var localDistrictOutput = `<h1>Tu distrito local es el ${localDistrict}</h1>`;
        dL = localDistrict;

        //Get Federal District
        var federalDistrict = getFederalDistrict(curPosition);
        var federalDistrictOutput = `<br><h1>Tu distrito federal es el ${federalDistrict}</h1>`;
        dF = federalDistrict;

        //Generate button with candidates
        var rute = checkCombination(dL,dF);
        console.log(rute);
        var ruteOutput = `
          <a href="${rute}"">
            <div class="infowindow-box">
              <span class="infowindow-txt" id="infowindow-link"> Ve las candidaturas </span>
            </div>
          </a>`;
        var districtOutput = localDistrictOutput + federalDistrictOutput + ruteOutput;

        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No tenemos información disponible para: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
            console.log("la latitud es " + lat);
            console.log(lng);
            map.setCenter(new google.maps.LatLng((lat + offsetLat), lng));
            map.setZoom(17); // Why 17? Because it looks good.
        } else {
            console.log(lat);
            console.log(lng);
            map.setCenter(new google.maps.LatLng((lat + offsetLat), lng));
            map.setZoom(17); // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);  
        document.getElementById('sombreado').style.display = 'none';


        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindowContent.children['district'].innerHTML = ruteOutput;
        
        infowindow.open(map, marker);
    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', function() {
            autocomplete.setTypes(types);
        });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);

    document.getElementById('use-strict-bounds')
        .addEventListener('click', function() {
            console.log('Checkbox clicked! New state=' + this.checked);
            autocomplete.setOptions({
                strictBounds: this.checked
            });
        });
}
