import DeleteButton from "@/components/DeleteButton";
import EventIcon from "@/components/EventIcon";
import PlusButton from "@/components/PlusButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formats, prettyEventFormat } from "@/lib/events";
import { EventData, UnofficialEvent, UnofficialEventRound } from "@/lib/interfaces";
import { activityCodeToName } from "@/lib/utils";

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
                        <PlusButton onClick={() => addRound(eventData.id)} disabled={event && event?.rounds?.length >= 4} />
                        <DeleteButton onClick={() => deleteRound(eventData.id)} disabled={!event || event?.rounds?.length === 0} />
                    </div>
                </CardTitle>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    Round
                                </TableHead>
                                <TableHead>
                                    Format
                                </TableHead>
                                <TableHead>
                                    Scramble sets
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>

                            {event?.rounds.map(round => (
                                <TableRow key={round.id}>
                                    <TableCell>
                                        {activityCodeToName(round.id)}
                                    </TableCell>
                                    <TableCell>
                                        <Select value={round.format} onValueChange={(newValue) => updateRound(eventData.id, { ...round, format: newValue })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Format" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {formats.map(format => (
                                                    <SelectItem key={format} value={format}>
                                                        {prettyEventFormat(format)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" value={round.scrambleSetCount} onChange={(event) => updateRound(eventData.id, { ...round, scrambleSetCount: +event.target.value })} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </CardContent>
            </CardHeader>
        </Card >

    )
};

export default UnofficialEventCard;