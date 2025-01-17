import { Competition as WCIF } from "@wca/helpers";
import { encryptText } from "./encrypt";

export const encryptScrambles = async (wcif: WCIF, passwords: ScramblePassword[]) => {
    let newWcif = wcif;
    for (const event of newWcif.events) {
        for (const round of event.rounds) {
            if (!round.scrambleSets) {
                continue;
            }
            for (const set of round.scrambleSets) {
                let i = 1;
                const password = passwords.find(password => {
                    return password.eventId === event.id &&
                        password.roundId === round.id &&
                        password.setId === i
                });
                if (password) {
                    const newScrambles = [];
                    const newExtraScrambles = [];
                    for (const scramble of set.scrambles) {
                        newScrambles.push(await encryptText(scramble, password.password));
                    }
                    for (const scramble of set.extraScrambles) {
                        newExtraScrambles.push(await encryptText(scramble, password.password));
                    }
                    set.scrambles = newScrambles;
                    set.extraScrambles = newExtraScrambles;
                }
                i++;
            }
        }
    }
    return newWcif; 
};

