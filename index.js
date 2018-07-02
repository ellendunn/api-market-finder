'use strict'

const ZIPCODE_ENDPOINT = 'http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=';
const FM_ID_ENDPOINT = 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=';
let map;

function getMarketData(market){
	return $.getJSON(FM_ID_ENDPOINT + market.id)
		.then(data => {
			data.name = market.marketname;
			return data
		})
}

function showMarker(market, bounds){
	// put markers on the map
	// extend bounds based on markers	
	// split GoogleAddress string to get coordinates for each marker
	const [lat, lng] = market.marketdetails.GoogleLink
										.split('?q=')[1].split('%20(')[0].split('%2C%20')
										.map(Number);
	const position = new google.maps.LatLng(lat, lng);
	const marketMarker = new google.maps.Marker({position, map});
	bounds.extend(position);
	const marketSchedule = market.marketdetails.Schedule;
	const marketProducts = market.marketdetails.Products;
	console.log(marketSchedule, marketProducts);
	// showMarketDetails(marketName, marketSchedule, marketProducts);
	handleMarketSelect(marketMarker, market.name, marketSchedule, marketProducts);
	// handleSearchResults(market.name);

}

function fitMap(markets) {
	console.log(markets);
	//declare bounds variable LatLngBounds()
	const bounds = new google.maps.LatLngBounds();
	//data loop to get coordinates
	markets.forEach(market => showMarker(market, bounds));
	// resposition map 
	map.fitBounds(bounds);
}

function gatherResultsFromApi(query, endpoint) { //removed callback 
	// this function will gather the results from the API based on the input from the user and renderResults() 
	//on the map
	$.getJSON(endpoint + query, data => { 
		const promises = data.results.map(getMarketData);
		const numFound = data.results.length;
		Promise.all(promises)
			.then(markets => fitMap(markets))
		// 		const marketSchedule = _data.marketdetails.Schedule;
		// 		const marketProducts = _data.marketdetails.Products;
		// 		showMarketDetails(marketName, marketSchedule, marketProducts);
		// 		handleMarketSelect(marketMarker, marketName, marketSchedule, marketProducts);
		resultsLoad(numFound);
		loadMap()
	})
}

function loadMap(){
		const mapElem = $('#map');
		mapElem
			.prop('hidden', false);
}

function resultsLoad(num){
	// this will interpret results from API to then put in showResultsOnMap
	const resultsElem = $('.results');
	resultsElem
 		.prop('hidden', false)
		.children('h2').append(`We found ${num} farmers' markets in your neighborhood!`)}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.968131, lng:-87.684336}, 
    zoom: 15
    });
}

function handleSubmitButton(){
	// this function will handle the input in the form after the 
	// submit button is pressed and will gatherResults()
	$('.search-form').submit(event =>{
		event.preventDefault();
		const queryTarget = $(event.currentTarget).find('#zip-search');
		const zip = queryTarget.val();
		gatherResultsFromApi(zip, ZIPCODE_ENDPOINT); 
		queryTarget.val('');
		}
	)
}

// after map loads, this handles how the user interacts with the map and results
function showMarketDetails(name, schedule, products){
	// this function will show the title of the market, the schedule, and the 
	// products sold in a side bar when a userselects a market from the map
	const resultDetailsElem = $('.result-details');

 	resultDetailsElem
 	 	.prop('hidden', false)
}

function handleMarketSelect(marker, name, schedule, products){
	// this function will handle the event of the user selecting 
	// a market from the map and will renderResultDetails()
  var infowindow = new google.maps.InfoWindow({
    content: name
  });

  marker.addListener('click', function() {
    infowindow.open(marker.get('map'), marker);
    $('.result-details').empty();
    $('.result-details').append(`<h3 class='market-title'>${name}</h3>
    	<p class='market-products'>What can you purchase?</p>
    	<p class='market-schedule'>When can you go?</p>`)

   	if (schedule = " <br> <br> <br> "){
    	$('.market-schedule').append(`<br><span class='info'> Schedule not found.</span>`)
    }else{
    	$('.market-schedule').append(`<span class='info'>${schedule}</span>`)
    }

    if (products = " "){
    	$('.market-products').append(`<br><span class='info'>Products not found.</span>`)
    }else{
    	$('.market-products').append(`<span class='info'>${products}</span>`)
    }

  });

}

handleSubmitButton();
