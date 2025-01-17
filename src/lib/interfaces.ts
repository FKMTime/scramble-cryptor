export interface ScramblePassword {
    eventId: string;
    roundId: string;
    setId: number;
    password: string;
}

export interface UnofficialEvent {
    id: string;
    rounds: UnofficialEventRound[];
}

export interface UnofficialEventRound {
    id: string;
    format: string;
    scrambleSetCount: number;
    scrambles: string[];
    extraScrambles: string[];
}

export interface EventData {
    id: string;
    name: string;
    icon: string;
    shortName?: string;
    useInspection?: boolean;
    isUnofficial?: boolean;
    usualScramblesCount?: number;
    usualExtraScramblesCount?: number;
    preferredFormat?: string;
}