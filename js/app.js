window.onload = function(){


	mapboxgl.accessToken = 'pk.eyJ1Ijoiam9leWtsZWUiLCJhIjoiMlRDV2lCSSJ9.ZmGAJU54Pa-z8KvwoVXVBw';

	let mapApp = (function(){

		let map;

		let init = function(){
			loadElements()
		};


		async function loadElements(){
			initMap();
			map.on('load', function(){

				getLocations("../data/locations.json")
					.then( (data) => {
						goToCurrentLocation(data.locations[0])
						return data;
					})
					.then( (data) => {
						addPoint(data.locations[0], "nyc_01")
						updateRadius("nyc_01")
						writeLocation(data.locations[0])
						return true
					})
							
			})
			
		}

		function initMap(){
			map = new mapboxgl.Map({
			    container: 'map-container',
			    style: 'mapbox://styles/mapbox/satellite-v9',
			    center:[ 0, 0], // [ 37.358402, -3.064703]
			    zoom:1,
			    pitch:10
			});
			map.scrollZoom.disable();
			map.addControl(new mapboxgl.NavigationControl());
		}


		// go to current location
		function goToCurrentLocation(location){
			return new Promise( (resolve, reject) => {
				map.flyTo({
					center:location.lnglat,
					zoom:10
				})

				resolve(location)
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
			$("#header-text").text(`Helen is currently in ${location.place} near ${location.lnglat.lat}, ${location.lnglat.lng}`)
		}
		



		function getLocations(url){
			return new Promise( (resolve, reject) => {
				$.getJSON(url, (data) => {
					resolve(data);
				});
			}) 
		}


		return{
			init:init
		}

	})();




	// Run
	mapApp.init();
	

}
