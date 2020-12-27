
// Jquery button alert message
$(document).ready(function(){
    $("button").click(function(){
        alert("Sending you to our awesome movie search page");
     });
});

d3.json("/movies_score").then(function(data){
    console.log(data)
    title = data["title"]
    titles = []
    Object.entries (title).forEach(([key,value])=>{
        titles.push(value)
    })
    console.log(titles)
    imdb = data["imdb"]
    imdb_review = []
    Object.entries (imdb).forEach(([key,value])=>{
        imdb_review.push(value)
    })
    console.log(imdb_review)
    rotten_tm = data["rotten_tomatoes"]
    review_rotten = []
    Object.entries (rotten_tm).forEach(([key,value])=>{
        review_rotten.push(value/10)
    })
    console.log(review_rotten)

    score_value = data["score"]
    score = []
    Object.entries (score_value).forEach(([key,value])=>{
        score.push(value)
    })
    console.log(score)

    run_time = data["runtime"]
    run = []
    Object.entries (run_time).forEach(([key,value])=>{
        run.push(value)
    })
    console.log(run)

  // Bar chart rotten_tomatoes vs IMDB vs ave score
var trace1 = {
    y:imdb_review.slice(0,10),
    x:titles.slice(0,10),
    type:"bar",
    orientaton: "h",
    name: "IMDB"
}
var trace2 = {
    y:review_rotten.slice(0,10),
    x:titles.slice(0,10),
    type:"bar",
    orientaton: "h",
    name: "Rotten Tomatoes"
}
var trace3 = {
    y:score.slice(0,10),
    x:titles.slice(0,10),
    type:"bar",
    orientaton: "h",
    name: "Ave Rating"
}

var layout ={
// width: 700,
// height: 500,

barmode: "group",
title: "Movie Ratings",
xaxis: {
    title: "Top Ten Movies by Ave Score",
    automargin: true,
    tickangle: 45
    },
yaxis: {
    title: "Corresponding IMDB Rating",
    automargin: true,
    }
}
var barData =[trace3, trace1, trace2]
Plotly.newPlot("bar", barData, layout)

// Bubble chart running time vs score
var running = run.map(r=> r/3)
var bubbleData = {
    y:score.slice(0,50),
    x:run.slice(0,50),
    text: titles.slice(0,50),
    marker:{
    size:running.slice(0,50),
    color:score.slice(0,50)
    },
    mode:"markers"
}
var bubbleLayout ={
title:"Running Time Vs. Avg Score",
automargin:true,
// width: 800,
// height: 500,
xaxis:{title: "Running Time"},
yaxis:{title:"Average Score"}
}
var bubbleTrace =[bubbleData]
Plotly.newPlot("bubble", bubbleTrace, bubbleLayout);

})

// Pie chart 10 genres and their overall ave
d3.json("/movies_genre").then(function(data){
    console.log(data)

    genres = []
    Object.entries (data["genres"]).forEach(([key,value])=>{
        genres.push(value)
    })
    counts = []
    Object.entries (data["count"]).forEach(([key,value])=>{
        counts.push(value)
    })

var pieData = [{
    values: counts,
    labels: genres,
    type: 'pie'
  }];
  
  var pielayout = {
    title: "Genres",
    automargin: true,
    // height: 400,
    // width: 500
  };
  Plotly.newPlot('pie', pieData, pielayout)
})
