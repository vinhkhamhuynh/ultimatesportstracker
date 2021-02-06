 $(".dropdown-trigger").dropdown({
     coverTrigger: false,
     closeOnClick: false,
    //   inDuration: 300,
        //   outDuration: 225,
        //   constrainWidth: false, // Does not change width of dropdown to that of the activator
          hover: true, // Activate on hover
          gutter: 0, // Spacing from edge
          belowOrigin: false, // Displays dropdown below the button
        //   alignment: 'right', // Displays dropdown with edge aligned to the left of button
          stopPropagation: true // Stops event propagation
 });

$(document).ready(function () {



    $('.collapsible').collapsible({
        accordion: false
    });

     //vh get api to display nfl team when user hover over "nfl" on nav bar
     function nflDisplay() {

        //vh create var from api link 
        var requestNflUrl = "https://api.sportsdata.io/v3/nfl/scores/json/AllTeams?key=c92709fa7d9a4261bf1ee17785767b5b";
      
        //vh fetch data to use
        fetch(requestNflUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(nflData){
            console.log(nflData);

            
            //vh loop data to generate all team info
            for (var i = 0 ; i< nflData.length; i++) {
                //vh03
                // if (i === 0 || i === 25 || i === 36 ) break;
                //vh create a div to hold team name btn and img with class to check img size in css 
                // var nflDiv = $("<div>").attr("id", "nflDiv")

                //vh03
                var nflDiv = $("<li>").addClass("collection-item avatar").attr("id", "nflItem")


                //vh generate img url from api
                var imgUrl = nflData[i].WikipediaLogoUrl

                //vh create img tag to hold url 
                var teamImg= $("<img>").attr({"id": "teamImg", "src": imgUrl}).addClass("circle")

                //vh create team btn and attach name to button 
                var teamSpan =$("<span>").attr("TeamID", nflData[i].TeamID).addClass("title").text(nflData[i].Name)

                //vh attach img to nflDiv
                nflDiv.append(teamImg)
                //vh attach btn to nflDiv
                nflDiv.append(teamSpan)

                //vh attach nflDiv to li-nfl
                // $("#NFL").append(nflDiv)

                //vh03
                $(".collection").append(nflDiv)
            }
        })

    }

nflDisplay();










// saving teams selected
var myTeam = JSON.parse(localStorage.getItem('storedNFL')) || [];


var ul = document.getElementById('dropdown');
ul.onclick = function(event) {
    var teamId = event.target.getAttribute("teamid");
    var teamFullName = event.target.innerHTML;
    alert(teamFullName+" "+teamId);
    if (myTeam.some(check => check.teamId === teamId)) {
        //console.log("Object found inside the array.");
        var removeIndex = myTeam.map(function (item) { return item.teamId; }).indexOf(teamId);
        myTeam.splice(removeIndex, 1);
    } else {
        //console.log("Object not found.");
        myTeam.push({ gameOf: "NFL", teamId: teamId, teamFullName: teamFullName });
    }
    localStorage.setItem('storedNFL', JSON.stringify(myTeam));
;};


// gary adding code for news feed
var teamName = "philadelphia eagles" // need to get name of team from above code when ready! ****
var requestNewUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + teamName + "&api-key=3XNPIhbw16I5OElGvNEztFieigRzON44"
fetch(requestNewUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (detail) {
        var getArticles = detail.response.docs;
        let outputNews = `<h4>Latest News:</h4>`;         
        $.each(getArticles, function (i, val) {
            if (i > 3) return;
            outputNews += `<p>${this.headline.main}</p>
            <a target="_blank" href="${this.web_url}">
            <i class="tiny material-icons">launch</i></a>
            </p>
            `;
        })
        $('#newsFeed').append(outputNews);
    })



});

