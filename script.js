var map;
		var markers = [];
		const tourStopsA = [];
		const tourStopsB = [];


		//MAP
		// load map
		function init(){
			var myOptions = {
				zoom      : 12,
				center    : {lat:38.90765172565474,lng:-77.06855995374292},
				mapTypeId : google.maps.MapTypeId.ROADMAP
			};
			var element = document.getElementById('map');
			map = new google.maps.Map(element, myOptions);

        // A marker with a PNG.
        //resize img

        const placeMarkerA = new google.maps.Marker ({
			map,
			position: { lat: 38.897729638072626,lng:-77.03657537685005},
			icon: {
				url: 'white-house.png',
				scaledSize: new google.maps.Size(48,48)            
				},
			title: "The White House"
		});
            
		const placeMarkerB = new google.maps.Marker ({
			map,
			position: { lat: 38.930616796843104,lng:-77.07093529110176},
			icon: {
				url: 'cathedral.png',
				scaledSize: new google.maps.Size(48,48)            
				},
			title: "Washington National Cathedral"
		});

		addStopsATag();
		addStopsBTags();
		addMarkers();
		}

		init();
		
		//BUSES
		// Add bus markers to map

		async function addMarkers(){
		// get bus data
			var locations = await getBusLocations();
		// loop through data, add bus markers
			locations.forEach(function(bus){
			var marker = getMarker(bus.VehicleID);		
			if (marker){
				moveMarker(marker,bus);
			}
			else{
				addMarker(bus);			
			}
			});
		// timer
		console.log(new Date());
		setTimeout(addMarkers,15000);
		}


		// Request bus data from MBTA
		async function getBusLocations(){
			var url= 'https://api.wmata.com/Bus.svc/json/jBusPositions?RouteID=33&api_key=[type here your trasnportation API]';
			var response = await fetch(url);
			var json     = await response.json();
			return json.BusPositions;
		}

		function addMarker(bus){
			var icon = getIcon(bus);
			var marker = new google.maps.Marker({
				position: {
					lat: bus.Lat, 
					lng: bus.Lon
				},
				map: map,
				icon: icon,
				id: bus.VehicleID
			});
			markers.push(marker);
		}

		function getIcon(bus){
			// select icon based on bus direction
			if (bus.DirectionNum === 0) {
				return 'red.png';
			}
			return 'blue.png';	
		}

		function moveMarker(marker,bus) {
			// change icon if bus has changed direction
			var icon = getIcon(bus);
			marker.setIcon(icon);

			// move icon to new lat/lon
			marker.setPosition( {
				lat: bus.Lat, 
				lng: bus.Lon
			});
		}

		function getMarker(VehicleID){
			var marker = markers.find(function(item){
				return item.id === VehicleID;
			});
			return marker;
		}


		//STOPS
		// Set LatLng and title text for the markers. The first marker (White House Pass)
		// receives the initial focus when tab is pressed. Use arrow keys to
		// move between markers; press tab again to cycle through the map controls.

		// 1. Add bus stops tags to map Red PIN shows route from The first marker (White House Pass) to Cathedarl ( North Route)
		async function addStopsATag(){
			// get bus data
			var pointsA = await getStopsALocations();

			// loop through data, add bus stops tags

			pointsA.forEach(function(stopA){		
				addTagA(stopA);			
				
			});

			// timer
			// console.log(new Date());
			setTimeout(addStopsATag,15000);
		}

		// Request bus stops data from MBTA

        async function getStopsALocations(){
                var url= 'https://api.wmata.com/Bus.svc/json/jRouteDetails?RouteID=33&api_key=[type here your trasnportation API]';
                var response = await fetch(url);
                var json     = await response.json();
                return json.Direction0.Stops;
                console.log('It is working Data Tour A stops, thanks God!')
		}

		// to check the kind of info inside the url and PARSE 
						
		//    async function fetchD (urls) {
		// 		var urls= 'https://api.wmata.com/Bus.svc/json/jRouteDetails?RouteID=33&api_key=[type here your trasnportation API]';

		// 		const res = await fetch(urls);
		//           var data = await res.text();
		//           console.log(data);
		// 		  if(typeof(data) === "string") {
		// 			data = JSON.parse(data);
					
		// 			var json     = data.json();
		// 			console.log('success again, thanks God!')
		// 			console.log(data); 
		// 			console.log(json)
		// 			return json;  
		// 		  }    
		//         };

		function addTagA(stopA){
			var tagA = new google.maps.Marker({
			position: {
				lat: stopA.Lat, 
				lng: stopA.Lon
			},
			map: map,
			icon: {
				url: 'pinRed.png',
				scaledSize: new google.maps.Size(18,18)            
				},
			
			id: stopA.StopID,
			title: 'Northbound route heading to Washington Cathedral Stop.'
		});
		tourStopsA.push(tagA);
		}

		// 2. Add bus stops tags to map Blue PIN shows route from The first marker  from Cathedral to White House ( South Route)

		async function addStopsBTags(){
			// get bus data
			var pointsB = await getStopsBLocations();

			// loop through data, add bus stops tags

			pointsB.forEach(function(stopB){		
				addTagB(stopB);			
				
			});

			// timer
			// console.log(new Date());
			setTimeout(addStopsBTags,15000);
		}


		// Request bus stops data from MBTA 

		async function getStopsBLocations(){
				var url= 'https://api.wmata.com/Bus.svc/json/jRouteDetails?RouteID=33&api_key=[type here your trasnportation API]';
				var response = await fetch(url);
				var json     = await response.json();
				console.log('It is working Data Tour B stops, thanks God!')
				return json.Direction1.Stops;
				
		}

		function addTagB(stopB){
			var tagB = new google.maps.Marker({
				position: {
					lat: stopB.Lat, 
					lng: stopB.Lon
				},
				map: map,
				icon: {
					url: 'pinBlue.png',
					scaledSize: new google.maps.Size(18,18)            
					},
				
				id: stopB.StopID,
				title: 'Southbound route heading to White House Stop'
			});
			tourStopsB.push(tagB);
		}
			