import { eventsData } from "@/lib/events"
import { UnofficialEvent, UnofficialEventRound } from "@/lib/interfaces";
import UnofficialEventCard from "./UnofficialEventCard";

interface GenerateUnofficialEventsScramblesProps {
    selectedEvents: UnofficialEvent[];
    setSelectedEvents: (events: UnofficialEvent[]) => void;
}

const GenerateUnofficialEventsScrambles = ({
    selectedEvents,
    setSelectedEvents,
}: GenerateUnofficialEventsScramblesProps) => {
    const unofficialEvents = eventsData.filter(event => event.isUnofficial);

    const addRound = (eventId: string) => {
        const event = selectedEvents.find(event => event.id === eventId);
        const eventData = unofficialEvents.find(event => event.id === eventId);
        if (event) {
            event.rounds.push({
                id: `${eventId}-r${event.rounds.length + 1}`,
                format: eventData?.preferredFormat ? eventData.preferredFormat : "a",
                scrambleSetCount: 1,
                scrambleSets: [],
            });
            setSelectedEvents([...selectedEvents]);
        } else {
            setSelectedEvents([
                ...selectedEvents,
                {
                    id: eventId,
                    rounds: [
                        {
                            id: `${eventId}-r1`,
                            format: eventData?.preferredFormat ? eventData.preferredFormat : "a",
                            scrambleSetCount: 1,
                            scrambleSets: [],
                        },
                    ],
                },
            ]);
        }
    };

    const deleteRound = (eventId: string) => {
        const event = selectedEvents.find(event => event.id === eventId);
        if (event) {
            event.rounds.pop();
            setSelectedEvents([...selectedEvents]);
        }
    };

    const updateRound = (eventId: string, round: UnofficialEventRound) => {
        const event = selectedEvents.find(event => event.id === eventId);
        if (event) {
            const index = event.rounds.findIndex(r => r.id === round.id);
            event.rounds[index] = round;
            setSelectedEvents([...selectedEvents]);
        }
    };

    return (
        <>
            <div className="flex flex-col">
                <h2 className="text-lg">
                    Select unofficial for which you need scrambles
                </h2>
                <p className="text-muted-foreground">
                    They will be encrypted and added to final JSON. Feel free to skip this step if you don't plan to hold any of these events.
                </p>
            </div>
            {unofficialEvents.map((eventData) => (
                <UnofficialEventCard
                    eventData={eventData}
                    selectedEvents={selectedEvents}
                    addRound={addRound}
                    updateRound={updateRound}
                    deleteRound={deleteRound}
                />
            ))}
        </>
    );
};

export default GenerateUnofficialEventsScrambles;