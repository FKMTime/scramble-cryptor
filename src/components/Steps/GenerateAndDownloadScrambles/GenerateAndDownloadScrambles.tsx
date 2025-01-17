import { Button } from "@/components/ui/button";

interface GenerateAndDownloadScramblesProps {
    unofficialEventsCount: number;
    generateUnofficialEventsScrambles: () => void;
    scramblesGenerated: boolean;
    handleDownload: () => void;
    isGenerating: boolean;
}

const GenerateAndDownloadScrambles = ({
    unofficialEventsCount,
    generateUnofficialEventsScrambles,
    scramblesGenerated,
    handleDownload,
    isGenerating
}: GenerateAndDownloadScramblesProps) => {
    return (
        <div className="flex flex-col gap-5">
            <h2 className="text-lg">
                Generate unofficial events scrambles & download encrypted JSON
            </h2>
            <div className="flex justify-center gap-4">
                <Button
                    variant="success"
                    onClick={generateUnofficialEventsScrambles}
                    disabled={scramblesGenerated || isGenerating || unofficialEventsCount === 0}>
                    Generate unofficial events scrambles
                </Button>
                <Button
                    variant="success"
                    onClick={handleDownload}
                    disabled={(unofficialEventsCount > 0 && !scramblesGenerated) || isGenerating}
                >
                    Download encrypted scrambles
                </Button>
            </div>
        </div>

    )
};

export default GenerateAndDownloadScrambles;