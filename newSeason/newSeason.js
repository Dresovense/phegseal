const { match } = require('assert');
const fs = require('fs');
const dice = require("../season/dice.js");
const standings = require("../functions/standings.js")

let gameData = JSON.parse(sessionStorage.getItem("gameData"));

let startDate = gameData.seasons[gameData.seasons.length - 1].endDate;
let endDate = parseInt(gameData.seasons[gameData.seasons.length - 1].endDate) + 1;
let seasonTitle = document.createElement("h3");
seasonTitle.innerText = startDate + "-" + endDate + " season configuration";
document.body.appendChild(seasonTitle);

//choose type of schedule: - rounds; - conferences? post-season
let numberRounds = 0;
let postSeasonRounds = 0;

let divConferencesNumber = document.createElement("div");
divConferencesNumber.className = "scheduleChoice";
divConferencesNumber.innerText = "Number of conferences:";
document.body.appendChild(divConferencesNumber);
let conferencesNumber = document.createElement("input");
conferencesNumber.type = "number";
conferencesNumber.min = "0";
conferencesNumber.className = "scheduleChoice";
document.body.appendChild(conferencesNumber);

let divDivisionsPerConferenceNumber = document.createElement("div");
divDivisionsPerConferenceNumber.className = "scheduleChoice";
divDivisionsPerConferenceNumber.innerText = "Number of divisions per conference:";
document.body.appendChild(divDivisionsPerConferenceNumber);
let divisionsPerConferenceNumber = document.createElement("input");
divisionsPerConferenceNumber.type = "number";
divisionsPerConferenceNumber.min = "0";
divisionsPerConferenceNumber.className = "scheduleChoice";
document.body.appendChild(divisionsPerConferenceNumber);

let divDivisionMatches = document.createElement("div");
divDivisionMatches.className = "scheduleChoice";
divDivisionMatches.innerText = "Division rounds:";
document.body.appendChild(divDivisionMatches);
let divisionMatches = document.createElement("input");
divisionMatches.type = "number";
divisionMatches.min = "0";
divisionMatches.className = "scheduleChoice";
document.body.appendChild(divisionMatches);

let divConferenceMatches = document.createElement("div");
divConferenceMatches.className = "scheduleChoice";
divConferenceMatches.innerText = "Conference rounds:";
document.body.appendChild(divConferenceMatches);
let conferenceMatches = document.createElement("input");
conferenceMatches.type = "number";
conferenceMatches.min = "0";
conferenceMatches.className = "scheduleChoice";
document.body.appendChild(conferenceMatches);

let divInterConferenceMatches = document.createElement("div");
divInterConferenceMatches.className = "scheduleChoice";
divInterConferenceMatches.innerText = "Inter-Conference rounds:";
document.body.appendChild(divInterConferenceMatches);
let interConferenceMatches = document.createElement("input");
interConferenceMatches.type = "number";
interConferenceMatches.min = "0";
interConferenceMatches.className = "scheduleChoice";
document.body.appendChild(interConferenceMatches);

let divPostSeasonTeamsChoice = document.createElement("div");
divPostSeasonTeamsChoice.className = "scheduleChoice";
divPostSeasonTeamsChoice.innerText = "Number of teams in Post-Season:";    //changed to number of teams in post-season
document.body.appendChild(divPostSeasonTeamsChoice);
let postSeasonTeamsChoice = document.createElement("input");
postSeasonTeamsChoice.type = "number";
postSeasonTeamsChoice.min = "0";
postSeasonTeamsChoice.className = "scheduleChoice";
document.body.appendChild(postSeasonTeamsChoice);

let divTeamsQualifiedPerDivision = document.createElement("div");
divTeamsQualifiedPerDivision.className = "scheduleChoice";
divTeamsQualifiedPerDivision.innerText = "Number of teams qualified in each division:";
document.body.appendChild(divTeamsQualifiedPerDivision);
let teamsQualifiedPerDivision = document.createElement("input");
teamsQualifiedPerDivision.type = "number";
teamsQualifiedPerDivision.min = "0";
teamsQualifiedPerDivision.className = "scheduleChoice";
document.body.appendChild(teamsQualifiedPerDivision);

let divWildCardsPerConference = document.createElement("div");
divWildCardsPerConference.className = "scheduleChoice";
divWildCardsPerConference.innerText = "Number of wild cards qualified in each conference:";
document.body.appendChild(divWildCardsPerConference);
let wildCardsPerConference = document.createElement("input");
wildCardsPerConference.type = "number";
wildCardsPerConference.min = "0";
wildCardsPerConference.className = "scheduleChoice";
document.body.appendChild(wildCardsPerConference);

let divNumberOfPlayoffMatches = document.createElement("div");
divNumberOfPlayoffMatches.className = "scheduleChoice";
divNumberOfPlayoffMatches.innerText = "Number of matches during the playoffs";
document.body.appendChild(divNumberOfPlayoffMatches);
let numberOfPlayoffMatches = document.createElement("input");
numberOfPlayoffMatches.type = "number";
numberOfPlayoffMatches.min = "3";
numberOfPlayoffMatches.className = "scheduleChoice";
document.body.appendChild(numberOfPlayoffMatches);

