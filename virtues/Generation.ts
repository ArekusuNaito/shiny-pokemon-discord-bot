import * as crypto from 'crypto';

function GetRandom16BitNumber()
{
    //Generate random 1 number from a range of [0,65535]. A total of 65536 numbers: 2^16
    return crypto.randomFillSync(new Uint16Array(1))[0];
}

export function DidProbabilityHappen(probability:string):boolean
{
    //Given a probability x, return if happened.
    
    const dropchance = parseFloat(eval(probability));
    const roll = GetRandom16BitNumber();
    const maxNumber = Math.pow(2,16)
    const resultRange = maxNumber*dropchance;
    console.log('Results',probability,dropchance,`Rolled: ${roll}`,resultRange,maxNumber);
    return roll<resultRange;
}