let draftClass = [];

for(let i = 0; i < 1000; i++){
    let potential = Math.ceil((randn_bm() + 0.1) * 100);
    let developpmentYears = Math.floor(Math.random() * 6);
    let randomName = "Test";
    if(potential < 100){
        draftClass.push({
            potential: potential,
            developpmentYears: developpmentYears,
            name: randomName
        });
    }
}
console.log(draftClass)

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

for(let i = 0; i < 50; i++){
    console.log(draftClass[i])
}

function randn_bm() {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm() // resample between 0 and 1
    return num
}