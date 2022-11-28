import React, { useState, useCallback, FunctionComponent, CSSProperties, ReactNode } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";

export interface Props {
    style?: CSSProperties;
    content?: (isDragActive: boolean) => ReactNode;
    onNewFile?: (files: File[]) => void;
};

export const Dropzone: FunctionComponent<Props> = (props: Props) => {
    const {
        style,
        content,
        onNewFile,
    } = props;
    
    const onDrop = useCallback(<T extends File>(
        acceptedFiles: T[],
        fileRejections: FileRejection[],
        event: DropEvent
    ) => {
        onNewFile?.(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div
            {...getRootProps()}
            style={style}
        >
            <input {...getInputProps()} />
            {content?.(isDragActive)}
        </div>
    )
};

export default Dropzone;
