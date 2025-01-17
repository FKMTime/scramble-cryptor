import { activityCodeToName as wcifActivityCodeToName } from "@wca/helpers";
import { eventsData, getEventShortName, isUnofficialEvent } from "./events";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export const THEME_STORAGE_KEY = "fkmtime-scramble-cryptor-theme";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getWCIFFromName = (name: string) => {
  const eventName = name.split(" Round")[0];
  const roundNumber = name.split(" Round")[1].split(" ")[1];
  const eventId = getEventIdFromName(eventName);
  const setLetter = name.split(" Set ")[1].split(": ")[0];
  return {
    eventId: eventId,
    roundId: `${eventId}-r${roundNumber}`,
    setId: letterToNumber(setLetter),
  };
};

export const getEventIdFromName = (name: string) => {
  const event = eventsData.find((event) => event.name === name);
  return event?.id || "";
};

export const letterToNumber = (letter: string) => {
  return letter.charCodeAt(0) - 64;
};

export const numberToLetter = (number: number) => {
  return String.fromCharCode(number + 64);
};

export const activityCodeToName = (activityCode: string) => {
  if (activityCode === "") return "";
  const eventId = activityCode.split("-r")[0];
  if (isUnofficialEvent(eventId)) {
    return `${getEventShortName(eventId)}, Round ${
      activityCode.split("-g")[0].split("-r")[1]
    }`;
  } else {
    return wcifActivityCodeToName(activityCode);
  }
};

export const getRandomInt = (min: number, max: number) => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
};
