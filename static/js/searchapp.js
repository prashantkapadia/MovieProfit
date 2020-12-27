var xhReq = new XMLHttpRequest();
xhReq.open("GET", "/movies2", false);
xhReq.send(null);
var myData = JSON.parse(xhReq.responseText);

console.log(myData);
console.log(myData[0].age)
console.log("BREAK")


window.onload = function(){
  
  // This waits for the window to render and then loads the movies based on the current
  // selections. The user never sees an empty movie list.
  
  initializePage();
};
function initializePage(){
   //genre is hard coded
   //age is hard coded
   //movies need to be generated
   rebuildMovieTitleList();
}

function rebuildMovieTitleList(){
    let selector = "selMovie";
    let ListOfMatchingMovies = buildMovieOptionList();
    // Need next 4 functions below to buildMovieOptionList
    // Next the list needs to live in the select dropdown menu 
    clearDropDown(selector);
    appendDropDownOptions( selector, ListOfMatchingMovies);
    displayCurrentMovieData();
}


function buildMovieOptionList(){
    let UserGenreChoice = getSelectedOption("selGenre");
    let UserAgeChoice = getSelectedOption("selAge");
    let MatchingMovieObjects = getListOfMoviesByGenreAndAge(UserGenreChoice.innerHTML, UserAgeChoice.innerHTML);
    return MatchingMovieObjects 
}


function getSelectedOption(selectID){
    let htmlElement = document.getElementById(selectID);
    for (let i = 0; i < htmlElement.options.length; i++){
        let option = htmlElement.options[i];
        if(option.selected == true){
            return option;
        }
    }
    return null
}
// Above function code was modified from stackoverflow

function getListOfMoviesByGenreAndAge(GenreChoice, AgeChoice){
    let allMovies = myData;
    let moviesMatchingGenre = filterList(allMovies, "genres", GenreChoice);
    let moviesMatchingGenreAndAge = filterList(moviesMatchingGenre, "age", AgeChoice);
    return moviesMatchingGenreAndAge;
}

function filterList(listdata, key, value){
    return listdata.filter(x => x[key] === value);

}

function clearDropDown(selectID){
    let htmlElement = document.getElementById(selectID);
    let size = htmlElement.options.length;
    for(i = size-1; i>=0; i--){
        htmlElement.options[i] = null;
    }
// This was found online by google searching how to clear a dropdown
}

function appendDropDownOptions( selectID, listofOptions){
    let selector = d3.select("#" + selectID);
    listofOptions.forEach(function(MovieObject){
        selector
        .append("option")
        .text(MovieObject.title)
        .property("value", MovieObject.title)
        //.property("makeobjectliveinHTML", MovieObject)
    });

}
function displayCurrentMovieData(){
    let displaybox = d3.select("#movie-display");
    displaybox.html("")
    let userMovieChoice = getSelectedOption("selMovie").innerHTML;
    let MovieObject = getMovieObject(userMovieChoice)[0];
    console.log(MovieObject);
    
    Object.entries(MovieObject).forEach(function([key, value]){
        return displaybox.append("h4").text(`${key}: ${value}`);
    });
    

}

function getMovieObject(movieChoice){
    let allMovies = myData;
    let moviesMatchingMovieTitle = filterList(allMovies, "title", movieChoice);
    return moviesMatchingMovieTitle;
}

