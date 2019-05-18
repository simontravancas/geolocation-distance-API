const axios = require('axios')
const url = require('url');
const request = require('request');
const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;

const googlemapskey = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

function distance(loc1, loc2) {
	//using haversine formulae
	var deg_to_rad = 0.0174533 // = (Pi/180)
	
	tmp1 = Math.pow((loc2.lat - loc1.lat)*deg_to_rad/2 , 2)
	tmp2 = Math.cos(loc1.lat*deg_to_rad)*Math.cos(loc2.lat*deg_to_rad)
	tmp3 = Math.pow((loc2.lng - loc1.lng)*deg_to_rad/2 , 2)
	return 2*Math.asin(Math.sqrt(tmp1 + tmp2*tmp3))*6371
}

async function fill_place(places, address, locations) {
	requeststring = encodeURI("https://maps.googleapis.com/maps/api/geocode/json?address=" + locations[address] + "&key=" + googlemapskey);
	var res = await axios.get(requeststring)
	let returned_address = await res.data.results[0].formatted_address
	let returned_location = await res.data.results[0].geometry.location
	var place = {"address": returned_address, "location": returned_location}
	places.push(place)
}

function find_min_max(pairs) {
	var min = Infinity
	var max = 0
	var ret = []
	for ( idx in pairs ) {
		if ( pairs[idx].distance > max ) {
			max = pairs[idx].distance
			farthest = pairs[idx]
		}
		else if ( pairs[idx].distance < min ) {
			min = pairs[idx].distance
			closest = pairs[idx]
		}
	}
	ret.push(closest)
	ret.push(farthest)
	return ret
}

async function main(req, res) {
	var places = []
	var place_pairs = []
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var locations
	var response

	if (query["locations"]) {
		locations = query["locations"].split(";")
	}

	for (address in locations) {
		await fill_place(places, address, locations);
	}

	for ( i=0 ; i<places.length ; i++ ){
		for ( j=i+1 ; j<places.length ; j++ ){
			var location_pair_names = { "place_1": places[i].address, "place_2": places[j].address }
			dist = distance(places[i].location, places[j].location)
			place_pairs.push({"pair": location_pair_names, "distance": dist})
		}
	}

	response = {"response": place_pairs, "status": "OK"};
	
	var extremes = find_min_max(place_pairs)
	response.response.push({"closest_pair": extremes[0]["pair"], "distance": extremes[0]["distance"]})
	response.response.push({"furthest_pair": extremes[1]["pair"], "distance": extremes[1]["distance"]})

	res.statusCode = 200;
	res.end(JSON.stringify(response), null, 2);
}

const server = http.createServer((req, res) => {
	main(req, res)
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
