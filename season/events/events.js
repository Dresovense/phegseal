const standings = require("../../functions/standings.js");

module.exports = {
    events: function(eventContainer, eventBackground, eventNameText, eventDescriptionText, eventEffectsText){
        eventContainer.innerHTML = "";
        eventContainer.style.display = "flex"
        eventBackground.style.opacity = "0.5";
        eventBackground.style.display = "block";

        //event name
        let eventName = document.createElement("div");
        eventName.className = "eventContainee"
        eventName.innerText = eventNameText;
        eventContainer.appendChild(eventName)
        
        //event description
        let eventDescription = document.createElement("div");
        eventDescription.className = "eventContainee"
        eventDescription.innerText = eventDescriptionText;
        eventContainer.appendChild(eventDescription)

        //event effects
        let eventEffects = document.createElement("div");
        eventEffects.className = "eventContainee"
        eventEffects.innerText = eventEffectsText;
        eventContainer.appendChild(eventEffects) 
    },
    chooseEvent: function(eventContainer, eventBackground, gameData, round){
        const NUMBEROFEVENTS = 1
        let random = Math.floor(Math.random() * NUMBEROFEVENTS);
        
        switch(random){
            case 0: this.trade()
                break;
        }
    },
    trade: function(eventContainer, eventBackground, gameData, round){
        let season = gameData.seasons.length - 1;
        let currentStandings = standings.standings(gameData, gameData.seasons[season].teams.allTeams, season, round, "Pts");
        let numberOfTeamsInPlayoffs = gameData.seasons[season].postSeasonSchedule.rules.postSeasonTeams;
        let numberOfTeams = gameData.seasons[season].teams.allTeams.length;
        
        
        //choose seller:
        let sellersAvailable = [];
        for(let i = numberOfTeams - 1; i >= numberOfTeamsInPlayoffs + Math.ceil(numberOfTeamsInPlayoffs / 4); i--){
            sellersAvailable.push(currentStandings[i].id);
        }
        let randomSeller = Math.floor(Math.random() * sellersAvailable.length);

        //choose buyer:
        let buyersAvailable = [];
        for(let i = 0; i < numberOfTeamsInPlayoffs + Math.ceil(numberOfTeamsInPlayoffs / 4); i++){
            buyersAvailable.push(currentStandings[i].id);
        }
        let randomBuyer = Math.floor(Math.random() * buyersAvailable.length);



        //tradeEffects:
        let amountOfPowerChanged = Math.random() * 0.09 + 0.02; //min = 0.02, max = 0.11
        gameData.teams[randomBuyer].power += amountOfPowerChanged;
        gameData.seasons[season].teams.allTeams.forEach(() => {
            if(this.id == randomBuyer){
                this.power += amountOfPowerChanged;
            }
            if(this.id == randomSeller){
                this.power -= amountOfPowerChanged;
            }
        })
        gameData.teams[randomSeller].power -= amountOfPowerChanged;


        //picks transfered:
        pickValues = []


    }
}

