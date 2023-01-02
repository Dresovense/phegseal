const standings = require("../../functions/standings.js");

module.exports = {
    events: function(eventContainer, eventBackground, eventNameText, eventDescriptionText, eventEffectsText){
        eventContainer.innerHTML = "";
        eventContainer.style.display = "flex"
        eventBackground.style.opacity = "0.5";
        eventBackground.style.display = "block";

        //event name
        let eventName = document.createElement("h2");
        eventName.className = "event_eventName";
        eventName.innerText = eventNameText;
        eventContainer.appendChild(eventName)
        
        //event description
        let eventDescription = document.createElement("div");
        eventDescription.className = "event_eventContainee"
        eventDescription.innerText = eventDescriptionText;
        eventContainer.appendChild(eventDescription)

        //event effects
        let eventEffects = document.createElement("div");
        eventEffects.className = "event_eventContainee"
        eventEffects.innerText = eventEffectsText;
        eventContainer.appendChild(eventEffects) 
    },
    trade: function(eventContainer, eventBackground, gameData, round){
        let season = gameData.seasons.length - 1;
        let numberOfTeams = gameData.seasons[season].teams.allTeams.length;
        
        this.tradeUpdate(gameData, season, round, numberOfTeams)
        
        //select buyers and sellers:
        let buyers = [];
        let sellers = [];
        for(let i = 0; i < numberOfTeams; i++){
            if(gameData.teams[i].trade >= 90){
                buyers.push(i)
            }
            else if(gameData.teams[i].trade <= 10){
                sellers.push(i)
            }
        }
        console.log(buyers)
        console.log(sellers)

        
        //check if trade and if so select teams
        let randomBuyer;
        let randomSeller;
        if(buyers.length > 0 && sellers.length > 0){
            let chanceOfTrade = Math.floor(Math.random() * numberOfTeams * 1.5);
            if(chanceOfTrade == 0){
                randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
                randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
            }
            else{
                return
            }
        }
        else{
            return
        }
        
        //trade value:
        let tradeValue = [70,35,20,10,7,5,3]

        //assets of buying team:
        let assets = [];
            for(let j = 0; j < numberOfTeams; j++){
                for(let k = 0; k < gameData.teams[j].ownerOfTeamPicks.length; k++){
                    for(let l = 0; l < gameData.teams[j].ownerOfTeamPicks[k].length; l++){
                        if(gameData.teams[j].ownerOfTeamPicks[k][l] == randomBuyer){
                            assets.push({
                                pick: l,
                                year: k,
                                fromTeam: j,
                                value: tradeValue[l]
                            })
                        }
                    }
                }
            }

        let totalAmountOfTradeValue = 0;
        for(let i = 0; i < assets.length; i++){
            totalAmountOfTradeValue += assets[i].value;
        }


        //select how much power will be echanged (based on random, how much trade value buyer team still has, ...)
        let powerToBeEchanged = randn_bm() * (totalAmountOfTradeValue * 0.0004 - 0.065) //min = 0.02, max = 0.15, depends on total trade value
        let valueOfPowerChanged = powerToBeEchanged * 1100 - 20;
        
        console.log(powerToBeEchanged)
        console.log(valueOfPowerChanged)

        //select which picks will be echanged
        let picksToTrade = [];
        let amountOfPicksValue = 0;
        let goodTrade = false;
        while(goodTrade == false){
            while(amountOfPicksValue < valueOfPowerChanged)
            {
                let randomPick = Math.floor(Math.random() * assets.length);
                console.log(randomPick)
                if(picksToTrade.indexOf(randomPick) < 0){
                    picksToTrade.push(randomPick);
                    amountOfPicksValue += assets[randomPick].value;
                }
            }

            if(amountOfPicksValue < valueOfPowerChanged + 40){
                goodTrade = true;
            }
            else{
                picksToTrade = [];
                amountOfPicksValue = 0;
            }
            
        }
        console.log(picksToTrade)
        console.log(assets)

        //reduce willingness to trade:
        gameData.teams[randomBuyer].trade = 55;
        gameData.teams[randomSeller].trade = 45;


        //tradeEffects: (change picks owner, change power, print event)
            //change picks owners:
            for(let i = 0; i < picksToTrade.length; i++){
                let pick = assets[picksToTrade[i]].pick;
                let year = assets[picksToTrade[i]].year;
                let fromTeam = assets[picksToTrade[i]].fromTeam;
                gameData.teams[fromTeam].ownerOfTeamPicks[year][pick] = randomSeller;
            }
            //change power:
            gameData.teams[randomBuyer].power += powerToBeEchanged;
            gameData.teams[randomSeller].power -= powerToBeEchanged;
            for(let i = 0; i < gameData.seasons[season].teams.allTeams.length; i++){
                if(gameData.seasons[season].teams.allTeams[i].id == randomBuyer){
                    gameData.seasons[season].teams.allTeams[i].power += powerToBeEchanged;
                }
                if(gameData.seasons[season].teams.allTeams[i].id == randomSeller){
                    gameData.seasons[season].teams.allTeams[i].power -= powerToBeEchanged;
                }
            }
            //print event:
            let eventDescription = `A trade has occurred between ${gameData.teams[randomBuyer].name} and ${gameData.teams[randomSeller].name}.`;
            let eventEffects = `${gameData.teams[randomSeller].name} receives:\n`
            for(let i = 0; i < picksToTrade.length; i++){
                if(assets[picksToTrade[i]].pick + 1 == 1){
                    eventEffects += `- ${gameData.teams[assets[picksToTrade[i]].fromTeam].name}' ${assets[picksToTrade[i]].year + gameData.seasons[season].endDate} ${assets[picksToTrade[i]].pick + 1}st round pick\n`
                }
                else if(assets[picksToTrade[i]].pick + 1 == 2){
                    eventEffects += `- ${gameData.teams[assets[picksToTrade[i]].fromTeam].name}' ${assets[picksToTrade[i]].year + gameData.seasons[season].endDate} ${assets[picksToTrade[i]].pick + 1}nd round pick\n`
                }
                else if(assets[picksToTrade[i]].pick + 1 == 3){
                    eventEffects += `- ${gameData.teams[assets[picksToTrade[i]].fromTeam].name}' ${assets[picksToTrade[i]].year + gameData.seasons[season].endDate} ${assets[picksToTrade[i]].pick + 1}rd round pick\n`
                }
                else{
                    eventEffects += `- ${gameData.teams[assets[picksToTrade[i]].fromTeam].name}' ${assets[picksToTrade[i]].year + gameData.seasons[season].endDate} ${assets[picksToTrade[i]].pick + 1}th round pick\n`
                }
            }
            eventEffects += `\n${gameData.teams[randomBuyer].name} receives: ${powerToBeEchanged.toFixed(3)} power in players` //place holder
            this.events(eventContainer, eventBackground, "Trade!", eventDescription, eventEffects);  
            //add to trade data
            let tradeData = {
                buyer: randomBuyer,
                seller: randomSeller,
                picks: picksToTrade,
                assetsOfBuyer: assets,
                round: round,
                power: powerToBeEchanged
            }
            gameData.seasons[season].trade.push(tradeData);
    },
    tradeUpdate: function(gameData, season, round, numberOfTeams){
        let buyers = standings.playoffBound(gameData, season, round)
        //change trade parameter:
        for(let i = 0; i < numberOfTeams; i++){
            if(buyers.indexOf(`${i}`) >= 0){ //buyers
                let tradeModifier = gameData.teams[i].power;
                //expectation:
                if(gameData.teams[i].power < 0.8){
                    tradeModifier -= 0.1
                }
                else if(gameData.teams[i].power < 1){
                    tradeModifier += 0.1
                }
                else if (gameData.teams[i].power < 1.10){
                    tradeModifier += 0.2
                }
                else if(gameData.teams[i].power < 1.25){
                    tradeModifier += 0.7
                }
                else{
                    tradeModifier += 0.4
                }
                //time above 1 (if more time, more likely to trade)
                tradeModifier += gameData.teams[i].seasonsAbove1 / 10
                gameData.teams[i].trade += tradeModifier / gameData.seasons[season].schedule[round].games.length;
            }
            else{   //sellers
                let tradeModifier = 2 - gameData.teams[i].power;
                //expectation:
                if(gameData.teams[i].power < 0.8){
                    tradeModifier += 0.7
                }
                else if(gameData.teams[i].power < 1){
                    tradeModifier += 0.5
                }
                else if (gameData.teams[i].power < 1.10){
                    tradeModifier += 0.2
                }
                else if(gameData.teams[i].power < 1.25){
                    tradeModifier -= 0.1
                }
                else{
                    tradeModifier -= 0.5
                }
                //time bellow 1 (if less time, more likely to trade) (speed up rebuild)
                if(gameData.teams[i].power < 0.9){
                    tradeModifier += (5 - gameData.teams[i].seasonsBelow1) / 5;
                }
                gameData.teams[i].trade -= tradeModifier / gameData.seasons[season].schedule[round].games.length;
            }
        }
    }
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