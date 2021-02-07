// gary's code
$(document).ready(function () {

    getNews();
    getNFLData();

    // variables
    var cardsEl = document.getElementById('teamDetails');
    var myTeam = JSON.parse(localStorage.getItem('storedNFL')) || [];
    var nflMain = [];
    var nflTeamNews = [];
    var teamLogo = "";
    var teamConference = "";
    var teamDiv = "";
    var team = "";
    var teamCoach = "";
    var teamOpp = "";
    var teamOppRank = "";

    // saving teams selected
    var nflList = document.getElementsByClassName('collection');
    for (var i = 0; i < nflList.length; i++) {
        nflList[i].onclick = function (event) {
            // alert("change");
            //console.log(event.target)
            var teamId = event.target.getAttribute("teamid");
            var teamFullName = event.target.innerHTML;
            var teamKey = event.target.getAttribute("keyid");
            //alert(teamFullName + " " + teamId+" "+teamKey);
            if (myTeam.some(check => check.teamId === teamId)) {
                var removeIndex = myTeam.map(function (item) { return item.teamId; }).indexOf(teamId);
                myTeam.splice(removeIndex, 1);
            } else {
                myTeam.push({ gameOf: "NFL", teamId: teamId, teamFullName: teamFullName, teamKey: teamKey });
            }
            localStorage.setItem('storedNFL', JSON.stringify(myTeam));
            getNFLData();
        }

    }

    function getNFLData() {
        var requestUrlNfl = "https://api.sportsdata.io/v3/nfl/scores/json/AllTeams?key=e36c9461165b4289b08a18497bd0b8b1";

        fetch(requestUrlNfl)
            .then(function (response) {
                return response.json();
            })
            .then(function (nflData) {
                nflMain = nflData;
                console.log(nflMain);
                genMain();
            })
    }


    function genMain() {
        cardsEl.innerHTML = "";
        myTeam.forEach(function (team) {
            getData(team.teamKey);
        })
    }

    const getData = async (key) => {
        const response = await fetch("https://api.sportsdata.io/v3/nfl/scores/json/NewsByTeam/" + key + "?key=e36c9461165b4289b08a18497bd0b8b1")
        const data = await response.json()
        nflTeamNews = data
        console.log(data)
        console.log("waiting works")
        genCards(key);
    }

    function genCards(key) {
        for (var i = 0; i < myTeam.length; i++) {
            for (var j = 0; j < nflMain.length; j++) {
                if (myTeam[i].teamKey === nflMain[j].Key && myTeam[i].teamKey === key) {

                    teamLogo = nflMain[j].WikipediaLogoUrl;
                    teamConference = nflMain[j].Conference;
                    teamDiv = nflMain[j].Division;
                    team = nflMain[j].YahooName;
                    teamCoach = nflMain[j].HeadCoach;
                    teamOpp = nflMain[j].UpcomingOpponent;
                    teamOppRank = nflMain[j].UpcomingOpponentRank;
                    //console.log(team);
                    //getData(myTeam[i].teamKey);
                    
                    var outputTeamCards = `<div class="row border plate flex">
                                            <div class="col s1 m1 l1">
                                                <img src="${teamLogo}" class="team-Box-Icon">
                                            </div>
                                            
                                            <div class="col s8 m8 l8 border">
                                                <div class="row team-Box-Name">
                                                    <div class="col s12 m12 l12">${team}</div>
                                                </div>
                                                <div class="row team-Box-WinLoss">
                                                    <div class="col s12 m12 l12">Conference: ${teamConference} - ${teamDiv}</div>
                                                    <div class="col s12 m12 l12">Head Coach: ${teamCoach}</div>
                                                    <div class="col s12 m12 l12">Upcoming Opponent & Rank: ${teamOpp} - ${teamOppRank}</div>
                                                </div>
                                            </div>
                                
                                            <div class="col m3">
                                                <div class="row" id="newsFeed">
                                                    <h4>Team News:</h4>
                                                    <p>${nflTeamNews[0].Title}</p>
                                                    <a target="_blank" href="${nflTeamNews[0].Url}">
                                                    <i class="tiny material-icons">launch</i></a>
                                                </div>
                                            </div>
                                    </div>
                    `;
                    $('#teamDetails').append(outputTeamCards);
                }
            }
        }
    }

    //NY times API ran only once for headline news
    function getNews() {
        var requestNewUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + "football" + "&api-key=3XNPIhbw16I5OElGvNEztFieigRzON44"
        fetch(requestNewUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (detail) {
                var getArticles = detail.response.docs;
                let outputNews = `<div class="row plate flex">
                <img src="assets/img/football-banner.jpg" class="team-Box-Icon">
                                    <div class="col">
                                    
                                    <h4>Latest Football News:</h4>`;
                $.each(getArticles, function (i, val) {
                    if (i > 5) return;
                    outputNews += ` <p>${this.headline.main}</p>
                                            <a target="_blank" href="${this.web_url}">
                                            <i class="tiny material-icons">launch</i></a>
                `;
                })
                $('#teamDetails').before(outputNews);
            })
    }


});



