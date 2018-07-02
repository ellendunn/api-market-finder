'use strict'

const ZIPCODE_ENDPOINT = 'http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=';
const FM_ID_ENDPOINT = 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=';
let map;

function gatherResultsFromApi(query, endpoint) { //removed callback 
	// this function will gather the results from the API based on the input from the user and renderResults() 
	//on the map

	$.getJSON(endpoint + query, data => { 
			// const marketName = data.results.forEach(marketname => {
			// 	console.log(data.results.marketname)
			// });
			console.log(data);
		data.results.forEach(market => {
			// for (let i=0; i<data.results.length; i++) {
			// 		let marketName = data.results[i].marketname;
			// }
			const marketName = market.marketname;
			$.getJSON(FM_ID_ENDPOINT + market.id, _data => {
				//results is an array so need to go
				// through each and get marketname to display when user clicks on a marker
		
				const marketAddress = _data.marketdetails.GoogleLink;
				const marketSchedule = _data.marketdetails.Schedule;
				const marketProducts = _data.marketdetails.Products;
				//splitting GoogleAddress string from link to coordinates
				const [lat, lng] = marketAddress
														.split('?q=')[1].split('%20(')[0].split('%2C%20')
														.map(Number);
				var marketPosition = {lat: lat, lng: lng};
				var marketMarker = new google.maps.Marker({position: marketPosition, map: map});
				loadMap();
				
				// showMarketDetails(_data.marketdetails.Schedule, _data.marketdetails.Products)
				// handleIdDetails(_data.marketdetails.Schedule, _data.marketdetails.Products)
				console.log(marketName)
				handleMarketSelect(marketMarker, marketName);
				handleSearchResults();
			})
		})})
	}


function loadMap(){
		const mapElem = $('#map');
		mapElem
			.prop('hidden', false);

}

function handleSearchResults(){ //must add 'name' as argument to append names
	// to the market-title div
	// this will interpret results from API to then put in showResultsOnMap
	const resultsElem = $('.results');

	resultsElem
 		.prop('hidden', false)

 	// handleSearchResults(name)
 	// $('.market-title').append(`${name}`)

}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.968131, lng:-87.684336}, 
    zoom: 15
    });
}

//promise.All - waits for all data to load then will run

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
function showMarketDetails(schedule, products){
	// this function will show the title of the market, the schedule, and the 
	// products sold in a side bar when a userselects a market from the map
	// return `${marketdetails.Address}, ${marketdetails.Products}, ${marketdetails.Schedule}`
	const resultDetailsElem = $('.result-details');

 	resultDetailsElem
 	 	.prop('hidden', false)

	$('.result-details').append(`<h3 class='market-title'>Title of Farmers' Market Selected: 'marketName' </h3>
		<p class='market-schedule'>When can you go? ${schedule}</p>
		<p class='market-products'>What can you purchase? ${products}</p>`)
}

// function handleIdDetails(schedule, products) {
// 	const idDetails = (`${schedule}, ${products}`)
// 	// marker is not defined --> refer to the googld maps docs!!!!!!
// 	handleMarketSelect(marker, idDetails)
// }

function handleMarketSelect(marker, info){
	// this function will handle the event of the user selecting 
	// a market from the map and will renderResultDetails()
  var infowindow = new google.maps.InfoWindow({
    content: info
  });

  marker.addListener('click', function() {
    infowindow.open(marker.get('map'), marker);
  });

  // showMarketDetails(schedule, products)


}

handleSubmitButton();
