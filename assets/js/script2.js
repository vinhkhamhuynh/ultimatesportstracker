// gary's code
$(document).ready(function () {

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
