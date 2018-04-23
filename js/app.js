window.onload = function(){


	mapboxgl.accessToken = 'pk.eyJ1Ijoiam9leWtsZWUiLCJhIjoiMlRDV2lCSSJ9.ZmGAJU54Pa-z8KvwoVXVBw';

	let mapApp = (function(){

		let map,
		locations;

		let init = function(){
			loadElements()
		};


		function loadElements(){
			initMap();
			// loadData();
			getLocations("../data/locations.json")



			map.on('load', function(){
				console.log(locations)
					goToCurrentLocation();

					addPoint(locations.locations[0], "nyc_01")
					updateRadius("nyc_01")

					writeLocation(locations.locations[0])				

			})
			
		}

		function initMap(){
			map = new mapboxgl.Map({
			    container: 'map-container',
			    style: 'mapbox://styles/mapbox/satellite-v9',
			    center:[ 37.358402, -3.064703],
			    zoom:10,
			    pitch:10
			});
			map.scrollZoom.disable();
			map.addControl(new mapboxgl.NavigationControl());
		}


		// go to current location
		function goToCurrentLocation(){
			map.flyTo({
				center:locations.locations[0].lnglat
			})
		}

		function locationPoint(location){
			return {
        "type": "Point",
        "coordinates": [location.lnglat.lng,location.lnglat.lat]
	    }
		}

		function addPoint(datapoint, pointName){
			// Add a source and layer displaying a point which will be animated in a circle.
			    map.addSource(pointName, {
			        "type": "geojson",
			        "data": locationPoint(datapoint)
			    });

			    map.addLayer({
			        "id": pointName,
			        "source": pointName,
			        "type": "circle",
			        "paint": {
			            "circle-radius": 10,
			            "circle-color": "#EB6E80"
			        }
			    });
		}

		function updateRadius( pointName){
			this.counter = 0;

			// console.log(timestamp%40)
			setInterval(function(){
				map.setPaintProperty(pointName, 'circle-radius', this.counter%20);	
				counter++;	
			}, 100)
			
		}

		function writeLocation(location){
			$("#header").text(`Helen is currently in ${location.place} near ${location.lnglat.lat}, ${location.lnglat.lng}`)
		}
		



		async function getLocations(url){
			locations = await $.getJSON(url);
			return locations
		}


		return{
			init:init
		}

	})();




	// Run
	mapApp.init();
	

}
