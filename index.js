'use strict'

const ZIPCODE_ENDPOINT = 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip='
const FM_ID_ENDPOINT = 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id='


function gatherResultsFromApi(query, callback){
	// this function will gather the results from the API based on the input from the user and renderResults() 
	//on the map
	const settings = {
		// should this url be ZIPCODE_ENDPOINT+query/zip entered?
		url: ZIPCODE_ENDPOINT + query,
		type:'GET',
		contentType: "application/json; charset=utf-8",
		data: {
			zip: query,
			per_page: 10
		},
		success: callback,
	}
	$.ajax(settings)

	console.log('results are gathered')

}

function getResultData(){

}

function showResultsOnMap(){
	// this will load the map of results to the page
	const resultsElem = $('.results');

	outputElem
    .prop('hidden', false)
    // .html(resultsHtml);

	console.log('results are loaded to page')
}

function handleSubmitButton(){
	// this function will handle the input in the form after the submit button is pressed and will gatherResults()

	$('.search-form').submit(event =>{
		event.preventDefault();
		const queryTarget = $(event.currentTarget).find('#zip-search');
		const zip = queryTarget.val();
		queryTarget.val('');
		gatherResultsFromApi(zip, getResultData);
		}
	)
}


// after map loads, this will handle how the user interacts with the map and results
function renderMarketDetails(){
	// this function will show the title of the market, the schedule, and the products sold in a side bar when a user
	// selects a market from the map
	console.log('market details loaded to page')

}

function handleMarketSelect(){
	// this function will handle the event of the user selecting a market from the map and will renderResultDetails()
	console.log('market selected from map')
}

handleSubmitButton();
handleMarketSelect();
