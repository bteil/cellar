// The root URL for the RESTful services
var rootURL = "http://localhost/cellar/api";

var currentWine;

// Retrieve wine list when application starts 
findAll();
//getCountries();


// Register listeners
$('#listCountries').change(function() {
	getCountries();
});

// Nothing to delete in initial application state
$('#btnDelete').hide();

// Register listeners
$('#btnSearch').click(function() {
	search($('#searchKey').val());
	return false;
});

// Trigger search when pressing 'Return' on search key input field
$('#searchKey').keypress(function(e){
	if(e.which == 13 ) {
		search($('#searchKey').val());
		e.preventDefault();
		return false;
    }
});


$('#searchKey').keyup(function(e){
        search($('#searchKey').val());
});

$('#btnAdd').click(function() {
	newWine();
	return false;
});

$('#btnSave').click(function() {
	if ($('#wineId').val() == '')
		addWine();
	else
		updateWine();
	return false;
});

$('#btnDelete').click(function() {
	deleteWine();
	return false;
});

$('#wineList a').live('click', function() {
	findById($(this).data('identity'));
});

// Replace broken images with generic wine bottle
$("img").error(function(){
  $(this).attr("src", "pics/generic.jpg");

});

function search(searchKey) {
	if (searchKey == '') 
		findAll();
	else
		findByName(searchKey);
}

function newWine() {
	$('#btnDelete').hide();
	currentWine = {};
	renderDetails(currentWine); // Display empty form
}

function findAll() {
	console.log('findAll');
	$.ajax({
		type: 'GET',
		url: rootURL+ '/wines',
		dataType: "json", // data type of response
		success: renderList
	});
}

function findByName(searchKey) {
	console.log('findByName: ' + searchKey);
	$.ajax({
		type: 'GET',
		url: rootURL + '/wines/search/' + searchKey,
		dataType: "json",
		success: renderList 
	});
}

function findById(id) {
	console.log('findById: ' + id);
	$.ajax({
		type: 'GET',
		url: rootURL + '/wines/' + id,
		dataType: "json",
		success: function(data){
			$('#btnDelete').show();
			console.log('findById success: ' + data.name);
			currentWine = data;
			renderDetails(currentWine);
		}
	});
}

function addWine() {
	console.log('addWine');
	$.ajax({
		type: 'POST',
		contentType: 'application/json',
		url: rootURL+'/wines',
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			alert('Wine created successfully');
			$('#btnDelete').show();
			$('#wineId').val(data.id);
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('addWine error: ' + textStatus);
		}
	});
}

function updateWine() {
	console.log('updateWine');
	$.ajax({
		type: 'PUT',
		contentType: 'application/json',
		url: rootURL + '/wines/' + $('#wineId').val(),
		dataType: "json",
		data: formToJSON(),
		success: function(data, textStatus, jqXHR){
			alert('Wine updated successfully');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('updateWine error: ' + textStatus);
		}
	});
}

function deleteWine() {
	console.log('deleteWine');
	$.ajax({
		type: 'DELETE',
		url: rootURL + '/wines/' + $('#wineId').val(),
		success: function(data, textStatus, jqXHR){
			alert('Wine deleted successfully');
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert('deleteWine error');
		}
	});
}

function renderList(data) {
	// JAX-RS serializes an empty list as null, and a 'collection of one' as an object (not an 'array of one')
	var list = data == null ? [] : (data.wine instanceof Array ? data.wine : [data.wine]);

	$('#wineList li').remove();
	$.each(list, function(index, wine) {
		$('#wineList').append('<li><a href="#" data-identity="' + wine.id + '">'+wine.name+'</a></li>');
	});
}




function renderDetails(wine) {
	$('#wineId').val(wine.id);
	$('#name').val(wine.name);
	$('#grapes').val(wine.grapes);
	$('#country').val(wine.country);
	$('#region').val(wine.region);
	$('#year').val(wine.year);
	$('#pic').attr('src', 'pics/' + wine.picture);
	$('#description').val(wine.description);
}

// Helper function to serialize all the form fields into a JSON string
function formToJSON() {
	return JSON.stringify({
		"id": $('#wineId').val(), 
		"name": $('#name').val(), 
		"grapes": $('#grapes').val(),
		"country": $('#country').val(),
		"region": $('#region').val(),
		"year": $('#year').val(),
		"picture": currentWine.picture,
		"description": $('#description').val()
		});
}


function getCountries(){
    console.log('get countries');
    var $countries = $('#listCountries');
    $countries.empty();
	$.ajax({
		type: 'GET',
		url: rootURL + '/countries',
		dataType: "json",
		success: function(json) {
                    $.each(json, function(id,country) { // pour chaque noeud JSON
                        // on ajoute l option dans la liste
                        
                        $countries.append('<option value="'+ country.id +'">'+ country.libelle+'</option>');
                        //alert(libelle);
                    });
                } 
	});
}

//$().ready(function() {
//    alert('toto');
//    getCountries();
// 
//});