let divDraftLottery = document.createElement("div");
divDraftLottery.className = "scheduleChoice";
divDraftLottery.innerText = "Draft Lottery:";
document.body.appendChild(divDraftLottery);
let selectDraftLottery = document.createElement("select");
selectDraftLottery.className = "scheduleChoice";
document.body.appendChild(selectDraftLottery);
let draftLotteryYes = document.createElement("option");
draftLotteryYes.innerText = "Yes";
draftLotteryYes.value = true;
draftLotteryYes.className = "scheduleChoice";
selectDraftLottery.appendChild(draftLotteryYes);
let draftLotteryNo = document.createElement("option");
draftLotteryNo.innerText = "No";
draftLotteryNo.value = false;
draftLotteryNo.className = "scheduleChoice";
selectDraftLottery.appendChild(draftLotteryNo);

let divLotterySpots = document.createElement("div");
divLotterySpots.className = "scheduleChoice";
divLotterySpots.innerText = "Number of spots determined by the lottery:";
document.body.appendChild(divLotterySpots);
let lotterySpots = document.createElement("input");
lotterySpots.type = "number";
lotterySpots.min = "0";
lotterySpots.className = "scheduleChoice";
document.body.appendChild(lotterySpots);

let divplayOffOrganisation = document.createElement("div");
divplayOffOrganisation.className = "scheduleChoice";
divplayOffOrganisation.innerText = "Playoff Seeding:";
document.body.appendChild(divplayOffOrganisation);
let select = document.createElement("select");
select.className = "scheduleChoice";
document.body.appendChild(select);
let divisionalPlayoff = document.createElement("option");
divisionalPlayoff.innerText = "Divisional Playoff";
divisionalPlayoff.value = "divisionalPlayoff";
divisionalPlayoff.className = "scheduleChoice";
select.appendChild(divisionalPlayoff);
let conferencePlayoff = document.createElement("option");
conferencePlayoff.innerText = "Conference Playoff";
conferencePlayoff.value = "conferencePlayoff";
conferencePlayoff.className = "scheduleChoice";
select.appendChild(conferencePlayoff);


let roundsChoiceButton = document.createElement("button");
roundsChoiceButton.className = "scheduleChoice";
roundsChoiceButton.innerText = "Confirm settings";
roundsChoiceButton.addEventListener("click", () => {
    if(conferencesNumber.value <= 0 || postSeasonTeamsChoice.value <= 0 || divisionsPerConferenceNumber.value <= 0 || divisionMatches.value < 0 || conferenceMatches < 0 || interConferenceMatches < 0){
        window.alert("Invalid number(s)");
    }
    else{
        let divsTeam = document.getElementsByClassName("teamChoice");
        conferenceColorJump = 300 / (conferencesNumber.value - 1);
        divisionColorJump = 50 / (divisionsPerConferenceNumber.value - 1);
        for(let i = 0; i < divsTeam.length; i++){
            teamList = [[]]
            divsTeam[i].style.display = "block";
            for(let i = 0; i < gameData.teams.length; i++){
                teamList[0].push(i);
            }
            for(let i = 0; i < conferencesNumber.value; i++){
                let conference = [];
                for(let j = 0; j < divisionsPerConferenceNumber.value; j++){
                    let division = [];
                    conference.push(division);
                }
                teamList.push(conference);
            }
            
        }
        //create divisions divs
        for(let k = 0; k < conferencesNumber.value; k++){
            let conferenceContainer = document.createElement("div");
            document.body.appendChild(conferenceContainer);
            let conferenceDiv = document.createElement("div");
            conferenceDiv.classList = "teamChoice";
            conferenceDiv.style.width = "120px";
            conferenceDiv.innerText = `Conference ${k + 1}`;
            conferenceDiv.style.backgroundColor = `hsl(${conferenceColorJump * (k)}, 100%, 50%)`;
            conferenceContainer.appendChild(conferenceDiv);
            let conferenceName = document.createElement("input");
            conferenceName.classList = "teamChoice conference";
            conferenceContainer.appendChild(conferenceName);

            for(let j = 0; j < divisionsPerConferenceNumber.value; j++){
                if(divisionsPerConferenceNumber.value > 1){
                    let divisionDiv = document.createElement("div");
                    divisionDiv.classList = "teamChoice";
                    divisionDiv.style.backgroundColor = `hsl(${conferenceColorJump * (k)}, 100%, ${30 + divisionColorJump * (j)}%)`;
                    divisionDiv.innerText = `Division ${j + 1}`;
                    divisionDiv.style.width = "100px";
                    conferenceContainer.appendChild(divisionDiv);
                    let divisionName = document.createElement ("input");
                    divisionName.classList = "teamChoice division";
                    divisionDiv.appendChild(divisionName);
                }
            }
        }
        let divsSchedule = document.getElementsByClassName("scheduleChoice");
        for(let i = 0; i < divsSchedule.length; i++){
            divsSchedule[i].style.display = "none";
        }
    }
});
document.body.appendChild(roundsChoiceButton);

//chose teams

//team List per division and conference
let teamList = [[],[[]]];
let conferenceColorJump;
let divisionColorJump;

