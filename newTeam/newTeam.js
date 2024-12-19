let gameData = JSON.parse(sessionStorage.getItem("gameData"));
const fs = require('fs');


let teamNameDiv = document.createElement("div");
teamNameDiv.innerText = "Name :";
document.body.appendChild(teamNameDiv);
let teamName = document.createElement("input");
document.body.appendChild(teamName);

let shortNameDiv = document.createElement("div");
shortNameDiv.innerText = "Short Name :";
document.body.appendChild(shortNameDiv);
let shortName = document.createElement("input");
document.body.appendChild(shortName);

/* let teamLogoDiv = document.createElement("div");
teamLogoDiv.innerText = "Logo (past directory) :";
document.body.appendChild(teamLogoDiv);
let teamLogo = document.createElement("input");
document.body.appendChild(teamLogo); */

let teamColorDiv = document.createElement("div");
teamColorDiv.innerText = "Color :";
document.body.appendChild(teamColorDiv);
let teamColor = document.createElement("input");
teamColor.type = "color";
document.body.appendChild(teamColor);

let teamTownDiv = document.createElement("div");
teamTownDiv.innerText = "Town :";
document.body.appendChild(teamTownDiv);
let teamTown = document.createElement("input");
document.body.appendChild(teamTown);

let teamStadiumDiv = document.createElement("div");
teamStadiumDiv.innerText = "Stadium name :";
document.body.appendChild(teamStadiumDiv);
let teamStadium = document.createElement("input");
document.body.appendChild(teamStadium);

let teamStadiumAttendanceDiv = document.createElement("div");
teamStadiumAttendanceDiv.innerText = "Stadium attendance :";
document.body.appendChild(teamStadiumAttendanceDiv);
let teamStadiumAttendance = document.createElement("input");
document.body.appendChild(teamStadiumAttendance);

let confirmChoicebutton = document.createElement("button");
confirmChoicebutton.innerText = "Confirm Choice";
confirmChoicebutton.className = "teamChoice";
let teamId = gameData.teams.length;
confirmChoicebutton.addEventListener("click", () => {
    let teamObject = {
        name: teamName.value,
        shortName: shortName.value,
        logo: `/graphics/logos/${teamId}`,
        color: teamColor.value,
        date: gameData.seasons.length,
        town: teamTown.value,
        stadiumName: teamStadium.value,
        stadiumAttendence: teamStadiumAttendance.value,
        rivalries:[
            {
                teamId: "",
                rivalType: "",
                rivalryStrength: ""
            }
        ],
        teamPlacement: {
            left: "50px",
            top: "50px"
        },
        records:{

        },
        power: Math.random() * 0.5 + 0.5,
        tradePower: 0,
        seasonsAbove1: "0",
        seasonsBelow1: "0",
        projectedPowerNextSeasons: [
            0,
            0,
            0,
            0,
            0,
            0
        ],
        trade: "50",
        ownerOfTeamPicks: [
            [teamId, teamId, teamId, teamId, teamId, teamId, teamId],
            [teamId, teamId, teamId, teamId, teamId, teamId, teamId],
            [teamId, teamId, teamId, teamId, teamId, teamId, teamId]
        ]
    }
    gameData.teams.push(teamObject);
    fs.writeFile('saves/data.json', JSON.stringify(gameData, null, 4), function(err) {
        if(err){
            return console.log(err);
        }
    });
    sessionStorage.setItem("gameData", JSON.stringify(gameData));
    location.href = "../teamChoice/teamChoice.html";
});
document.body.appendChild(confirmChoicebutton);