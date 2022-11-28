import { Snackbar as MuiSnackbar } from "@mui/material"

type Props = {
    open: boolean;
    message: React.ReactNode;
    onClose?: () => void;
};

export const Snackbar: React.FunctionComponent<Props> = ({
    open,
    message,
    onClose,
}: Props) => {
    return (
        <MuiSnackbar
            open={open}
            autoHideDuration={5000}
            onClose={onClose}
        >
            <div>{message}</div>
        </MuiSnackbar>
    )
};