let divTeams = document.createElement("div");
document.body.appendChild(divTeams);
divTeams.className = "teamChoice";
divTeams.style.width = "150px";
divTeams.style.display = "none";
for(let i = 0; i < gameData.teams.length; i++){
    let team = document.createElement("div");
    team.innerText = gameData.teams[i].name;
    if(teamList[0].includes(i)){
        team.style.backgroundColor = "white";
    }
    for(let k = 1; k < teamList.length; k++){
        for(let j = 0; j < teamList[1].length; j++){
            if(teamList[k][j].includes(i)){
                team.style.backgroundColor = `hsl(${conferenceColorJump * (k - 1)}, 100%, ${30 + divisionColorJump * (j - 1)}%)`;
            }
        }
    }
    team.addEventListener("click", () => {
        if(teamList[0].includes(i)){
            const index = teamList[0].indexOf(i);
            if(index > -1){
                teamList[0].splice(index, 1);
            }
            teamList[1][0].push(i);
            team.style.backgroundColor = `hsl(0, 100%, 30%)`;
        }
        else{
            for(let k = 1; k < teamList.length; k++){
                for(let j = 0; j < teamList[1].length; j++){
                    if(teamList[k][j].includes(i)){
                        const index = teamList[k][j].indexOf(i);
                        if(index > -1){
                            teamList[k][j].splice(index, 1);
                        }
                        if(j == teamList[1].length - 1 && k == teamList.length - 1){
                            teamList[0].push(i);
                            team.style.backgroundColor = `white`;
                        }
                        else if (j == teamList[1].length - 1){
                            teamList[k + 1][0].push(i);
                            team.style.backgroundColor = `hsl(${conferenceColorJump * (k)}, 100%, 30%)`;
                        }
                        else{
                            teamList[k][j + 1].push(i);
                            team.style.backgroundColor = `hsl(${conferenceColorJump * (k - 1)}, 100%, ${30 + divisionColorJump * (j + 1)}%)`;
                        }
                        k = teamList.length;
                        j = teamList[1].length;
                    }
                }
            }
        }
    });
    divTeams.appendChild(team);
}

let confirmChoicebutton = document.createElement("button");     //display
confirmChoicebutton.style.display = "none";
confirmChoicebutton.innerText = "Confirm Choice";
confirmChoicebutton.className = "teamChoice";
confirmChoicebutton.addEventListener("click", () => {

        numberOfConferences = conferencesNumber.value;
        numberOfDivisionsPerConference = divisionsPerConferenceNumber.value;
        divisionRounds = divisionMatches.value;
        conferenceRounds = conferenceMatches.value;
        interConferenceRounds = interConferenceMatches.value;
        let divsSchedule = document.getElementsByClassName("scheduleChoice");
        for(let i = 0; i < divsSchedule.length; i++){
            divsSchedule[i].style.display = "none";     //display
        }
        createSchedule(teamList, numberOfConferences, numberOfDivisionsPerConference, divisionRounds, conferenceRounds, interConferenceRounds);   //changer endroit ou c'est fait
        newSeason.postSeasonSchedule.rules.numberOfMatchesPerTeam = numberOfGamesPerTeam(newSeason);
        gameData.seasons.push(newSeason);
        gameData.seasons[gameData.seasons.length - 1].predictions.push(regularSeasonPrediction(gameData, 0));
        gameData = updateTradeWillingness(gameData);
        //save data + go to season
        fs.writeFile('saves/data.json', JSON.stringify(gameData, null, 4), function(err) {
            if(err){
                return console.log(err);
            }
        });
        console.log(gameData)
        gameData = JSON.stringify(gameData);
        sessionStorage.setItem("gameData", gameData);
        location.href = "../startGame/startGame.html";
    
});
document.body.appendChild(confirmChoicebutton);

let goBackButton = document.createElement("button");
goBackButton.style.display = "none";     //display
goBackButton.className = "teamChoice";
goBackButton.innerText = "Go Back";     //changer fonctionnement go Back
goBackButton.addEventListener("click", () =>{
    let divsSchedule = document.getElementsByClassName("scheduleChoice");
    let divsTeam = document.getElementsByClassName("teamChoice");
    for(let i = 0; i < divsSchedule.length; i++){
        divsSchedule[i].style.display = "block";     //display
    }
    for(let i = 0; i < divsTeam.length; i++){
        divsTeam[i].style.display = "none";     //display
    }
});
document.body.appendChild(goBackButton);



