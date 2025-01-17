import { Competition as WCIF } from "@wca/helpers";
import { encryptText } from "./encrypt";
import { ScramblePassword, UnofficialEvent } from "./interfaces";
import { randomScrambleForEvent } from "cubing/scramble";
import { getRandomInt } from "./utils";
import { eventsData, isUnofficialEvent } from "./events";

export const encryptScrambles = async (
  wcif: WCIF,
  passwords: ScramblePassword[]
) => {
  let newWcif = wcif;
  for (const event of newWcif.events) {
    for (const round of event.rounds) {
      if (!round.scrambleSets) {
        continue;
      }
      for (const set of round.scrambleSets) {
        let i = 1;
        const password = passwords.find((password) => {
          return (
            password.eventId === event.id &&
            password.roundId === round.id &&
            password.setId === (isUnofficialEvent(event.id) ? set.id : i)
          );
        });
        if (password) {
          const newScrambles = [];
          const newExtraScrambles = [];
          for (const scramble of set.scrambles) {
            newScrambles.push(await encryptText(scramble, password.password));
          }
          for (const scramble of set.extraScrambles) {
            newExtraScrambles.push(
              await encryptText(scramble, password.password)
            );
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

export const generateScramblesForUnofficialEvents = async (
  events: UnofficialEvent[]
) => {
  const newData: UnofficialEvent[] = [];
  for (const eventData of events) {
    const newEventData: UnofficialEvent = {
      id: eventData.id,
      rounds: [],
    };
    const eventInfo = eventsData.find((e) => e.id === eventData.id);
    for (const round of eventData.rounds) {
      const newRoundData = {
        ...round,
      };
      const scramblesCount = round.format === "a" ? 5 : 3;
      for (let i = 0; i < round.scrambleSetCount; i++) {
        const scrambles = [];
        const extraScrambles = [];
        const scramblingId = eventInfo?.scramblingId ? eventInfo.scramblingId : eventData.id;
        for (let i = 0; i < scramblesCount; i++) {
          const scramble = await randomScrambleForEvent(scramblingId);
          const scrambleStr = scramble.toString();
          scrambles.push(scrambleStr);
        }
        for (let i = 0; i < 2; i++) {
          const scramble = await randomScrambleForEvent(scramblingId);
          const scrambleStr = scramble.toString();
          extraScrambles.push(scrambleStr);
        }
        newRoundData.scrambleSets.push({
            id: getRandomInt(1000, 100000),
            scrambles: scrambles,
            extraScrambles: extraScrambles,
        });
      }
      newEventData.rounds.push(newRoundData);
    }
    newData.push(newEventData);
  }
  return newData;
};
