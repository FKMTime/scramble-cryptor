import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

interface UploadScramblesProps {
    handleJSONUpload: (file: File) => void;
    handleTXTUpload: (file: File) => void;
}
const UploadScrambles = ({
    handleJSONUpload,
    handleTXTUpload,
}: UploadScramblesProps) => {
    return (
        <div className="flex flex-col gap-5">
            <p className="text-center">
                Please upload scrambles JSON and TXT file with passwords.
            </p>
            <div className="flex flex-col gap-3">
                <Label>
                    Scrambles JSON
                </Label>
                <Input type="file" accept=".json" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        handleJSONUpload(e.target.files[0]);
                    }
                }} />
                <p className="text-sm text-muted-foreground">
                    JSON file is located in Interchange folder - this is the same you upload to Scrambles Matcher
                </p>
            </div>
            <div className="flex flex-col gap-3">
                <Label>
                    Passwords TXT
                </Label>
                <Input type="file" accept=".txt" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                        handleTXTUpload(e.target.files[0]);
                    }
                }} />

                <p className="text-sm text-muted-foreground">
                    TXT file is located in root folder - this is the same you use to give passwords for scramblers
                </p>
            </div>
        </div>
    );
};

export default UploadScrambles;