import { Trash2 } from "lucide-react";

import { Button } from "./ui/button";

interface DeleteButtonProps extends React.ComponentProps<typeof Button> {}
const DeleteButton = ({ ...props }: DeleteButtonProps) => {
    return (
        <Button size="icon" {...props}>
            <Trash2 />
        </Button>
    );
};

export default DeleteButton;