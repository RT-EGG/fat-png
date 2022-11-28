import TextField, { TextFieldProps } from "@mui/material/TextField/TextField"
import React, { useState, FunctionComponent } from "react"

export type Props = Omit<TextFieldProps, "inputProps" | "onChange"> & {
    onChange?: (value: number) => void,
    validate?: (value: number) => React.ReactNode,
};

export const NumericField: FunctionComponent<Props> = (props: Props) => {
    const {
        onChange,
        validate,
        ...rest
    } = props;

    const [errorMessage, setErrorMessage] = useState<React.ReactNode>("");

    const handleChange = (p: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (p.target.value === "") {
            return;
        }

        const result = Number(p.target.value);
        if (isNaN(result)) {
            setErrorMessage("有効な数値を入力してください。")
        } else {
            const error = validate?.(result);
            if (!!error) {
                setErrorMessage(error);
            } else {
                setErrorMessage("");
            }
        }
        props.onChange?.(result);
    };

    return (
        <TextField
            error={!!errorMessage || props.error}
            onChange={handleChange}
            inputProps={{
                inputMode: "numeric",
                pattern: "[0-9]*",
            }}
            helperText={
                !!props.helperText 
                ? props.helperText
                : !!errorMessage && errorMessage
            }
            onBlur={(e) => {
                if (!e.target.value) {
                    setErrorMessage("有効な数値を入力してください。");
                    props.onChange?.(NaN);
                    return;
                }

                let value = Number(e.target.value);
                if (isNaN(value)) {
                    value = 0;
                }
                e.target.value = value.toString();
            }}
            {...rest}
        />
    )
};

export default NumericField;