//print schedule
let newSeason = {
    "date": startDate + "-" + endDate,
    "endDate": endDate,
    "teams": {
        "conference": [],
        "allTeams": []
    },
    "schedule": [],
    "postSeasonSchedule": {
        "rules": {
            "postSeasonTeams": "",
            "teamsQualifiedPerDivision": "",
            "wildCardsPerConference": "",
            "playOffOrganisation": "",
            "numberOfMatchesPerTeam": "",
            "draftLottery": "",
            "draftLotteryNumberOfSpots": ""
        },
        "conference": [],
        "finals": [],
        "seeds": [],
        "teamsInPlayoffs": []
    },
    "records": {
        "regularSeason": {
            "points": {
                "mostPoints": {
                    "name": `Most points in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessPoints": {
                    "name": `Less points in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                }
            },
            "victories": {
                "mostVictories": {
                    "name": `Most victories in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessVictories": {
                    "name": `Less victories in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostVictoriesHome": {
                    "name": `Most victories home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessVictoriesHome": {
                    "name": `Less victories home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostVictoriesAway": {
                    "name": `Most victories away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessVictoriesAway": {
                    "name": `Less victories away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostConsecutiveVictories": {
                    "name": `Most consecutive victories in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "-1",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "-1",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "-1",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "-1",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "-1",
                            "record": "-1",
                            "endRound": "0"
                        }
                    ]
                },
                "consecutiveNoWinMatches": {
                    "name": `Most consecutive matches without winning in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        }
                    ]
                },
                "mostConsecutiveVictoriesHome": {
                    "name": `Most consecutive victories home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        }
                    ]
                },
                "mostConsecutiveVictoriesAway": {
                    "name": `Most consecutive victories away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        }
                    ]
                }
            },
            "defeats": {
                "mostDefeats": {
                    "name": `Most defeats in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessDefeats": {
                    "name": `Less defeats in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostDefeatsHome": {
                    "name": `Most defeats home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessDefeatsHome": {
                    "name": `Less defeats home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostDefeatsAway": {
                    "name": `Most defeats away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessDefeatsAway": {
                    "name": `Less defeats away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostConsecutiveDefeats": {
                    "name": `Most consecutive defeats in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        }
                    ]
                },
                "consecutiveNoLossMatches": {
                    "name": `Most consecutive matches without losing in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        }
                    ]
                },
                "mostConsecutiveDefeatsHome": {
                    "name": `Most consecutive defeats home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        }
                    ]
                },
                "mostConsecutiveDefeatsAway": {
                    "name": `Most consecutive defeats away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        }
                    ]
                }
            },
            "ties": {
                "mostTies": {
                    "name": `Most ties in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessTies": {
                    "name": `Less ties in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostTiesHome": {
                    "name": `Most ties home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessTiesHome": {
                    "name": `Less ties home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostTiesAway": {
                    "name": `Most ties away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessTiesAway": {
                    "name": `Less ties away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostConsecutiveTies": {
                    "name": `Most consecutive ties in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        }
                    ]
                },
                "mostConsecutiveTiesHome": {
                    "name": `Most consecutive ties home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        }
                    ]
                },
                "mostConsecutiveTiesAway": {
                    "name": `Most consecutive ties away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "-1",
                            "endRound": "0"
                        }
                    ]
                }
            },
            "goals": {
                "mostGoalsScored": {
                    "name": `Most goals scored in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessGoalsScored": {
                    "name": `Less goals scored in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostGoalsScoredHome": {
                    "name": `Most goals scored home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostGoalsScoredAway": {
                    "name": `Most goals scored away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessGoalsScoredHome": {
                    "name": `Less goals scored home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessGoalsScoredAway": {
                    "name": `Less goals scored away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostGoalsAgainst": {
                    "name": `Most goals against in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessGoalsAgainst": {
                    "name": `Less goals against in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostGoalsAgainstHome": {
                    "name": `Most goals against home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostGoalsAgainstAway": {
                    "name": `Most goals against away in${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessGoalsAgainstHome": {
                    "name": `Less goals against home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "207"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessGoalsAgainstAway": {
                    "name": `Less goals against away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "bestGoalDifference": {
                    "name": `Best goal difference in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "worstGoalDifference": {
                    "name": `Worst goal difference in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "bestGoalDifferenceHome": {
                    "name": `Best goal difference home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "bestGoalDifferenceAway": {
                    "name": `Best goal difference away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "2",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "worstGoalDifferenceHome": {
                    "name": `Worst goal difference home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "worstGoalDifferenceAway": {
                    "name": `Worst goal difference away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostShutouts": {
                    "name": `Most shutouts in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessShutouts": {
                    "name": `Less shutouts in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostShutoutsHome": {
                    "name": `Most shutouts home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "mostShutoutsAway": {
                    "name": `Most shutouts away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessShutoutsHome": {
                    "name": `Less shutouts home in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                },
                "lessShutoutsAway": {
                    "name": `Less shutouts away in ${startDate + "-" + endDate} season`,
                    "teams": [
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        },
                        {
                            "teamId": "0",
                            "record": "0"
                        }
                    ]
                }
            }
        },
        "postSeason": {
            "victories": {
                "mostPlayoffVictories": {
                    "name": `Most victories in the ${startDate + "-" + endDate} play-offs`,
                    "teams": [
                    ]
                },
                "mostPlayoffVictoriesHome": {
                    "name": `Most victories home in the ${startDate + "-" + endDate} play-offs`,
                    "teams": [
                    ]
                },
                "mostPlayoffVictoriesAway": {
                    "name": `Most victories away in the ${startDate + "-" + endDate} play-offs`,
                    "teams": [
                    ]
                },
                "mostAddTimeVictories": {
                    "name": `Most victories in add time in the ${startDate + "-" + endDate} play-offs`,
                    "teams": [
                    ]
                },
                "mostAddTimeVictoriesHome": {
                    "name": `Most victories home in add time in the ${startDate + "-" + endDate} play-offs`,
                    "teams": [
                    ]
                },
                "mostAddTimeVictoriesAway": {
                    "name": `Most victories away in add time in the ${startDate + "-" + endDate} play-offs`,
                    "teams": [
                    ]
                }
            },
            "goals": {
                "mostGoalsScoredInPlayoffs": {
                    "name": `Most goals scored in the ${startDate + "-" + endDate} play-offs`,
                    "teams": [
                    ]
                },
                "mostGoalsScoredHomeInPlayoffs": {
                    "name": `Most goals scored at home in the ${startDate + "-" + endDate} play-offs`,
                    "teams": [
                    ]
                },
                "mostGoalsScoredAwayInPlayoffs": {
                    "name": `Most goals scored away in the ${startDate + "-" + endDate} play-offs`,
                    "teams": [
                    ]
                },
                "mostShutoutsInPlayoffs": {
                    "name": `Most shutouts in the ${startDate + "-" + endDate} play-offs`,
                    "teams": [
                    ]
                },
                "mostShutoutsHomeInPlayoffs": {
                    "name": `Most shutouts at home in the ${startDate + "-" + endDate} play-offs`,
                    "teams": []
                },
                "mostShutoutsAwayInPlayoffs": {
                    "name": `Most shutouts away in the ${startDate + "-" + endDate} play-offs`,
                    "teams": []
                }
            }
        }
    },
    "draft": {
        "completed": "no",
        "picks": [],
        "currentRound": 0,
        "currentPick": 0,
        "draftClass": [],
        "draftLottery": []
    },
    "predictions":[],
    trade:[]
};

