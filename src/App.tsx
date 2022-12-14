import { useState } from 'react';
import RadioGroup from './page/components/RadioGroup';
import { FileUrl, GenerateMode } from './page/type';
import NumericField from './page/components/NumericField';
import Dropzone from './page/components/Dropzone';
import { Button, CircularProgress, Snackbar } from '@mui/material';
import { saveNewImage, saveWithExistingFile } from './utils/fatPng';
import BackspaceIcon from '@mui/icons-material/Backspace';

function App() {
    const [genMode, setGenMode] = useState<GenerateMode>(GenerateMode.CreateNew);
    const [genWidth, setGenWidth] = useState<number>(0);
    const [genHeight, setGenHeight] = useState<number>(0);
    const [targetFilesize, setTargetFilesize] = useState<number>(0);
    const [overwriteImage, setOverwriteImage] = useState<FileUrl | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const executable = !((targetFilesize <= 0) || isNaN(targetFilesize) ||
                        (
                            genMode === GenerateMode.CreateNew
                                ? (genWidth <= 0) || isNaN(genWidth) || (genHeight <= 0) || isNaN(genHeight)
                                : !overwriteImage
                        ))

    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                flexFlow: "column nowrap",
            }}
        >
            <div
                style={{
                    backgroundColor: "#F3F0EC",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    fontSize: "calc(10px + 2vmin)",
                    color: "black",
                    padding: "24px",
                    position: "relative",
                    flex: "1 1",
                }}
            >
                <div
                    style={{
                        maxWidth: "80%",
                    }}
                >
                    <div
                        style={{
                            color: "rgba(0, 0, 0, 0.8)",
                            fontSize: "34px",
                            fontWeight: "600",
                        }}
                    >
                        Fat Png
                    </div>
                    <p
                        style={{
                            fontSize: "16px"
                        }}
                    >
                        PNG??????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                    </p>
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexFlow: "column nowrap",
                            alignItems: "center",
                        }}
                    >
                        <RadioGroup
                            defaultValue={GenerateMode.CreateNew}
                            items={[
                                { value: GenerateMode.CreateNew, label: "???????????????????????????" },
                                { value: GenerateMode.AddExtra, label: "??????????????????????????????" }
                            ]}
                            onChange={value => setGenMode(value)}
                            style={{
                                flexShrink: 0,
                            }}
                            groupStyle={{
                                display: "flex",
                                flexFlow: "row nowrap",
                                marginBottom: "16px",
                            }}
                            disabled={isProcessing}
                        />
                        {
                            genMode === GenerateMode.CreateNew ? (
                                <div
                                    style={{
                                        display: "flex",
                                        flexFlow: "row nowrap",
                                        flexShrink: 1,
                                        alignItems: "center",
                                    }}
                                >
                                    <NumericField
                                        id="newImageWidth"
                                        label="????????????"
                                        onChange={value => {
                                            setGenWidth(value);
                                        }}
                                        validate={value => {
                                            const str = value.toString();
                                            if (value <= 0 || str.indexOf(".") >= 0) {
                                                return "1?????????????????????????????????????????????";
                                            }
                                            return null;
                                        }}
                                        style={{
                                            marginBottom: "8px",
                                        }}
                                        disabled={isProcessing}
                                    />
                                    <div
                                        style={{
                                            margin: "0px 8px"
                                        }}
                                    >
                                    {" x "}
                                    </div>
                                    <NumericField
                                        id="newImageHeight"
                                        label="????????????"
                                        onChange={value => {
                                            setGenHeight(value);
                                        }}
                                        validate={value => {
                                            const str = value.toString();
                                            if (value <= 0 || str.indexOf(".") >= 0) {
                                                return "1?????????????????????????????????????????????";
                                            }
                                            return null;
                                        }}
                                        style={{
                                            marginBottom: "8px",
                                        }}
                                        disabled={isProcessing}
                                    />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        width: "100%",
                                        flexShrink: 1,
                                        display: "flex",
                                        flexFlow: "column nowrap",
                                        alignItems: "center",
                                    }}
                                >
                                    { 
                                    overwriteImage ? (
                                        <div
                                            style={{
                                                maxWidth: "80%",
                                                display: "flex",
                                                flexFlow: "column nowrap"
                                            }}
                                        >
                                            <Button
                                                style={{
                                                    minWidth: "0px",
                                                    width: "auto",
                                                    marginLeft: "auto",
                                                    padding: "2px 8px",
                                                }}
                                                onClick={() => {
                                                    setOverwriteImage(null);
                                                }}
                                                disabled={isProcessing}
                                            >
                                                <BackspaceIcon
                                                    color='error'
                                                />
                                            </Button>
                                            <img 
                                                src={overwriteImage.url}
                                                width={"100%"}
                                            />
                                        </div>
                                    )  : (
                                        <div
                                            style={{
                                                "width": "100%",
                                            }}
                                        >
                                            <Dropzone
                                                content={(dropActive) => (
                                                    <div
                                                        style={{
                                                            width: "30%",
                                                            aspectRatio: "1",
                                                            margin: "auto",
                                                            border: "3px solid rgba(128, 128, 255, 1.0)",
                                                            borderRadius: "10px",
                                                            display: "flex",
                                                            flexFlow: "column nowrap",
                                                            justifyContent: "center",
                                                            alignContent: "center",
                                                            alignItems: "center",
                                                            background: "rgba(255, 255, 255, 0.0)",
                                                            cursor: "pointer",
                                                        }}
                                                    >                
                                                        <div>{"???????????????"}</div>
                                                    </div>
                                                )}
                                                onNewFile={(files: File[]) => {
                                                    const file: FileUrl = {
                                                        file: files[0],
                                                        url: URL.createObjectURL(files[0]),
                                                    }
                                                    setOverwriteImage(file);
                                                }}
                                            />
                                        </div>
                                    )
                                }
                                </div>
                            )
                        }
                        <NumericField
                            style={{
                                marginTop: "16px",
                            }}
                            label={"???????????????????????????(byte)"}
                            onChange={value => {
                                setTargetFilesize(value);
                            }}
                            validate={value => {
                                const str = value.toString();                      
                                const maxSize = 1073741824;
                                if (value <= 0 || str.indexOf(".") >= 0 || value > maxSize) {
                                    return `1?????????${maxSize}?????????????????????????????????????????????`
                                }
                                return null;
                            }}
                            disabled={isProcessing}
                        />
                        <div
                            style={{
                                marginTop: "16px",
                            }}
                        >
                        {
                            isProcessing ? (
                                <CircularProgress
                                    disableShrink={true}
                                />
                            ) : (
                                <Button
                                    style={{
                                        background: executable ? "#4d90fe" : "#888888",
                                        color: "#FFFFFF",
                                        fontSize: "32px",
                                    }}
                                    onClick={async () => {
                                        if (genMode === GenerateMode.CreateNew) {
                                            await saveNewImage(genWidth, genHeight, targetFilesize, setIsProcessing, setError);
                                        } else {
                                            if (!!overwriteImage) {
                                                await saveWithExistingFile(overwriteImage, targetFilesize, setIsProcessing, setError);
                                            }
                                        }                        
                                    }}
                                    disabled={!executable}
                                >
                                    ??????
                                </Button>
                            )
                        }
                        </div>
                    </div>
                </div>
            </div>
            <Snackbar
                open={!!error}
                autoHideDuration={5000}
                message={error}
                onClose={() => {
                    setError("");
                }}
            />
            <div className='footer'>
                ??2022 RT-EGG
            </div>
        </div>
    );
}

export default App;
