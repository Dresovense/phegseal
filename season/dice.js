module.exports = {
    dice: function dice() {
        let die = document.createElement("div");
        die.className = "die";
        document.body.appendChild(die);

        let die1 = document.createElement("div");
        die1.innerText = "1";
        die1.className = "dice"
        die.appendChild(die1);      
        
        let die2 = document.createElement("div");
        die2.innerText = "1";
        die2.className = "dice"
        die.appendChild(die2); 

        die.addEventListener("click", () => {
            let die1Result = Math.random();
            let die2Result = Math.random();
            if(die1Result < 0.2265){
                die1.innerText = "0";
            }
            else if(die1Result >= 0.2265 && die1Result < 0.5515){
                die1.innerText = "1";
            }
            else if(die1Result >= 0.5515 && die1Result < 0.7942){
                die1.innerText = "2";
            }
            else if(die1Result >= 0.7942 && die1Result < 0.9204){
                die1.innerText = "3";
            }
            else if(die1Result >= 0.9204 && die1Result < 0.9731){
                die1.innerText = "4";
            }
            else if(die1Result >= 0.9731 && die1Result < 0.9918){
                die1.innerText = "5";
            }
            else if(die1Result >= 0.9918 && die1Result < 0.9979){
                die1.innerText = "6";
            }
            else if(die1Result >= 0.9979 && die1Result < 0.9999){
                die1.innerText = "7";
            }
            else if(die1Result >= 0.9999){
                die1.innerText = "8";
            }

            if(die2Result < 0.3359){
                die2.innerText = "0";
            }
            else if(die2Result >= 0.3359 && die2Result < 0.6835){
                die2.innerText = "1";
            }
            else if(die2Result >= 0.6835 && die2Result < 0.879){
                die2.innerText = "2";
            }
            else if(die2Result >= 0.879 && die2Result < 0.9604){
                die2.innerText = "3";
            }
            else if(die2Result >= 0.9604 && die2Result < 0.9891){
                die2.innerText = "4";
            }
            else if(die2Result >= 0.9891 && die2Result < 0.9971){
                die2.innerText = "5";
            }
            else if(die2Result >= 0.9971 && die2Result < 0.9994){
                die2.innerText = "6";
            }
            else if(die2Result >= 0.9994 && die2Result < 0.9998){
                die2.innerText = "7";
            }
            else if(die2Result >= 0.9998){
                die2.innerText = "8";
            }
        });

    }
}