function createSchedule(teamList, numberOfConferences, numberOfDivisionsPerConference, divisionRounds, conferenceRounds, interConferenceRounds){
    allTeams = [];
    for(let i = 1; i < teamList.length; i++){
        for(let j = 0; j < teamList[1].length; j++){
            for(let k = 0; k < teamList[i][j].length; k++){
                allTeams.push(teamList[i][j][k]);
            }
        }
    }
    conferenceTeams = [];
    for(let i = 1; i < teamList.length; i++){
        let conference = [];
        for(let j = 0; j < teamList[1].length; j++){
            for(let k = 0; k < teamList[i][j].length; k++){
                conference.push(teamList[i][j][k]);
            }
        }
        conferenceTeams.push(conference);
    }
    divisionTeams = [];
    for(let i = 1; i < teamList.length; i++){
        let conference = [];
        for(let j = 0; j < teamList[1].length; j++){
            let division = []
            for(let k = 0; k < teamList[i][j].length; k++){
                division.push(teamList[i][j][k]);
            }
            conference.push(division);
        }
        divisionTeams.push(conference);
    }
    
    let interConferenceSchedule = roundRobin(allTeams, interConferenceRounds);
    for(let i = 0; i < interConferenceSchedule.length; i++){
        newSeason.schedule.push(interConferenceSchedule[i]);
    }

    interConferenceSchedule = roundRobin(conferenceTeams[0], conferenceRounds - interConferenceRounds);
    for(let i = 1; i < numberOfConferences; i++){
        let conferenceSchedule = roundRobin(conferenceTeams[i], conferenceRounds - interConferenceRounds);
        for(let j = 0; j < conferenceSchedule.length; j++){
            for(let l = 0; l < conferenceSchedule[j].games.length; l++){
                interConferenceSchedule[j].games.push(conferenceSchedule[j].games[l]);
                
            }
        }
    }
    for(let i = 0; i < interConferenceSchedule.length; i++){
        newSeason.schedule.push(interConferenceSchedule[i]);
    }

    interConferenceSchedule = roundRobin(divisionTeams[0][0], divisionRounds - interConferenceRounds - (conferenceRounds - interConferenceRounds))
    for(let i = 0; i < numberOfConferences; i++){
        for(let k = 0; k < numberOfDivisionsPerConference; k++){
            if(i!=0 || k!=0){
                let divisionSchedule = roundRobin(divisionTeams[i][k], divisionRounds - interConferenceRounds - (conferenceRounds - interConferenceRounds));
                for(let j = 0; j < divisionSchedule.length; j++){
                    for(let l = 0; l < divisionSchedule[j].games.length; l++){
                        interConferenceSchedule[j].games.push(divisionSchedule[j].games[l]);
                        
                    }
                }
            }
        }
    }
    for(let i = 0; i < interConferenceSchedule.length; i++){
        newSeason.schedule.push(interConferenceSchedule[i]);
    }
    console.log(newSeason);

    newSeason.schedule = shuffleArray(newSeason.schedule);

    newSeason.postSeasonSchedule.rules.draftLottery = selectDraftLottery.value;
    newSeason.postSeasonSchedule.rules.draftLotteryNumberOfSpots = lotterySpots.value;

    //post-season       A CHANGER¨!!!!!!!

    newSeason.postSeasonSchedule.rules.postSeasonTeams = postSeasonTeamsChoice.value;
    newSeason.postSeasonSchedule.rules.teamsQualifiedPerDivision = teamsQualifiedPerDivision.value;
    newSeason.postSeasonSchedule.rules.wildCardsPerConference = wildCardsPerConference.value;
    newSeason.postSeasonSchedule.rules.playOffOrganisation = select.value;
    newSeason.postSeasonSchedule.rules.numberOfPlayoffMatches = numberOfPlayoffMatches.value;

    let teamsInPlayOffPerConference = postSeasonTeamsChoice.value / conferencesNumber.value;
    let postSeasonConferenceRounds = Math.log2(teamsInPlayOffPerConference);
    for(let l = 0; l < conferencesNumber.value; l++){
        let postSeasonConferenceSchedule = [];
        for(let i = 0; i < postSeasonConferenceRounds; i++){
            let matchups = {
                "matchups": [],
                "completed": "no",
            };
            for(let j = 0; j < Math.pow(2, postSeasonConferenceRounds - 1 - i); j++){
                let games = {
                    "games": [],
                    "winner": "",
                    "loser": "",
                    "completed": "no"
                }
                for(let k = 0; k < numberOfPlayoffMatches.value; k++){
                    let matches = {
                        "team1Id": "",
                        "team2Id": "",
                        "team1Goals": "",
                        "team2Goals": "",
                        "team1GoalsAddTime": "",
                        "team2GoalsAddTime": ""
                    }
                    games.games.push(matches);
                }
                matchups.matchups.push(games);
            }
            postSeasonConferenceSchedule.push(matchups);
            if(conferencesNumber.value == 1){
                i = postSeasonConferenceRounds;
            }
        }
        newSeason.postSeasonSchedule.conference.push(postSeasonConferenceSchedule);
    }
        //mettre matchs finales
    if(conferencesNumber.value == 1){
        let matchups = {
            "matchups": [{
                "games": [{
                    "team1Id": "",
                    "team2Id": "",
                    "team1Goals": "",
                    "team2Goals": "",
                    "team1GoalsAddTime": "",
                    "team2GoalsAddTime": ""
                },{
                    "team1Id": "",
                    "team2Id": "",
                    "team1Goals": "",
                    "team2Goals": "",
                    "team1GoalsAddTime": "",
                    "team2GoalsAddTime": ""
                },{
                    "team1Id": "",
                    "team2Id": "",
                    "team1Goals": "",
                    "team2Goals": "",
                    "team1GoalsAddTime": "",
                    "team2GoalsAddTime": ""
                }],
                "winner": "",
                "loser": "",
                "completed": "no"
            }],
            "completed": "no",
        };
        newSeason.postSeasonSchedule.finals.push(matchups);
    }
    else{
        let finalsSchedule = [];
        for(let i = 0; i < conferencesNumber.value/2; i++){
            let matchups = {
                "matchups": [],
                "completed": "no",
            };
            for(let j = 0; j < Math.pow(2, (conferencesNumber.value/2) - 1 - i); j++){
                let games = {
                    "games": [],
                    "winner": "",
                    "loser": "",
                    "completed": "no"
                }
                for(let k = 0; k < numberOfPlayoffMatches.value; k++){
                    let matches = {
                        "team1Id": "",
                        "team2Id": "",
                        "team1Goals": "",
                        "team2Goals": "",
                        "team1GoalsAddTime": "",
                        "team2GoalsAddTime": ""
                    }
                    games.games.push(matches);
                }
                matchups.matchups.push(games);
            }
            finalsSchedule.push(matchups);
        }
        newSeason.postSeasonSchedule.finals = finalsSchedule;
    }


    //teams
    let conferencesName = document.getElementsByClassName("conference");
    let divisionName = document.getElementsByClassName("division");
    for(let i = 1; i < teamList.length; i++){
        if(conferencesName[i-1].value == undefined){
            conferencesName[i-1].value = "";
        }
        let conference = {
            "name": `${conferencesName[i-1].value}`,
            "divisions":[],
            "teamsInConference": []
        }
        for(let j = 0; j < teamList[1].length; j++){
            let division = {
                "name": ``,
                "teams":[]
            }
            if (divisionName.length != 0){
                if(divisionName[j].value != undefined){
                    division.name = divisionName[j + (teamList.length - 1) * (i - 1)].value
                }
            }
            for(let k = 0; k < teamList[i][j].length; k++){
                if(teamList[i][j][k] != -1){
                    let team = {
                        "id": `${teamList[i][j][k]}`,
                        "power": gameData.teams[teamList[i][j][k]].power
                    }
                    division.teams.push(team);
                    conference.teamsInConference.push(team);
                    newSeason.teams.allTeams.push(team);
                }
            }
            conference.divisions.push(division);
        }
        newSeason.teams.conference.push(conference);
    }
    //draftClass
    newSeason.draft.draftClass = createDraftClass(allTeams.length);
}

