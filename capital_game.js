// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
window.onload = async function(){
const pairs = [];
const coordinates = [];
var csvFile = "https://cs374.s3.ap-northeast-2.amazonaws.com/country_capital_geo.csv";

let promise  = await fetch (csvFile);
const text = await promise.text();
const data  = text.split('\n').slice(1);
data.forEach(elt =>{
	const row = elt.split(',');
	if(row[0]==""){;}
	else{
	pairs.push({"country": row[0], "capital": row[1]});
	coordinates.push({"country":row[0],"coordinates":[row[2],row[3]]})
	;}
});
// var map = document.getElementById("map");
var state = true;
var myTableAll = document.getElementById("table");
var myTableCorrect = document.getElementById("tableR");
var myTableWrong = document.getElementById("tableW");
var ranNum = getRandomInt(0, pairs.length -1);
var myBtn = document.getElementById("pr3__button");
var myInput = document.getElementById("pr3__capital");
var country = document.getElementById("pr3__country");
var selector = document.getElementById("select");
var clear = document.getElementById("pr3__clear");


select.addEventListener("change",filterRows);

var source = [];
var i = 3;
myBtn.addEventListener("click", evaluate);
clear.onclick = function(){
	clearTable();
}
myInput.addEventListener("keypress",function (e) {
	if(e.key === 'Enter') evaluate();
});

// idx = ranNum;

// window.onload = function(){
$( document ).ready(function() {
			// $(myTableAll).hide();
	$("#tableW").hide();
	$("#tableR").hide();
});
country.textContent = pairs[ranNum].country;
let empt = myTableAll.insertRow(2);
let cel = empt.insertCell(0);
let cel2 = empt.insertCell(1);
let cel3 = empt.insertCell(2);
	// cel2.setAttribute("id", "emptyRow");
cel2.innerHTML = "The list empty";
// addToFireBase();
// 	//console.log(startCountry);
// }
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function correct(cityInput, idx){
	if(cityInput.toUpperCase() == pairs[idx].capital.toUpperCase()){
		return true;
	}
	else return false;
}

function evaluate(){
	console.log("rf");
	let value = myInput.value;
	if(value === ""){
		;
	}
	else if(correct(value, ranNum)){
		addToTable(true, value);
	}
	else addToTable(false, value);
	}

function addToTable(isright, value){
	if(state){myTableAll.deleteRow(2);
			state = false;}
	var remove = document.createElement("Button");
	let row = myTableAll.insertRow(2);
	let cell1 = row.insertCell(0);
	let cell2 = row.insertCell(1);
	let cell3 =  row.insertCell(2);
	let cell4 = row.insertCell(3);
	let id = getRandomId();
	remove.innerHTML = "Remove";
	remove.addEventListener("click", removeRow);
	remove.setAttribute("data-id", id);

	row.id = id;
	cell4.appendChild(remove);
	source.push(value);
	cell1.innerHTML = pairs[ranNum].country;
	cell3.innerHTML = pairs[ranNum].capital;
	if (isright) {
		let idC = getRandomId();
		row.style.color = "green";
		cell2.innerHTML = value;
		let rowC = myTableCorrect.insertRow(2);
		let cellC1 = rowC.insertCell(0);
		let cellC2 = rowC.insertCell(1);
		let cellC3 =  rowC.insertCell(2);
		let cellC4 = rowC.insertCell(3);
		var removeC = document.createElement("Button");
		removeC.addEventListener("click", removeRow);
		removeC.setAttribute("data-id", idC);
		removeC.innerHTML = "Remove";
		cellC1.innerHTML = pairs[ranNum].country;
		cellC3.innerHTML = pairs[ranNum].capital;
		rowC.style.color = "green";
		cell2.innerHTML = value;
		rowC.id = idC;
		cellC4.appendChild(removeC);
		
	}
	else{
		let idW = getRandomId();
		row.style.color = "red";
		cell2.innerHTML = `<del> ${value}<\del>`;
		let rowW = myTableWrong.insertRow(2);
		let cellW1 = rowW.insertCell(0);
		let cellW2 = rowW.insertCell(1);
		let cellW3 =  rowW.insertCell(2);
		let cellW4 = rowW.insertCell(3);
		let removeW = document.createElement("Button");
		removeW.addEventListener("click", removeRow);
		removeW.setAttribute("data-id", idW);
		removeW.innerHTML = "Remove";
		cellW1.innerHTML = pairs[ranNum].country;
		cellW3.innerHTML = pairs[ranNum].capital;
		rowW.style.color = "red";
		cellW2.innerHTML = `<del> ${value}<\del>`;
		rowW.id = idW;
		cellW4.appendChild(removeW);
	}
	i++;
	updateFireBase();
	ranNum = getRandomInt(0, pairs.length-1);
	country.textContent = pairs[ranNum].country;
	myInput.value = "";
	var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
    center: getCoordinates(country.textContent), // starting position [lng, lat]
    zoom: 4 // starting zoom
    });
}

