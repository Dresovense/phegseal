let gameData = JSON.parse(sessionStorage.getItem("gameData"));
const fs = require('fs');


let teamNameDiv = document.createElement("div");
teamNameDiv.innerText = "Name :";
document.body.appendChild(teamNameDiv);
let teamName = document.createElement("input");
document.body.appendChild(teamName);

let teamLogoDiv = document.createElement("div");
teamLogoDiv.innerText = "Logo (past directory) :";
document.body.appendChild(teamLogoDiv);
let teamLogo = document.createElement("input");
document.body.appendChild(teamLogo);

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
let endDate = gameData.seasons[gameData.seasons.length - 1].endDate + 1;
confirmChoicebutton.addEventListener("click", () => {
    let teamObject = {
        name: teamName.value,
        logo: teamLogo.value,
        color: teamColor.value,
        date: gameData.seasons[gameData.seasons.length - 1].endDate + "-" + endDate,
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
        records:{

        }
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