function roundRobin (teamList, numberRounds){
    //make schedule + JSON object
    let firstPartOfRound = [];
    let schedule = [];
    for(let i = 0; i < numberRounds; i++){
        if(i % 2 == 0){
            firstPartOfRound = createFirstPartOfRound(shuffleArray(teamList));
        }
        else{
            firstPartOfRound = swapHomeAway(firstPartOfRound);
        }
        for(let j = 0; j < firstPartOfRound.length; j++){
            schedule.push(firstPartOfRound[j]);
        }
    }
    return schedule;
}

function createFirstPartOfRound(teamList){
    if(teamList.length % 2 == 0){ //if number of teams is odd we add a dummy team
        let firstPartOfRound = []; //schedule
        for(let i = 0; i < teamList.length - 1; i++){
            let fixtures = {    //schedule objects
                "games": [],
                "completed": "no"
            }
            for(let j = 0; j < teamList.length / 2; j++){
                if(i % 2 == 0){ //change Home-Away every match
                    let match = {
                        "team1Id": `${teamList[j]}`,
                        "team2Id": `${teamList[teamList.length - 1 - j]}`,
                        "team1Goals": "",
                        "team2Goals": ""
                    }
                    fixtures.games.push(match);
                }
                else{
                    let match = {
                        "team1Id": `${teamList[teamList.length - 1 - j]}`,
                        "team2Id": `${teamList[j]}`,
                        "team1Goals": "",
                        "team2Goals": ""
                    }    
                    fixtures.games.push(match);
                }
                fixtures.games = shuffleArray(fixtures.games);
            }
            firstPartOfRound.push(fixtures);
            //team rotation
            let pivot = teamList[teamList.length - 1];  
            for(let j = 0; j < teamList.length - 1; j++){
                teamList[teamList.length - 1 - j] = teamList [teamList.length - j - 2];
            }
            teamList[1] = pivot;
        }
        return firstPartOfRound;
    } 
    else{
        let teamListOdd = []; // meme array et pas array avec memes éléments
        for(let a = 0; a < teamList.length; a++){
            teamListOdd.push(teamList[a]);
        }
        teamListOdd.push(-1);
        let firstPartOfRound = []; //schedule
        for(let i = 0; i < teamListOdd.length - 1; i++){
            let fixtures = {    //schedule objects
                "games": [],
                "completed": "no"
            }
            for(let j = 0; j < teamListOdd.length / 2; j++){
                if(i % 2 == 0){ //change Home-Away every match
                    if(teamListOdd[teamListOdd.length - 1 - j] != -1 && teamListOdd[j] != -1){
                        let match = {
                            "team1Id": `${teamListOdd[j]}`,
                            "team2Id": `${teamListOdd[teamListOdd.length - 1 - j]}`,
                            "team1Goals": "",
                            "team2Goals": ""
                        }
                        fixtures.games.push(match);
                    }
                }
                else{
                    if(teamListOdd[teamListOdd.length - 1 - j] != -1 && teamListOdd[j] != -1){
                        let match = {
                            "team1Id": `${teamListOdd[teamListOdd.length - 1 - j]}`,
                            "team2Id": `${teamListOdd[j]}`,
                            "team1Goals": "",
                            "team2Goals": ""
                        }    
                        fixtures.games.push(match);
                    }
                }
            }
            firstPartOfRound.push(fixtures);
            //team rotation
            console.log(teamListOdd);
            let pivot = teamListOdd[teamListOdd.length - 1];  
            for(let j = 0; j < teamListOdd.length - 1; j++){
                teamListOdd[teamListOdd.length - 1 - j] = teamListOdd[teamListOdd.length - j - 2];

            }
            teamListOdd[1] = pivot;
            console.log(teamListOdd)
        }
        
        return firstPartOfRound;
    }
}

