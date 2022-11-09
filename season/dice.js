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
            randomColor1 = "#" + (Math.floor(Math.random()*16777215).toString(16));
            randomColor2 = "#" + (Math.floor(Math.random()*16777215).toString(16));
            die1.style.border = "solid 2px" + randomColor1
            die2.style.border = "solid 2px" + randomColor2
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

    },
    diceRoll: function diceTest(powerTeam1, powerTeam2) {
        let die1Result = Math.random();
        let die2Result = Math.random();
        let result = [0,0];
        if(die1Result < Math.pow(0.2265,powerTeam1)){
            result[0] = "0";
        }
        else if(die1Result >= Math.pow(0.2265,powerTeam1) && die1Result < Math.pow(0.5515,powerTeam1)){
            result[0] = "1";
        }
        else if(die1Result >= Math.pow(0.5515,powerTeam1) && die1Result < Math.pow(0.7942,powerTeam1)){
            result[0] = "2";
        }
        else if(die1Result >= Math.pow(0.7942,powerTeam1) && die1Result < Math.pow(0.9204,powerTeam1)){
            result[0] = "3";
        }
        else if(die1Result >= Math.pow(0.9204,powerTeam1) && die1Result < Math.pow(0.9731,powerTeam1)){
            result[0] = "4";
        }
        else if(die1Result >= Math.pow(0.9732,powerTeam1) && die1Result < Math.pow(0.9918,powerTeam1)){
            result[0] = "5";
        }
        else if(die1Result >= Math.pow(0.9918,powerTeam1) && die1Result < Math.pow(0.9979,powerTeam1)){
            result[0] = "6";
        }
        else if(die1Result >= Math.pow(0.9979,powerTeam1) && die1Result < Math.pow(0.9999,powerTeam1)){
            result[0] = "7";
        }
        else if(die1Result >= Math.pow(0.9999,powerTeam1)){
            result[0] = "8";
        }

        if(die2Result < Math.pow(0.3359,powerTeam2)){
            result[1] = "0";
        }
        else if(die2Result >= Math.pow(0.3359,powerTeam2) && die2Result < Math.pow(0.6835,powerTeam2)){
            result[1] = "1";
        }
        else if(die2Result >= Math.pow(0.6835,powerTeam2) && die2Result < Math.pow(0.879,powerTeam2)){
            result[1] = "2";
        }
        else if(die2Result >= Math.pow(0.879,powerTeam2) && die2Result < Math.pow(0.9604,powerTeam2)){
            result[1] = "3";
        }
        else if(die2Result >= Math.pow(0.9604,powerTeam2) && die2Result < Math.pow(0.9891,powerTeam2)){
            result[1] = "4";
        }
        else if(die2Result >= Math.pow(0.9891,powerTeam2) && die2Result < Math.pow(0.9971,powerTeam2)){
            result[1] = "5";
        }
        else if(die2Result >= Math.pow(0.9971,powerTeam2) && die2Result < Math.pow(0.9994,powerTeam2)){
            result[1] = "6";
        }
        else if(die2Result >= Math.pow(0.9994,powerTeam2) && die2Result < Math.pow(0.9998,powerTeam2)){
            result[1] = "7";
        }
        else if(die2Result >= Math.pow(0.9998,powerTeam2)){
            result[1] = "8";
        }
        console.log(result)
        return result;
    }
}