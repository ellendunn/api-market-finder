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
	// console.log(market);
	const [lat, lng] = market.marketdetails.GoogleLink
										.split('?q=')[1].split('%20(')[0].split('%2C%20')
										.map(Number);
	const position = new google.maps.LatLng(lat, lng);
	const marketMarker = new google.maps.Marker({position, map});
	bounds.extend(position);

	const products = market.marketdetails.Products;
	const schedule = market.marketdetails.Schedule;
	// console.log(marketSchedule);
	handleMarketSelect(marketMarker, market.name, products, schedule);
	
	// handleMarketSelect(marketMarker, market.name, marketSchedule, marketProducts);
	// handleSearchResults(market.name);

}

function fitMap(markets) {
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
	$('.numResults').empty();

	const resultsElem = $('.results');
	resultsElem
 		.prop('hidden', false)
		.children('h2').append(`There are ${num} Farmers' Markets in Your Neighborhood!`)}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    // center: {lat: 41.968131, lng:-87.684336}, 
    zoom: 15
    });
}

function handleSubmitButton(){
	// this function will handle the input in the form after the 
	// submit button is pressed and will gatherResults()
	$('.search-form').submit(event =>{
		$('.result-details').html(`<p>Click on a market in the map to see more details!</p>`);

		event.preventDefault();
		const queryTarget = $(event.currentTarget).find('#zip-search');
		const zip = queryTarget.val();
		gatherResultsFromApi(zip, ZIPCODE_ENDPOINT); 
		queryTarget.val('');
		}
	)
}

function showMarketDetails(name, products, schedule) {
	$('.result-details').empty();
	  const editName = name.replace(/\d+/g,'');
	  const editedName=editName.replace('. ', '')

    $('.result-details').append(`<h3 class='market-title'>${editedName}</h3>
    	<p class='market-schedule'>When can you go?</p>
    	<p class='market-products'>What can you purchase?</p>`)

   	if (schedule === " <br> <br> <br> "){
    	$('.market-schedule').append(`<br><span class='info'> Schedule not found.</span>`)
    }else{
    	const edited = schedule.replace(';<br>','');
    	$('.market-schedule').append(`<br><span class='info'>${edited}</span>`)
    }

		if (products === "") {
	    $('.market-products').append(`<br><span class='info'>Products not found.</span>`)
	  }else{
	    $('.market-products').append(`<br><span class='info'>${products}</span>`)
	  }
}



function handleMarketSelect(marker, name, products, schedule){
	// this function will handle the event of the user selecting 
	// a market from the map and will renderResultDetails()
	const markers = [];
	markers.push(marker);

	const editName = name.replace(/\d+/g,'');
	const editedName=editName.replace('. ', '')

	marker.infowindow = new google.maps.InfoWindow({
    content: editedName
  	});

  google.maps.event.addListener(marker, 'click', function() {
  	marker.infowindow.close();

		this.infowindow.open(marker.get('map'), this);

  	showMarketDetails(name, products, schedule);
    

})



};

handleSubmitButton();