function swapHomeAway(firstPartOfRound){
    let secondPartOfRound = [];
    for(let i = 0; i < firstPartOfRound.length; i++){
        let fixtures = {
            "games": [],
            "completed": "no"
        };
        for(let j = 0; j < firstPartOfRound[i].games.length; j++){
            let match = {
                "team1Id": `${firstPartOfRound[i].games[j].team2Id}`,
                "team2Id": `${firstPartOfRound[i].games[j].team1Id}`,
                "team1Goals": "",
                "team2Goals": ""
            }    
            fixtures.games.push(match);
        }
        secondPartOfRound.push(fixtures);
    }
    return secondPartOfRound;
}

function shuffleArray(array) {
    let curId = array.length;
    // There remain elements to shuffle
    while (0 !== curId) {
      // Pick a remaining element
      let randId = Math.floor(Math.random() * curId);
      curId -= 1;
      // Swap it with the current element.
      let tmp = array[curId];
      array[curId] = array[randId];
      array[randId] = tmp;
    }
    return array;
}

function numberOfGamesPerTeam(newSeason){
    let teamId = newSeason.schedule[0].games[0].team1Id;
    let numberOfMatches = 0
    for(let i = 0; i < newSeason.schedule.length; i++){
        for(let j = 0; j < newSeason.schedule[i].games.length; j++){
            if(newSeason.schedule[i].games[j].team1Id == teamId || newSeason.schedule[i].games[j].team2Id == teamId){
                numberOfMatches++;
            }
        }
    }
    console.log(numberOfMatches)
    return numberOfMatches
}

