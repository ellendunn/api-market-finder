'use strict'

const BASE_ENDPOINT = 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/'
const ZIPCODE_ENDPOINT = BASE_ENDPOINT + 'zipSearch?zip=';
const FM_ID_ENDPOINT = BASE_ENDPOINT + 'mktDetail?id=';
let map, infowindow;


function getMarketData(market){
	return $.getJSON(FM_ID_ENDPOINT + market.id)
		.then(data => Object.assign(market, data)) 
		//combining object for market (id and marketname) with data (marketdetails)
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

	const products = market.marketdetails.Products;
	const schedule = market.marketdetails.Schedule;
	handleMarketSelect(marketMarker, market.marketname, products, schedule);
}

function fitMap(markets) {
	//declare bounds variable LatLngBounds()
	const bounds = new google.maps.LatLngBounds();
	//data loop to get coordinates
	markets.forEach(market => showMarker(market, bounds));
	// resposition map 
	map.fitBounds(bounds);
}

function gatherResultsFromApi(query, endpoint) { 
	// this function will gather the results from the API based on the input
	// from the user and renderResults() 
	// on the map
	$.getJSON(endpoint + query, data => { 
		const firstResult = data.results[0];
		if (firstResult.id === 'Error'){
			return alert(firstResult.marketname)
		}
		const promises = data.results.map(getMarketData);
		const numFound = data.results.length;
		Promise.all(promises)
			.then(markets => fitMap(markets));
		resultsLoad(numFound);
		$('#map').prop('hidden', false);
	})
}

function resultsLoad(num){
	// this will interpret results from API to then put in showResultsOnMap
	$('.numResults').empty();

	$('.results')
 		.prop('hidden', false)
		.children('h2')
		.append(`There are ${num} Farmers' Markets in Your Neighborhood!`)
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 15
  });
  infowindow = new google.maps.InfoWindow();
}

function handleSubmitButton(){
	// this function will handle the input in the form after the 
	// submit button is pressed and will gatherResults()
	$('.search-form').submit(event => {
		event.preventDefault();
		$('.result-details')
			.html(`<p>Click on a market in the map to see more details!</p>`);

		const queryTarget = $(event.currentTarget).find('#zip-search');
		const zip = queryTarget.val();
		gatherResultsFromApi(zip, ZIPCODE_ENDPOINT); 
		queryTarget.val('');
	});
}

function editName(name){
	return name.replace(/\d+/g,'').replace('. ', '');
}

function showMarketDetails(name, products, schedule) {
	$('.result-details').empty();
	  const editedName = editName(name);

    $('.result-details').append(`<h3 class='market-title'>${editedName}</h3>
    	<p class='market-schedule'>When can you go?</p>
    	<p class='market-products'>What can you purchase?</p>`)

   	if (schedule === " <br> <br> <br> "){
    	$('.market-schedule')
    		.append(`<br><span class='info'> Schedule not found.</span>`)
    }else{
    	const edited = schedule.replace(/<br>/g,'').replace(';', '');
    	$('.market-schedule').append(`<br><span class='info'>${edited}</span>`)
    }

		if (!products) {
	    $('.market-products')
	    	.append(`<br><span class='info'>Products not found.</span>`)
	  }else{
	    $('.market-products').append(`<br><span class='info'>${products}</span>`)
	  }
}

function handleMarketSelect(marker, name, products, schedule){
	// this function will handle the event of the user selecting 
	// a market from the map and will renderResultDetails()
	
	const editedName = editName(name);

 	google.maps.event.addListener(marker, 'click', function() {
 		infowindow.setContent(editedName);
		infowindow.open(marker.get('map'), marker);
  	showMarketDetails(name, products, schedule);   
	})
};

handleSubmitButton();
