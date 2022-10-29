const fs = require('fs');

let saveButton = document.createElement("button");
saveButton.innerText = "Save game";
saveButton.id = "saveButton";
saveButton.addEventListener("click", () => {
    if(JSON.stringify(gameData) != "" || JSON.stringify(gameData) != undefined){
        fs.writeFileSync('saves/data.json', JSON.stringify(gameData, null, 4), function(err) {
            if(err){
                return console.log(err);
            }
        });
        gameData = JSON.stringify(gameData);
        sessionStorage.removeItem("gameData");
        sessionStorage.setItem("gameData", gameData);
        gameData = JSON.parse(gameData);
        console.log("done")
        window.location.reload(false);
    }
});
document.body.appendChild(saveButton);
