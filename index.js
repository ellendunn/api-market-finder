'use strict'

function renderResults(){
	// this will load the map of results to the page
	console.log('results are loaded to page')
}

function gatherResults(){
	// this function will gather the results from the API based on the input from the user and renderResults() on the map
		console.log('results are gathered')

}

function handleSubmitButton(){
	// this function will handle the input in the form after the submit button is pressed and will gatherResults()
	console.log('submit button pressed')

}

function renderResultDetails(){
	// this function will show the title of the market, the schedule, and the products sold in a side bar when a user
	// selects a market from the map
	console.log('market details loaded to page')

}

function handleResultSelect(){
	// this function will handle the event of the user selecting a market from the map and will renderResultDetails()
	console.log('market selected from map')
}

handleSubmitButton();
handleResultSelect();
