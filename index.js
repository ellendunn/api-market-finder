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
	const address = market.marketdetails.GoogleLink;
	// split GoogleAddress string to get coordinates for each marker
	const [lat, lng] = address
										.split('?q=')[1].split('%20(')[0].split('%2C%20')
										.map(Number);
	const position = new google.maps.LatLng(lat, lng);
	const marketMarker = new google.maps.Marker({position, map});
	// extend bounds based on markers	
	bounds.extend(position);

	const products = market.marketdetails.Products;
	const schedule = market.marketdetails.Schedule;
	handleMarketSelect(marketMarker, market.marketname, products, schedule, address);
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
	// from the user and renderResults() on the map
	$.getJSON(endpoint + query, data => { 
		$('.spinner').prop('hidden', false);
		$('.main').prop('hidden', true)

		//handles error for false zip codes
		const firstResult = data.results[0];
		if (firstResult.id === 'Error'){
			$('.spinner').prop('hidden', true);
			return swal(firstResult.marketname, "Try again!");
		}
		const promises = data.results.map(getMarketData);
		Promise.all(promises)
			.then(markets => {
				$('.main').prop('hidden', false);
				$('.spinner').prop('hidden', true);
				fitMap(markets);

			});
		resultsLoad(query);
	})
}

function resultsLoad(zip){
	// this will interpret results from API to then put in showResultsOnMap
	$('.results-title')
		.html(`<h2>Here Is What We Found Near ${zip}`)
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

function showMarketDetails(name, products, schedule, address) {
	$('.numResults').empty();
	$('.result-details').empty();
	  const editedName = editName(name);

    $('.result-details').append(`<h3 class='market-title'>${editedName}</h3>
    	<p class='market-schedule'>When can you go?</p>
    	<p class='market-products'>What can you purchase?</p>
    	<a href='${address}' target='_blank' alt='link to Google Directions' 
    	class='market-directions' >How can you get there?</a>`)

   	if (schedule === " <br> <br> <br> "){
    	$('.market-schedule')
    		.append(`<br><span class='info'> Schedule not found.</span>`)
    }else{
    	const edited = schedule.replace(';', '').replace('<br> <br>','');
    	$('.market-schedule').append(`<br><span class='info'>${edited}</span>`)
    }

		if (!products) {
	    $('.market-products')
	    	.append(`<br><span class='info'>Products not found.</span>`)
	  }else{
	    $('.market-products').append(`<br><span class='info'>${products}</span>`)
	  }


}

function handleMarketSelect(marker, name, products, schedule, address){
	// this function will handle the event of the user selecting 
	// a market from the map and will renderResultDetails()
	
	const editedName = editName(name);

 	google.maps.event.addListener(marker, 'click', function() {
 		infowindow.setContent(editedName);
		infowindow.open(marker.get('map'), marker);
  	showMarketDetails(name, products, schedule, address);   
	})
};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
  	zoom: 15
  });
  infowindow = new google.maps.InfoWindow();
}

handleSubmitButton();
