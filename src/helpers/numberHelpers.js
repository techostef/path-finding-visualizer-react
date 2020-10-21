export function calculateRatio (numMin, numMax){
    for(let num = numMax; num > 1; num--) {
        if((numMin % num) === 0 && (numMax % num) === 0) {
            numMin = numMin/num;
            numMax = numMax/num;
        }
    }
    return [numMin, numMax];
}