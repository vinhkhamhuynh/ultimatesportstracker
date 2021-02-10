// gary's code
$(document).ready(function () {



    // variables
    var cardsEl = document.getElementById('teamDetails');
    var myTeam = JSON.parse(localStorage.getItem('storedNFL')) || [];
    var nflMain = [];
    var nflStatsMain = [];
    var nbaMain = [];
    var nflTeamNews = [];
    var teamLogo = "";
    var teamConference = "";
    var teamDiv = "";
    var team = "";
    var teamCoach = "";
    var teamOpp = "";
    var teamOppRank = "";
    var outputTeamCards = "";
    var nflKey = "c92709fa7d9a4261bf1ee17785767b5b"; // garys over quota key is e36c9461165b4289b08a18497bd0b8b1

    init();
    function init() {
        getNews();
        getNFLData();
        getNBAData();
    }




    // saving teams selected
    var nflList = document.getElementsByClassName('collection');
    for (var i = 0; i < nflList.length; i++) {
        nflList[i].onclick = function (event) {
            // alert("change");
            var target = event.target;
            var gameOf = target.parentElement.parentElement.parentElement.parentElement.id;
            var teamId = event.target.getAttribute("teamid");
            var teamFullName = event.target.innerHTML;
            var teamKey = event.target.getAttribute("keyid");
            //alert(teamFullName + " " + teamId+" "+teamKey);
            if (myTeam.some(check => check.teamId === teamId)) {
                var removeIndex = myTeam.map(function (item) { return item.teamId; }).indexOf(teamId);
                myTeam.splice(removeIndex, 1);
            } else {
                myTeam.push({ gameOf: gameOf, teamId: teamId, teamFullName: teamFullName, teamKey: teamKey });
            }
            localStorage.setItem('storedNFL', JSON.stringify(myTeam));
            // nfl and nba split
            if (gameOf === "NBA") {
                getNBAData();
            } else {
                getNFLData();
            }
        }

    }

    function getNFLData() {
        var requestUrlNfl = "https://api.sportsdata.io/v3/nfl/scores/json/AllTeams?key="+nflKey;

        fetch(requestUrlNfl)
            .then(function (response) {
                return response.json();
            })
            .then(function (nflData) {
                nflMain = nflData;
                //console.log(nflMain);
                // Mike's update
                var requestUrlNflData = "https://api.sportsdata.io/v3/nfl/scores/json/TeamSeasonStats/2020REG?key="+nflKey;
                fetch(requestUrlNflData)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (nflStatsData) {
                        nflStatsMain = nflStatsData;
                        //console.log(nflStatsMain);
                        genMain();
                    })
            })


    }


    function genMain() {
        cardsEl.innerHTML = "";
        myTeam.forEach(function (team) {
            if (team.gameOf === "NFL") {
                getData(team.teamKey);
            } else {
                //getDataNba(team.teamKey);
                genCardsNba(team.teamKey)
            }
        })
    }

    const getData = async (key) => {
        const response = await fetch("https://api.sportsdata.io/v3/nfl/scores/json/NewsByTeam/" + key + "?key="+nflKey)
        const data = await response.json()
        nflTeamNews = data
        //console.log(data)
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

                    outputTeamCards = `
                    <div class="row border plate flex">
                        <ul class="collapsible">
                            <li class="collapsible-row">
                                <div class="collapsible-header">
                                    <div class="col s1 m1 l1">
                                        <img src="${teamLogo}" class="team-Box-Icon">
                                    </div>                                
                                    <div class="col s8 m8 l8">
                                        <div class="row team-Box-Name">
                                            <div class="col s12 m12 l12">${team}</div>
                                        </div>
                                        <div class="row team-Box-WinLoss">
                                            <div class="col s12 m12 l12">Conference: ${teamConference} - ${teamDiv}</div>
                                            <div class="col s12 m12 l12">Head Coach: ${teamCoach}</div>
                                            <div class="col s12 m12 l12">Upcoming Opponent & Rank: ${teamOpp} - ${teamOppRank}</div>
                                        </div>
                                    </div>                                            
                                    <div class = "col s3 m3 l3">
                                        <div class="row" id="newsFeed">
                                            <div class = "col s12 m12 l12 stat-header">Team Headline News:</div>  
                                            <div class = "col s12 m12 l12>
                                            <a target="_blank" href="${nflTeamNews[0].Url}"><p>${nflTeamNews[0].Title}</p>
                                            </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                    `;
                    genCardDetails(key);
                }
            }
        }
    }


    function genCardDetails(key) {
        for (var i = 0; i < myTeam.length; i++) {
            for (var k = 0; k < nflStatsMain.length; k++) {
                if (myTeam[i].teamKey === nflStatsMain[k].Team && myTeam[i].teamKey === key) {
                    NFLSeason = nflStatsMain[k].Season;
                    NFLGames = nflStatsMain[k].Games;
                    NFLOverUnder = nflStatsMain[k].OverUnder;
                    NFLTotalScore = nflStatsMain[k].TotalScore;
                    NFLRedZoneConversions = nflStatsMain[k].RedZoneConversions;
                    NFLPenaltyYards = nflStatsMain[k].PenaltyYards;
                    NFLScoreOvertime = nflStatsMain[k].ScoreOvertime;
                    NFLScoreQuarter1 = nflStatsMain[k].ScoreQuarter1;
                    NFLScoreQuarter2 = nflStatsMain[k].ScoreQuarter2;
                    NFLScoreQuarter3 = nflStatsMain[k].ScoreQuarter3;
                    NFLScoreQuarter4 = nflStatsMain[k].ScoreQuarter4;
                    NFLThirdDownConversions = nflStatsMain[k].ThirdDownConversions;
                    NFLThirdDownPercentage = nflStatsMain[k].ThirdDownPercentage;
                    NFLTimeOfPossession = nflStatsMain[k].TimeOfPossession;
                    NFLFirstDowns = nflStatsMain[k].FirstDowns;
                    NFLFirstDownsByPassing = nflStatsMain[k].FirstDownsByPassing;
                    NFLFirstDownsByPenalty = nflStatsMain[k].FirstDownsByPenalty;
                    NFLFirstDownsByRushing = nflStatsMain[k].FirstDownsByRushing;
                    NFLFourthDownAttempts = nflStatsMain[k].FourthDownAttempts;
                    NFLFourthDownConversions = nflStatsMain[k].FourthDownConversions;
                    NFLFourthDownPercentage = nflStatsMain[k].FourthDownPercentage;
                    NFLKickoffsInEndZone = nflStatsMain[k].KickoffsInEndZone;
                    NFLPuntYards = nflStatsMain[k].PuntYards;
                    NFLPunts = nflStatsMain[k].Punts;
                    NFLTouchdowns = nflStatsMain[k].Touchdowns;
                    NFLOffensivePlays = nflStatsMain[k].OffensivePlays;
                    NFLOffensiveYards = nflStatsMain[k].OffensiveYards;
                    NFLOffensiveYardsPerPlay = nflStatsMain[k].OffensiveYardsPerPlay;
                    NFLPassingYards = nflStatsMain[k].PassingYards;
                    NFLPasserRating = nflStatsMain[k].PasserRating;
                    NFLPassingAttempts = nflStatsMain[k].PassingAttempts;
                    NFLPassingCompletions = nflStatsMain[k].PassingCompletions;
                    NFLPassingDropbacks = nflStatsMain[k].PassingDropbacks;
                    NFLPassingInterceptions = nflStatsMain[k].PassingInterceptions;
                    NFLPassingTouchdowns = nflStatsMain[k].PassingTouchdowns;
                    NFLFieldGoalAttempts = nflStatsMain[k].FieldGoalAttempts;
                    NFLFieldGoalsMade = nflStatsMain[k].FieldGoalsMade;
                    NFLExtraPointKickingAttempts = nflStatsMain[k].ExtraPointKickingAttempts;
                    NFLExtraPointKickingConversions = nflStatsMain[k].ExtraPointKickingConversions;
                    NFLExtraPointPassingAttempts = nflStatsMain[k].ExtraPointPassingAttempts;
                    NFLExtraPointPassingConversions = nflStatsMain[k].ExtraPointPassingConversions;
                    NFLExtraPointRushingAttempts = nflStatsMain[k].ExtraPointRushingAttempts;
                    NFLExtraPointRushingConversions = nflStatsMain[k].ExtraPointRushingConversions;
                    NFLKickReturnYards = nflStatsMain[k].KickReturnYards;
                    NFLKickoffs = nflStatsMain[k].Kickoffs;
                    NFLKickoffsInEndZone = nflStatsMain[k].KickoffsInEndZone;
                    NFLPuntYards = nflStatsMain[k].PuntYards;
                    NFLPunts = nflStatsMain[k].Punts;
                    NFLPenalties = nflStatsMain[k].Penalties;
                    NFLPassingYardsPerAttempt = nflStatsMain[k].PassingYardsPerAttempt;
                    NFLPassingYardsPerCompletion = nflStatsMain[k].PassingYardsPerCompletion;
                    NFLPassesDefended = nflStatsMain[k].PassesDefended;
                    NFLRedZoneAttempts = nflStatsMain[k].RedZoneAttempts;
                    NFLRedZonePercentage = nflStatsMain[k].RedZonePercentage;
                    NFLRushingTouchdowns = nflStatsMain[k].RushingTouchdowns;
                    NFLRushingYards = nflStatsMain[k].RushingYards;
                    NFLRushingYardsPerAttempt = nflStatsMain[k].RushingYardsPerAttempt;
                    NFLQuarterbackHits = nflStatsMain[k].QuarterbackHits;
                    NFLTimesSacked = nflStatsMain[k].TimesSacked;
                    NFLBlockedKicks = nflStatsMain[k].BlockedKicks;
                    NFLInterceptionReturnYards = nflStatsMain[k].InterceptionReturnYards;
                    NFLInterceptionReturns = nflStatsMain[k].InterceptionReturns;
                    NFLPuntReturnYards = nflStatsMain[k].PuntReturnYards;
                    NFLSacks = nflStatsMain[k].Sacks;
                    NFLSafeties = nflStatsMain[k].Safeties;
                    NFLTwoPointConversionReturns = nflStatsMain[k].TwoPointConversionReturns;
                    NFLFumbleReturnTouchdowns = nflStatsMain[k].FumbleReturnTouchdowns;
                    NFLFumbleReturnYards = nflStatsMain[k].FumbleReturnYards;
                    NFLFumbles = nflStatsMain[k].Fumbles;
                    NFLFumblesForced = nflStatsMain[k].FumblesForced;
                    NFLFumblesLost = nflStatsMain[k].FumblesLost;
                    outputTeamCards += `                
                    <div class="collapsible-body">
                        <div class="row flex upper">
                            <div class="col s4 m4 l4 flex border">
                            <div class="container">
                                
                                <div class="row flex center-align">
                                    <div class="col s12 m12 l12 stat-header">Scoring</div>
                                </div>   
                                <div class="row flex">
                                    <div class="col s10 m10 l10 border">Season </div>
                                    <div class="col s2 m2 l2 border">${NFLSeason}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s10 m10 l10 border">Games </div>
                                    <div class="col s2 m2 l2 border">${NFLGames}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s10 m10 l10 border">Over Under </div>
                                    <div class="col s2 m2 l2 border">${NFLOverUnder}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s10 m10 l10 border">Total Score </div>
                                    <div class="col s2 m2 l2 border">${NFLTotalScore}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s10 m10 l10 border">Red Zone Conversions </div>
                                    <div class="col s2 m2 l2 border">${NFLRedZoneConversions}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s10 m10 l10 border">Penalty Yards </div>
                                    <div class="col s2 m2 l2 border">${NFLPenaltyYards}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s10 m10 l10 border">Score Overtime </div>
                                    <div class="col s2 m2 l2 border">${NFLScoreOvertime}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s10 m10 l10 border">Score Quarter 1 </div>
                                    <div class="col s2 m2 l2 border">${NFLScoreQuarter1}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s10 m10 l10 border">Score Quarter 2 </div>
                                    <div class="col s2 m2 l2 border">${NFLScoreQuarter2}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s10 m10 l10 border">Score Quarter 3 </div>
                                    <div class="col s2 m2 l2 border">${NFLScoreQuarter3}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s10 m10 l10 border">Score Quarter 4 </div>
                                    <div class="col s2 m2 l2 border">${NFLScoreQuarter4}</div>
                                </div>  
                            </div>  <!-- End of Container -->
                            </div> <!-- End of column -->
                            
                            <div class="col s8 m8 l8 border flex">
                            <div class="container">
                                <div class="row flex">
                                    <div class="col s12 m12 l12 border stat-header">Offense</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s4 m4 l4 border">Touchdowns</div>
                                    <div class="col s2 m2 l2 border">${NFLTouchdowns}</div>
                                    <div class="col s4 m4 l4 border">Penalties</div>
                                    <div class="col s2 m2 l2 border">${NFLPenalties} </div>
                                </div>
                                <div class="row flex">
                                    <div class="col s4 m4 l4 border">Offensive Plays</div>
                                    <div class="col s2 m2 l2 border">${NFLOffensivePlays}</div>
                                    <div class="col s4 m4 l4 border">Passing Yards Per Attempt</div>
                                    <div class="col s2 m2 l2 border">${NFLPassingYardsPerAttempt} </div>
                                </div>
                                <div class="row flex">
                                    <div class="col s4 m4 l4 border">Offensive Yards</div>
                                    <div class="col s2 m2 l2 border">${NFLOffensiveYards}</div>
                                    <div class="col s4 m4 l4 border">Passing Yards Per Completion</div>
                                    <div class="col s2 m2 l2 border">${NFLPassingYardsPerCompletion} </div>
                                </div>
                                <div class="row flex">
                                    <div class="col s4 m4 l4 border">Offensive Yards Per Play</div>
                                    <div class="col s2 m2 l2 border">${NFLOffensiveYardsPerPlay}</div>
                                    <div class="col s4 m4 l4 border">Passes Defended</div>
                                    <div class="col s2 m2 l2 border">${NFLPassesDefended}</div>
                                </div>
                                    <div class="row flex">
                                    <div class="col s4 m4 l4 border">Passing Yards</div>
                                    <div class="col s2 m2 l2 border">${NFLPassingYards}</div>
                                    <div class="col s4 m4 l4 border">Red Zone Attempts</div>
                                    <div class="col s2 m2 l2 border">${NFLRedZoneAttempts}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s4 m4 l4 border">Passer Rating</div>
                                    <div class="col s2 m2 l2 border">${NFLPasserRating}</div>
                                    <div class="col s4 m4 l4 border">Red Zone Percentage</div>
                                    <div class="col s2 m2 l2 border">${NFLRedZonePercentage}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s4 m4 l4 border">Passing Attempts</div>
                                    <div class="col s2 m2 l2 border">${NFLPassingAttempts}</div>
                                    <div class="col s4 m4 l4 border">Rushing Touchdowns</div>
                                    <div class="col s2 m2 l2 border">${NFLRushingTouchdowns}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s4 m4 l4 border">Passing Completions</div>
                                    <div class="col s2 m2 l2 border">${NFLPassingCompletions}</div>
                                    <div class="col s4 m4 l4 border">Rushing Yards</div>
                                    <div class="col s2 m2 l2 border">${NFLRushingYards}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s4 m4 l4 border">Passing Dropbacks</div>
                                    <div class="col s2 m2 l2 border">${NFLPassingDropbacks}</div>
                                    <div class="col s4 m4 l4 border">Rushing Yards Per Attempt</div>
                                    <div class="col s2 m2 l2 border">${NFLRushingYardsPerAttempt} </div>
                                </div>
                                <div class="row flex">
                                    <div class="col s4 m4 l4 border">Passing Interceptions</div>
                                    <div class="col s2 m2 l2 border">${NFLPassingInterceptions}</div>
                                    <div class="col s4 m4 l4 border">Quarterback Hits</div>
                                    <div class="col s2 m2 l2 border">${NFLQuarterbackHits} </div>
                                </div>
                                <div class="row flex">
                                    <div class="col s4 m4 l4 border">Passing Touchdowns</div>
                                    <div class="col s2 m2 l2 border">${NFLPassingTouchdowns}</div>
                                    <div class="col s4 m4 l4 border">Times Sacked</div>
                                    <div class="col s2 m2 l2 border">${NFLTimesSacked} </div>
                                </div>

                            </div> <!-- End of Container -->
                            </div> <!-- End of Column -->
                        </div> <!-- End of first stat row-->
                        <br />
                    
                        <div class="row flex border lower">
                            <div class="col s4 m4 l4 flex">
                            <div class="container">

                                <div class="row flex">
                                    <div class="col s12 m12 l12 border stat-header">Downs</div>                            
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Third Down Conversions</div>
                                    <div class="col s4 m4 l4 border">${NFLThirdDownConversions}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Third Down Percentage</div>
                                    <div class="col s4 m4 l4 border">${NFLThirdDownPercentage}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Time Of Possession</div>
                                    <div class="col s4 m4 l4 border">${NFLTimeOfPossession}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">First Downs</div>
                                    <div class="col s4 m4 l4 border">${NFLFirstDowns}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">First Downs By Passing</div>
                                    <div class="col s4 m4 l4 border">${NFLFirstDownsByPassing}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">First Downs By Penalty</div>
                                    <div class="col s4 m4 l4 border">${NFLFirstDownsByPenalty}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">First Downs By Rushing</div>
                                    <div class="col s4 m4 l4 border">${NFLFirstDownsByRushing}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Fourth Down Attempts</div>
                                    <div class="col s4 m4 l4 border">${NFLFourthDownAttempts}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Fourth Down Conversions</div>
                                    <div class="col s4 m4 l4 border">${NFLFourthDownConversions}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Fourth Down Percentage</div>
                                    <div class="col s4 m4 l4 border">${NFLFourthDownPercentage}</div>
                                </div>    
                            </div> <!-- End of column -->
                            </div> <!-- End of container -->

                            <div class="col s4 m4 l4 flex">
                            <div class="container">
                                <div class="row flex">
                                    <div class="col s12 m12 l12 stat-header border">Special Teams </div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Field Goal Attempts</div>
                                    <div class="col s4 m4 l4 border">${NFLFieldGoalAttempts}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Field Goals Made</div>
                                    <div class="col s4 m4 l4 border">${NFLFieldGoalsMade}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Extra Point Kicking Attempts</div>
                                    <div class="col s4 m4 l4 border">${NFLExtraPointKickingAttempts}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Extra Point Kicking Conversions</div>
                                    <div class="col s4 m4 l4 border">${NFLExtraPointKickingConversions}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Extra Point Passing Attempts</div>
                                    <div class="col s4 m4 l4 border">${NFLExtraPointPassingAttempts}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Extra Point Passing Conversions</div>
                                    <div class="col s4 m4 l4 border">${NFLExtraPointPassingConversions}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Extra Point Rushing Attempts</div>
                                    <div class="col s4 m4 l4 border">${NFLExtraPointRushingAttempts}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Extra Point Rushing Conversions</div>
                                    <div class="col s4 m4 l4 border">${NFLExtraPointRushingConversions}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Kick Return Yards</div>
                                    <div class="col s4 m4 l4 border">${NFLKickReturnYards}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Kickoffs</div>
                                    <div class="col s4 m4 l4 border">${NFLKickoffs}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Kickoffs In End Zone</div>
                                    <div class="col s4 m4 l4 border">${NFLKickoffsInEndZone}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Punt Yards</div>
                                    <div class="col s4 m4 l4 border">${NFLPuntYards}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Punts</div>
                                    <div class="col s4 m4 l4 border">${NFLPunts}</div>
                                </div>
                            </div> <!-- End of column --> 
                            </div> <!-- End of container -->
                            
                            <div class="col s4 m4 l4 flex">
                            <div class="container">
                                <div class="row flex">
                                    <div class="col s12 m12 l12 border stat-header">Defense</div>                                        
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Blocked Kicks </div>
                                    <div class="col s4 m4 l4 border"> ${NFLBlockedKicks}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Interception Return Yards </div>
                                    <div class="col s4 m4 l4 border"> ${NFLInterceptionReturnYards}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Interception Returns </div>
                                    <div class="col s4 m4 l4 border">${NFLInterceptionReturns}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Punt Return Yards </div>
                                    <div class="col s4 m4 l4 border"> ${NFLPuntReturnYards}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Sacks</div>
                                    <div class="col s4 m4 l4 border"> ${NFLSacks}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Safeties</div>
                                    <div class="col s4 m4 l4 border"> ${NFLSafeties}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Two Point Conversion Returns </div>
                                    <div class="col s4 m4 l4 border">${NFLTwoPointConversionReturns}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Fumble Return Touchdowns </div>
                                    <div class="col s4 m4 l4 border">${NFLFumbleReturnTouchdowns}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Fumble Return Yards </div>
                                    <div class="col s4 m4 l4 border"> ${NFLFumbleReturnYards}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Fumbles</div>
                                    <div class="col s4 m4 l4 border"> ${NFLFumbles}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Fumbles Forced </div>
                                    <div class="col s4 m4 l4 border"> ${NFLFumblesForced}</div>
                                </div>
                                <div class="row flex">
                                    <div class="col s8 m8 l8 border">Fumbles Lost </div>
                                    <div class="col s4 m4 l4 border"> ${NFLFumblesLost}</div>
                                </div>
                            </div> <!-- End of Contianer --> 
                            </div> <!-- End of Column --> 

                        </div> <!-- End of second stat row-->  
                    </div>  <!-- end of collapsible body-->
                    </li>
                </ul>
            </div> <!-- End of Plate -->
                `;
                    $('#teamDetails').append(outputTeamCards);
                }

            }
        }
        $('.collapsible').collapsible();
        document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.collapsible');
            var instances = M.Collapsible.init(elems, options);
        });
    }


    //NY times API ran only once for headline news
    function getNews() {
        var requestNewUrl = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + "sports" + "&api-key=3XNPIhbw16I5OElGvNEztFieigRzON44"
        fetch(requestNewUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (detail) {
                var getArticles = detail.response.docs;
                let outputNews = `<div class="row plate flex">
                <img src="assets/img/football-banner.jpg" class="team-Box-Icon">
                
                        <div class="row flex">
                            <div class="col s12 m12 l12">
                                <h4><span class="stat-header">Latest Sports News:</span></h4>
                            </div>
                        </div>
                        <div class="row flex">
                            <div class="col s12 m12 l12">                        
                        `
                        ;
                $.each(getArticles, function (i, val) {
                    if (i > 5) return;
                    outputNews += ` 
                                            <a target="_blank" href="${this.web_url}"><p>${this.headline.main}
                                            <i class="tiny material-icons">launch</i></a></p>
                                            
                `;

                

                })
                $('#teamDetails').before(outputNews);
            })
    }



    // NBA stuff

    function getNBAData() {
        var requestUrlNba = "https://api.sportsdata.io/v3/nba/scores/json/AllTeams?key=ae840c1a34fe4e84bd31aefb540743c6";

        fetch(requestUrlNba)
            .then(function (response) {
                return response.json();
            })
            .then(function (nbaData) {
                nbaMain = nbaData;
                //console.log(nbaMain);
                genMain();
            })
    }

    // no news by team api endpoint for NBA...FML
    // const getDataNba = async (key) => {
    //     const responseNba = await fetch("https://api.sportsdata.io/v3/nba/scores/json/NewsByTeam/" + key + "?key=ae840c1a34fe4e84bd31aefb540743c6")
    //     const dataNba = await responseNba.json()
    //     nbaTeamNews = dataNba
    //     console.log(data)
    //     //genCards(key);
    // }

    function genCardsNba(key) {
        for (var i = 0; i < myTeam.length; i++) {
            for (var j = 0; j < nbaMain.length; j++) {
                if (myTeam[i].teamKey === nbaMain[j].Key && myTeam[i].teamKey === key) {

                    teamLogo = nbaMain[j].WikipediaLogoUrl;
                    teamConference = nbaMain[j].Conference;
                    teamDiv = nbaMain[j].Division;
                    team = nbaMain[j].Name;
                    teamCoach = "NA" //nbaMain[j].HeadCoach;
                    teamOpp = "NA" //nbaMain[j].UpcomingOpponent;
                    teamOppRank = "NA" //nbaMain[j].UpcomingOpponentRank;
                    //console.log(team);

                    var outputTeamCards = `<div class="row border plate flex">
                                            <div class="col s1 m1 l1">
                                                <img src="${teamLogo}" class="team-Box-Icon">
                                            </div>
                                            
                                            <div class="col s8 m8 l8">
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
                                                    <p>Not Available</p>
                                                </div>
                                            </div>
                                    </div>
                    `;
                    $('#teamDetails').append(outputTeamCards);
                }
            }
        }
    }




});