function regularSeasonPrediction(gameData, round){
    let predictions = {
        "win": [],
        "lose": [],
        "standings": [],
        "playoffs": [],
        "round": round
    }

    let team_predictions_win = []
    let team_predictions_lose = []
    let team_predictions_playoffs = []
    let team_predictions_standings = []
    for(let i = 0; i < gameData.seasons[gameData.seasons.length - 1].teams.allTeams.length; i++){
        team_predictions_win.push(0);
        team_predictions_lose.push(0);
        team_predictions_playoffs.push(0);
        team_predictions_standings.push(0);
    }
    for(let i = 0; i < 500; i++){
        let gameDataTest = JSON.parse(JSON.stringify(gameData));
        for(let j = round; j < gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule.length; j++){
            for(k = 0; k < gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule[j].games.length; k++){
                result = dice.diceRoll(gameData.teams[gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule[j].games[k].team1Id].power,gameData.teams[gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule[j].games[k].team2Id].power)
                gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule[j].games[k].team1Goals = result[0];
                gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule[j].games[k].team2Goals = result[1];
            }
        }
        let teamChoice = gameDataTest.seasons[gameDataTest.seasons.length - 1].teams.allTeams;
        let teams = standings.standings(gameDataTest, teamChoice, gameDataTest.seasons.length - 1, gameDataTest.seasons[gameDataTest.seasons.length - 1].schedule.length - 1, "Pts");
        let conferences = []
        for(let j = 0; j < gameDataTest.seasons[gameDataTest.seasons.length - 1].teams.conference.length; j++){
            conferences.push(0);
        }
        for(let j = 0; j < teams.length; j++){
            team_predictions_standings[teams[j].id] += teams.length - j;
            for(k = 0; k < conferences.length; k++){
                if(conferences[k] < gameDataTest.seasons[gameDataTest.seasons.length - 1].postSeasonSchedule.rules.teamsQualifiedPerDivision){
                    for(let l = 0; l < gameDataTest.seasons[gameDataTest.seasons.length - 1].teams.conference[k].teamsInConference.length; l++){
                        if(teams[j].id == gameDataTest.seasons[gameDataTest.seasons.length - 1].teams.conference[k].teamsInConference[l].id){
                            conferences[k] += 1
                            team_predictions_playoffs[teams[j].id] += 1;
                        }
                    }
                }
            }
        }
        team_predictions_win[teams[0].id] += 1;
        team_predictions_lose[teams[teams.length - 1].id] += 1;
    }
    predictions.win = team_predictions_win;
    predictions.lose = team_predictions_lose;
    predictions.playoffs = team_predictions_playoffs;
    predictions.standings = team_predictions_standings;
    return predictions
}

function updateTradeWillingness(gameData){
    for(let i = 0; i < gameData.teams.length; i++){
        if(gameData.teams[i].power < 0.8){
            gameData.teams[i].trade = 35;
        }
        else if(gameData.teams[i].power < 1){
            gameData.teams[i].trade = 45;
        }
        else if (gameData.teams[i].power < 1.10){
            gameData.teams[i].trade = 50;
        }
        else if(gameData.teams[i].power < 1.25){
            gameData.teams[i].trade = 55;
        }
        else{
            gameData.teams[i].trade = 65;
        }
    }
    return gameData;
}

function createDraftClass(teams){
    let firstName = JSON.parse(fs.readFileSync('nameDb/firstName.json', "utf-8", function (err,data) {
        if (err) {
          return console.log(err);
        }
      }));
      let lastName = JSON.parse(fs.readFileSync('nameDb/lastName.json', "utf-8", function (err,data) {
          if (err) {
            return console.log(err);
          }
      }));

    let draftClass = [];

    //joueurs disponibles dans la draft class
    for(let i = 0; i < 10000; i++){
        let potential = Math.ceil(Math.pow(randn_bm(), 2.60) * 140);
        let developpmentYears = Math.floor(randn_bm() * 8);
        if(potential < 30){
            potential = 30;
        }
        let randomName = firstName.data[Math.floor(Math.random() * firstName.data.length)] + " " + lastName.data[Math.floor(Math.random() * lastName.data.length)];
        draftClass.push({
            potential: potential,
            developpmentYears: developpmentYears,
            name: randomName
        });
    }

    draftClass.sort(function(left,right){
        if(left.potential > right.potential){
            return -1;
        }
        else if(left.potential < right.potential){
            return 1;
        }
        else{
            if(left.developpmentYears > right.developpmentYears){
                return 1;
            }
            else{
                return -1;
            }
        }
    })

    for(let i = 0; i < 30; i++){
        let random_player = draftClass.splice(Math.floor(Math.random() * 150), 1);
        let random_place = Math.floor(Math.random() * 150);
        draftClass.splice(random_place, 0, random_player[0]);
    }

    for(let i = 0; i < 200; i++){
        let random_player = draftClass.splice(Math.floor(Math.random() * 250) + 30, 1);
        let random_place = Math.floor(Math.random() * 250) + 30;
        draftClass.splice(random_place, 0, random_player[0]);
    }

    for(let i = 0; i < 200; i++){
        let random_player = draftClass.splice(Math.floor(Math.random() * 10000) + 50, 1);
        let random_place = Math.floor(Math.random() * 10000) + 50;
        draftClass.splice(random_place, 0, random_player[0]);
    }

    draftClass.length = teams * 7;

    return draftClass;
}


//distribution de gauss
function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
    return num
}