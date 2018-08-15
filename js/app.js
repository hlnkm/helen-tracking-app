window.onload = function(){


	mapboxgl.accessToken = 'pk.eyJ1Ijoiam9leWtsZWUiLCJhIjoiMlRDV2lCSSJ9.ZmGAJU54Pa-z8KvwoVXVBw';

	let mapApp = (function(){

		let map;

		let init = function(){
			loadElements()
		};


		async function loadElements(){
			initMap();

			map.on("load", async function(){
				let data = await getLocations("../data/locations.json")
				let {locations} = data;
				let latestLocation = locationPoint(locations[ locations.length - 1 ]) 
				
				addPoint(latestLocation, "arusha")

				updateRadius("arusha")

				


				addLine(data, "journey")

        if(new Date() > new Date("July 30, 2018") === true){
          map.flyTo({
            center: [37.358601, -3.079380],
            zoom:12
          })
          $("#header-text").text("Helen made it to the top on July 30th at 2:05 PM!")

        } else{
          writeLocation(latestLocation);  
          goToCurrentLocation(latestLocation);
        }

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

		/***
		@ get locations
		*/
		async function getLocations(url){
			let data = await $.getJSON(url);
			return data;
		}

		/**
		@ Go to Current Location
		*/
		function goToCurrentLocation(latestLocation){

			map.flyTo({
				center: [latestLocation.coordinates[0], latestLocation.coordinates[1]],
				zoom:12
			})

		}

		function updateRadius( pointName){
			this.counter = 0;

			// console.log(timestamp%40)
			setInterval(function(){
				map.setPaintProperty(pointName, 'circle-radius', this.counter%20);	
				counter++;	
			}, 100)
			
		}


		function locationPoint(location){
			return {
        "type": "Point",
        "coordinates": [location.lnglat.lng, location.lnglat.lat],
        "properties":{
        	"name":location.place
        }
	    }
		}

		function addPoint(datapoint, pointName){
			// Add a source and layer displaying a point which will be animated in a circle.
			    map.addSource(pointName, {
			        "type": "geojson",
			        "data": datapoint
			    });

			    map.addLayer({
			        "id": pointName,
			        "source": pointName,
			        "type": "circle",
			        "paint": {
			            "circle-radius": 4,
			            "circle-color": "#EB6E80"
			        }
			    });
		}

		function addLine(dataArr, lineName){
					let geojson = {
					  "type": "FeatureCollection",
					  "features": [
					    {
					      "type": "Feature",
					      "properties": {},
					      "geometry": {
					        "type": "LineString",
					        "coordinates": []
					      }
					    }
					  ]
					}



					// stuff in the coordinates
					dataArr.locations.forEach( location => {
						console.log(location)
						geojson.features[0].geometry.coordinates.push([ location.lnglat.lng, location.lnglat.lat])
					})
					console.log(geojson)


			    map.addSource(lineName, {
			        "type": "geojson",
			        "data": geojson
			    });

			    map.addLayer({
			        "id": lineName,
			        "source": lineName,
			        "type": "line",
			        "paint": {
			            "line-width": 4,
			            "line-color": "#EB6E80"
			        }
			    });
		}

		
		function writeLocation(location){
			$("#header-text").text(`Helen is currently near ${location.properties.name} around ${location.coordinates[1]}, ${location.coordinates[0]}`)
		}
		

	


		return{
			init:init
		}

	})();




	// Run
	mapApp.init();
	

}
