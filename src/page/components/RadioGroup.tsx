import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup as RG } from "@mui/material";
import * as React from "react"

export type RadioItem = {
    value: any;
    label: React.ReactElement | string;
}

export interface Props {
    label?: React.ReactNode;
    defaultValue: any;
    items: RadioItem[];
    onChange?: (value: any) => void;
    style?: React.CSSProperties;
    groupStyle?: React.CSSProperties;
    disabled?: boolean;
}

export const RadioGroup = (props: Props) => {
    const {
        label=undefined,
        defaultValue,
        items,
        onChange,
        disabled = false,
    } = props;

    return (
        <div
            style={props.style}
        >
            <FormControl
                disabled={disabled}
            >
            <FormLabel id="demo-radio-buttons-group-label">{label}</FormLabel>
            <RG
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue={defaultValue}
                name="radio-buttons-group"
                onChange={(_, value) => {
                    onChange?.(value);
                }}
                style={props.groupStyle}
            >
                {
                    items.map(item => (
                        <FormControlLabel value={item.value} control={<Radio />} label={item.label} />
                    ))
                }
            </RG>
            </FormControl>
        </div>
    );
}

export default RadioGroup;
