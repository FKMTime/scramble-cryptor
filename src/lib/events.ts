import { EventData } from "./interfaces";

//Unofficial events supported by FKMTime are included here as well.
export const eventsData: EventData[] = [
  {
    id: "333",
    name: "3x3x3",
    shortName: "3x3x3",
    icon: "event-333",
    useInspection: true,
    usualScramblesCount: 5,
    usualExtraScramblesCount: 2,
  },
  {
    id: "222",
    name: "2x2x2",
    shortName: "2x2x2",
    icon: "event-222",
    useInspection: true,
    usualScramblesCount: 5,
    usualExtraScramblesCount: 2,
  },
  {
    id: "444",
    name: "4x4x4",
    shortName: "4x4x4",
    icon: "event-444",
    useInspection: true,
    usualScramblesCount: 5,
    usualExtraScramblesCount: 2,
  },
  {
    id: "555",
    name: "5x5x5",
    shortName: "5x5x5",
    icon: "event-555",
    useInspection: true,
    usualScramblesCount: 5,
    usualExtraScramblesCount: 2,
  },
  {
    id: "666",
    name: "6x6x6",
    shortName: "6x6x6",
    icon: "event-666",
    useInspection: true,
    usualScramblesCount: 3,
    usualExtraScramblesCount: 2,
    preferredFormat: "m",
  },
  {
    id: "777",
    name: "7x7x7",
    shortName: "7x7x7",
    icon: "event-777",
    useInspection: true,
    usualScramblesCount: 3,
    usualExtraScramblesCount: 2,
    preferredFormat: "m",
  },
  {
    id: "333bf",
    name: "3x3x3 Blindfolded",
    shortName: "3x3x3 BLD",
    icon: "event-333bf",
    useInspection: false,
    usualScramblesCount: 3,
    usualExtraScramblesCount: 2,
    preferredFormat: "3",
  },
  {
    id: "333fm",
    name: "3x3x3 Fewest Moves",
    shortName: "FMC",
    icon: "event-333fm",
    useInspection: false,
    usualScramblesCount: 3,
    usualExtraScramblesCount: 0,
    preferredFormat: "m",
  },
  {
    id: "333oh",
    name: "3x3x3 One-Handed",
    shortName: "3x3x3 OH",
    icon: "event-333oh",
    useInspection: true,
    usualScramblesCount: 5,
    usualExtraScramblesCount: 2,
  },
  {
    id: "minx",
    name: "Megaminx",
    icon: "event-minx",
    useInspection: true,
    usualScramblesCount: 5,
    usualExtraScramblesCount: 2,
  },
  {
    id: "pyram",
    name: "Pyraminx",
    icon: "event-pyram",
    useInspection: true,
    usualScramblesCount: 5,
    usualExtraScramblesCount: 2,
  },
  {
    id: "clock",
    name: "Clock",
    icon: "event-clock",
    useInspection: true,
    usualScramblesCount: 5,
    usualExtraScramblesCount: 2,
  },
  {
    id: "skewb",
    name: "Skewb",
    icon: "event-skewb",
    useInspection: true,
    usualScramblesCount: 5,
    usualExtraScramblesCount: 2,
  },
  {
    id: "sq1",
    name: "Square-1",
    icon: "event-sq1",
    useInspection: true,
    usualScramblesCount: 5,
    usualExtraScramblesCount: 2,
  },
  {
    id: "444bf",
    name: "4x4x4 Blindfolded",
    shortName: "4x4x4 BLD",
    icon: "event-444bf",
    useInspection: false,
    usualScramblesCount: 3,
    usualExtraScramblesCount: 2,
    preferredFormat: "3",
  },
  {
    id: "555bf",
    name: "5x5x5 Blindfolded",
    shortName: "5x5x5 BLD",
    icon: "event-555bf",
    useInspection: false,
    usualScramblesCount: 3,
    usualExtraScramblesCount: 2,
    preferredFormat: "3",
  },
  {
    id: "333mbf",
    name: "3x3x3 Multi-Blind",
    shortName: "MBLD",
    icon: "event-333mbf",
    useInspection: false,
  },
  {
    id: "fto",
    name: "FTO",
    icon: "unofficial-fto",
    useInspection: true,
    isUnofficial: true,
    usualScramblesCount: 5,
    usualExtraScramblesCount: 2,
  },
  {
    id: "mirror",
    scramblingId: "333",
    name: "Mirror blocks",
    shortName: "Mirror",
    icon: "unofficial-333_mirror_blocks",
    useInspection: true,
    isUnofficial: true,
    usualScramblesCount: 5,
    usualExtraScramblesCount: 2,
  },
];

export const formats = ["a", "m", "3"];

export const prettyEventFormat = (format: string) => {
  switch (format) {
    case "a":
      return "Average of 5";
    case "m":
      return "Mean of 3";
    case "3":
      return "Best of 3";
    default:
      return "Unknown";
  }
}

export const isUnofficialEvent = (eventId: string) => {
  return eventsData.find((event) => event.id === eventId)?.isUnofficial;
};

export const getEventShortName = (eventId: string) => {
  const event = eventsData.find((e) => e.id === eventId);
  return event?.shortName || event?.name;
};
export const getEventIconClass = (eventId: string) => {
  return eventsData.find((event) => event.id === eventId)?.icon;
};
