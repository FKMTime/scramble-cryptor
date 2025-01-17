import { eventsData } from "./events";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const THEME_STORAGE_KEY = "fkmtime-scramble-cryptor-theme";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  }
};

export const getEventIdFromName = (name: string) => {
  const event = eventsData.find((event) => event.name === name);
  return event?.id || "";
};

export const letterToNumber = (letter: string) => {
  return letter.charCodeAt(0) - 64;
};