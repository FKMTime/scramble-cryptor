import { activityCodeToName } from "./utils";
import { ScramblePassword, UnofficialEvent } from "./interfaces";

export const generatePasswordsForUnofficialEvents = (
  events: UnofficialEvent[]
) => {
  const passwords: ScramblePassword[] = [];
  for (const event of events) {
    for (const round of event.rounds) {
      for (const set of round.scrambleSets) {
        passwords.push({
          eventId: event.id,
          roundId: round.id,
          setId: set.id,
          password: generatePassword(),
        });
      }
    }
  }
  return passwords;
};

export const getPasswordsTxt = (passwords: ScramblePassword[]) => {
  let txt = "";
  txt += `SECRET SCRAMBLE SET PASSCODES\n\n`;
  txt += `Make sure that only Delegates have access to this file.\nGive passcodes to scramblers when the corresponding\ngroups begin (but not earlier). If you have to put\nsomeone else in charge of the passcodes temporarily,\nonly give them the minimum amount of passcodes needed.\n\n`;
  passwords.forEach((password) => {
    txt += `${activityCodeToName(password.roundId)} : ${password.password}\n`;
  });
  return txt;
};

const generatePassword = () => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
};
