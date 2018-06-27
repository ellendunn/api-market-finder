'use strict'

const ZIPCODE_ENDPOINT = 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip='
const FM_ID_ENDPOINT = 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id='


function gatherResultsFromApi(query, endpoint, callback) {
	// this function will gather the results from the API based on the input from the user and renderResults() 
	//on the map
	const settings = {
		// should this url be ZIPCODE_ENDPOINT+query/zip entered?
		url: endpoint + query,
		type:'GET',
		contentType: "application/json; charset=utf-8",
		data: {
			q: query,
			per_page: 10
		},
		dataType: 'jsonp',
        jsonpCallback: callback,
	}
	$.ajax(settings)

	// console.log()

}

function handleSearchResults(data){
	// this will interpret results from API to then put in showResultsOnMap
	const resultsElem = $('.results');

	$('#map').prop('hidden', false);

	resultsElem
 	.prop('hidden', false)
 	// .html(resultsHtml); <-- this needs to be adding it to the map?

	const results = data.results.map((item, index) =>
		showResultsOnMap(item));
	console.log(results)

}

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8
    });
}

function showResultsOnMap(){
	// this will load the map of results to the page
	console.log('results are loaded to page')
}

function handleSubmitButton(){
	// this function will handle the input in the form after the submit button is pressed and will gatherResults()

	$('.search-form').submit(event =>{
		event.preventDefault();
		const queryTarget = $(event.currentTarget).find('#zip-search');
		const zip = queryTarget.val();
		queryTarget.val('');
		gatherResultsFromApi(zip, ZIPCODE_ENDPOINT, handleSearchResults(zip)); //experimentally entered argument for handleSearchResults
		}
	)
}


// after map loads, this will handle how the user interacts with the map and results
function showMarketDetails(){
	// this function will show the title of the market, the schedule, and the products sold in a side bar when a user
	// selects a market from the map
	console.log('market details loaded to page')
}

function handleIdDetails() {

}

function handleMarketSelect(){
	// this function will handle the event of the user selecting a market from the map and will renderResultDetails()
	

	gatherResultsFromApi(id, FM_ID_ENDPOINT, handleIdDetails)

	// console.log('market selected from map')
}

handleSubmitButton();
// handleMarketSelect();