function removeRow(event){
	let btnClicked = event.target;
	let rowId =  btnClicked.getAttribute('data-id');
	document.getElementById(rowId).remove();

}

function getRandomId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

$(document).ready(function(){
	$("#pr2__capital").autocomplete({
		maxShowItems: 8,
		source: source,
		
	});
});

function filterRows(event){
	let slectedRilter  = event.target;
	if(slectedRilter.value === "Correct"){
		$( document ).ready(function() {
			$("#table").hide();
			$("#tableR").show();
			$("#tableW").hide();
		});
	}
	else if (slectedRilter.value === "Wrong"){
		$( document ).ready(function() {
			$("#table").hide();
			$("#tableR").hide();
			$("#tableW").show();
		});
	}
	else{
		$( document ).ready(function() {
			$("#table").show();
			$("#tableW").hide();
			$("#tableR").hide();
		}); 
	}
}

var firebaseConfig = {
    apiKey: "AIzaSyCUVLM3071EPYdIvRUTqJZg4IXbJgptsiI",
    authDomain: "hci-3895a.firebaseapp.com",
    databaseURL: "https://hci-3895a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "hci-3895a",
    storageBucket: "hci-3895a.appspot.com",
    messagingSenderId: "743277764958",
    appId: "1:743277764958:web:875d36b61d36f8b7faafcf",
    measurementId: "G-GG45450X7L"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// function addToFireBase(){
	firebase.database().ref('row/'+ i).set({
		country: country.textContent,
		city: pairs[ranNum].capital,
		entery:""
	});
// }
mapboxgl.accessToken = 'pk.eyJ1IjoibWludGU0NyIsImEiOiJja29zbDZ6aDgwMmtrMnZxajdsemh2Zm0yIn0.bTVIUr0SLaldJBIszkbysA';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v11', // style URL
    center: getCoordinates(country.textContent), // starting position [lng, lat]
    zoom: 4 // starting zoom
    });
console.log(country.textContent);
console.log(getCoordinates(country.textContent));
function updateFireBase(){
	console.log(i);
	firebase.database().ref('row/'+i).update({
		country: country.textContent,
		city: pairs[ranNum].capital,
		entery: myInput.value
	});
}


function clearTable(){
	let len = document.getElementById("table").rows.length;
	let lenW = document.getElementById("tableW").rows.length;
	let lenR = document.getElementById("tableR").rows.length;
	console.log(len);
	if(len ===2){alert("No items to clear");}
	firebase.database().ref('row/').remove();
	for(let i = 2; i < len; i++){
		document.getElementById("table").deleteRow(2);
	}
	for(let i = 2; i < lenW; i++){
		document.getElementById("tableW").deleteRow(2);
	}
	for(let i = 2; i < lenR; i++){
		document.getElementById("tableR").deleteRow(2);
	}
}
 function readFireBase(){

 	}
 function getCoordinates(country){
 	for (let i = 0; i < coordinates.length; i++) {
 		if(coordinates[i].country == country) 
 			return coordinates[i].coordinates;
 	}
 }

}







