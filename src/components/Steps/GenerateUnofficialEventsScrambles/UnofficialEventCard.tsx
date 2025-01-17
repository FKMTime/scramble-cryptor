import DeleteButton from "@/components/DeleteButton";
import EventIcon from "@/components/EventIcon";
import PlusButton from "@/components/PlusButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventData, UnofficialEvent, UnofficialEventRound } from "@/lib/interfaces";

interface UnofficialEventCardProps {
    eventData: EventData;
    selectedEvents: UnofficialEvent[];
    addRound: (eventId: string) => void;
    updateRound: (eventId: string, round: UnofficialEventRound) => void;
    deleteRound: (eventId: string) => void;
}
const UnofficialEventCard = ({ eventData, selectedEvents, addRound, updateRound, deleteRound }: UnofficialEventCardProps) => {
    const event = selectedEvents.find(event => event.id === eventData.id);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex gap-1 text-lg items-center">
                        <EventIcon
                            eventId={eventData.id}
                            selected
                            size={24}
                        />
                        {eventData.name}
                    </div>
                    <div className="flex gap-3">
                        <PlusButton onClick={() => addRound(eventData.id)} />
                        <DeleteButton onClick={() => deleteRound(eventData.id)} />
                    </div>
                </CardTitle>
                <CardContent>
                    {event?.rounds.map(round => (
                        <div key={round.id} className="flex gap-3">
                            {round.id}
                        </div>
                    ))}

                </CardContent>
            </CardHeader>
        </Card>

    )
};

export default UnofficialEventCard;