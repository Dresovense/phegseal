module.exports = {
    pastWinners: function(gameData, pastWinnersArray, node){
        let pastWinnersUI = document.createElement("div");
        pastWinnersUI.className = "pastSeasonWinnerUI";
        for(let i = pastWinnersArray.length; i >= 0; i--){
            if(i == pastWinnersArray.length){
                let UIRow = document.createElement("div");
                UIRow.className = "gridRowWinners";
                UIRow.id = "row" + i;
                UIRow.style.backgroundColor = "white"
                node.appendChild(UIRow);
                //season
                let season = document.createElement("div");
                season.className = "gridSquareWinners";
                season.innerText = "Season";
                UIRow.appendChild(season);
                //winner
                let winner = document.createElement("div");
                winner.className = "gridSquareWinners";
                winner.innerText = "Winner";
                UIRow.appendChild(winner);
                //loser
                let loser = document.createElement("div");
                loser.className = "gridSquareWinners";
                loser.innerText = "Loser";
                UIRow.appendChild(loser);
            }
            else{
                let UIRow = document.createElement("div");
                UIRow.className = "gridRowWinners";
                UIRow.id = "row" + i;
                pastWinnersUI.appendChild(UIRow);
                if(i % 2 == 0){
                    UIRow.style.backgroundColor = "lightgray";
                }
                //season
                let season = document.createElement("div");
                season.className = "gridSquareWinners";
                season.innerText = gameData.seasons[i].date;
                UIRow.appendChild(season);
                //winner
                let winner = document.createElement("div");
                winner.className = "gridSquareWinners";
                winner.innerText = gameData.teams[pastWinnersArray[i][0]].name;
                winner.style.fontWeight = "bold"
                UIRow.appendChild(winner);
                winner.addEventListener("click", () => { //go to team page
                    locationFunctions.teamPage(pastWinnersArray[i][0])
                });
                //logo
                let logo = document.createElement("img");
                logo.className = "logo";
                logo.id = "logo";
                logo.src = ".." + gameData.teams[pastWinnersArray[i][0]].logo + ".png";
                winner.appendChild(logo); 
                //loser
                let loser = document.createElement("div");
                loser.className = "gridSquareWinners";
                loser.innerText = gameData.teams[pastWinnersArray[i][1]].name;
                loser.style.fontStyle = "italic"
                UIRow.appendChild(loser);
                loser.addEventListener("click", () => { //go to team page
                    locationFunctions.teamPage(pastWinnersArray[i][1])
                });
                //logo
                let logoLoser = document.createElement("img");
                logoLoser.className = "logo";
                logoLoser.id = "logo";
                logoLoser.src = ".." + gameData.teams[pastWinnersArray[i][1]].logo + ".png";
                loser.appendChild(logoLoser); 
            }
        }
        node.appendChild(pastWinnersUI);
    },

    makeRecordUI: function(gameData, recordData, boolEndRound, node){
        let recordContainer = document.createElement("div");
        recordContainer.style.marginRight = "20px";
        node.appendChild(recordContainer)
        let nameRecord = document.createElement("div");
        nameRecord.innerText = recordData.name;
        nameRecord.style.width = "250px";
        nameRecord.style.textAlign = "center"
        recordContainer.appendChild(nameRecord)

        let recordUI = document.createElement("div");
        recordUI.className = "recordUISeason";
        for(let i = -1; i < recordData.teams.length; i++){
            if(i == -1){
                let UIRow = document.createElement("div");
                UIRow.className = "gridRowRecordsSeason";
                UIRow.id = "row" + i;
                UIRow.style.backgroundColor = "white"
                recordContainer.appendChild(UIRow);
                //team
                let team = document.createElement("div");
                team.className = "gridSquareRecords";
                team.innerText = "Team";
                UIRow.appendChild(team);
                //record
                let record = document.createElement("div");
                record.className = "gridSquareRecords";
                record.innerText = "Record";
                UIRow.appendChild(record);
            }
            else{
                let UIRow = document.createElement("div");
                UIRow.className = "gridRowRecordsSeason";
                UIRow.id = "row" + i;
                recordUI.appendChild(UIRow);
                if(i % 2 == 0){
                    UIRow.style.backgroundColor = "lightgray";
                }
                //team
                let team = document.createElement("div");
                team.className = "gridSquareRecords";
                team.innerText = gameData.teams[recordData.teams[i].teamId].name;
                UIRow.appendChild(team);
                team.addEventListener("click", () => { //go to team page
                    let gameDataJson = JSON.stringify(gameData);
                    sessionStorage.setItem("gameData", gameDataJson);
                    sessionStorage.setItem("team", recordData.teams[i].teamId);
                    location.href = "../team/team.html";
                });
                //logo
                let logo = document.createElement("img");
                logo.className = "logo";
                logo.id = "logo";
                logo.src = ".." + gameData.teams[recordData.teams[i].teamId].logo + ".png";
                team.appendChild(logo); 
                //record
                let record = document.createElement("div");
                record.className = "gridSquareRecords";
                record.innerText = recordData.teams[i].record;
                UIRow.appendChild(record);
            }
        }
        recordContainer.appendChild(recordUI);
    },

    makeRecordUIAllTime: function(gameData, recordData, boolEndRound, node){
        let recordContainer = document.createElement("div");
        recordContainer.style.marginRight = "20px";
        console.log(node)
        node.appendChild(recordContainer)
        let nameRecord = document.createElement("div");
        nameRecord.innerText = recordData.name;
        nameRecord.style.width = "250px";
        nameRecord.style.textAlign = "center"
        recordContainer.appendChild(nameRecord)

        let recordUI = document.createElement("div");
        recordUI.className = "recordUI";
        for(let i = -1; i < recordData.teams.length; i++){
            if(i == -1){
                let UIRow = document.createElement("div");
                UIRow.className = "gridRowRecords";
                UIRow.id = "row" + i;
                UIRow.style.backgroundColor = "white"
                recordContainer.appendChild(UIRow);
                //team
                let team = document.createElement("div");
                team.className = "gridSquareRecords";
                team.innerText = "Team";
                UIRow.appendChild(team);
                //record
                let record = document.createElement("div");
                record.className = "gridSquareRecords";
                record.innerText = "Record";
                UIRow.appendChild(record);
                //season
                let season = document.createElement("div");
                season.className = "gridSquareRecords";
                season.innerText = "Season";
                UIRow.appendChild(season);
            }
            else{
                let UIRow = document.createElement("div");
                UIRow.className = "gridRowRecords";
                UIRow.id = "row" + i;
                recordUI.appendChild(UIRow);
                if(i % 2 == 0){
                    UIRow.style.backgroundColor = "lightgray";
                }
                //team
                let team = document.createElement("div");
                team.className = "gridSquareRecords";
                team.innerText = gameData.teams[recordData.teams[i].teamId].name;
                UIRow.appendChild(team);
                team.addEventListener("click", () => { //go to team page
                    let gameDataJson = JSON.stringify(gameData);
                    sessionStorage.setItem("gameData", gameDataJson);
                    sessionStorage.setItem("team", recordData.teams[i].teamId);
                    location.href = "../team/team.html";
                });
                //logo
                let logo = document.createElement("img");
                logo.className = "logo";
                logo.id = "logo";
                logo.src = ".." + gameData.teams[recordData.teams[i].teamId].logo + ".png";
                team.appendChild(logo); 
                //record
                let record = document.createElement("div");
                record.className = "gridSquareRecords";
                record.innerText = recordData.teams[i].record;
                UIRow.appendChild(record);
                //season
                let season = document.createElement("div");
                season.className = "gridSquareRecords";
                season.innerText = gameData.seasons[recordData.teams[i].seasonId].date;
                UIRow.appendChild(season);
                if(recordData.teams[i].seasonId == gameData.seasons.length - 2){
                    season.style.fontWeight = "bold";
                }
            }
        }
        recordContainer.appendChild(recordUI);
    },

    titleDraught: function(gameData, titleDraughtArray, node){
        let titleDraughtUI = document.createElement("div");
        titleDraughtUI.className = "pastSeasonWinnerUI";
        for(let i = pastWinnersArray.length; i >= 0; i--){
            if(i == pastWinnersArray.length){
                let UIRow = document.createElement("div");
                UIRow.className = "gridRowWinners";
                UIRow.id = "row" + i;
                UIRow.style.backgroundColor = "white"
                node.appendChild(UIRow);
                //season
                let season = document.createElement("div");
                season.className = "gridSquareWinners";
                season.innerText = "Season";
                UIRow.appendChild(season);
                //winner
                let winner = document.createElement("div");
                winner.className = "gridSquareWinners";
                winner.innerText = "Winner";
                UIRow.appendChild(winner);
                //loser
                let loser = document.createElement("div");
                loser.className = "gridSquareWinners";
                loser.innerText = "Loser";
                UIRow.appendChild(loser);
            }
            else{
                let UIRow = document.createElement("div");
                UIRow.className = "gridRowWinners";
                UIRow.id = "row" + i;
                pastWinnersUI.appendChild(UIRow);
                if(i % 2 == 0){
                    UIRow.style.backgroundColor = "lightgray";
                }
                //season
                let season = document.createElement("div");
                season.className = "gridSquareWinners";
                season.innerText = gameData.seasons[i].date;
                UIRow.appendChild(season);
                //winner
                let winner = document.createElement("div");
                winner.className = "gridSquareWinners";
                winner.innerText = gameData.teams[pastWinnersArray[i][0]].name;
                winner.style.fontWeight = "bold"
                UIRow.appendChild(winner);
                winner.addEventListener("click", () => { //go to team page
                    locationFunctions.teamPage(pastWinnersArray[i][0])
                });
                //logo
                let logo = document.createElement("img");
                logo.className = "logo";
                logo.id = "logo";
                logo.src = ".." + gameData.teams[pastWinnersArray[i][0]].logo + ".png";
                winner.appendChild(logo); 
                //loser
                let loser = document.createElement("div");
                loser.className = "gridSquareWinners";
                loser.innerText = gameData.teams[pastWinnersArray[i][1]].name;
                loser.style.fontStyle = "italic"
                UIRow.appendChild(loser);
                loser.addEventListener("click", () => { //go to team page
                    locationFunctions.teamPage(pastWinnersArray[i][1])
                });
                //logo
                let logoLoser = document.createElement("img");
                logoLoser.className = "logo";
                logoLoser.id = "logo";
                logoLoser.src = ".." + gameData.teams[pastWinnersArray[i][1]].logo + ".png";
                loser.appendChild(logoLoser); 
            }
        }
        node.appendChild(pastWinnersUI);
    }
}