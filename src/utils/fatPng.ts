import { buf as Crc32Buf} from "crc-32"
import { FileUrl } from "../page/type";

const savePlaneImage = (width: number, height: number, fill: string | CanvasGradient | CanvasPattern = "#000000"): string | null => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", width.toString());
    canvas.setAttribute("height", height.toString());

    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error("不明なエラー：キャンバスの作成に失敗しました");
    }
    
    context.save();
    // キャンバスを指定された色で塗りつぶし
    context.fillStyle = fill;
    context.fillRect(0, 0, width, height);
    context.restore();

    return canvas.toDataURL("image/png")
};

const saveImageFromImage = async (imageUrl: string): Promise<string | null> => {
    const canvas = document.createElement("canvas");

    const context = canvas.getContext('2d');
    if (!context) {
        throw new Error("不明なエラー：キャンバスの作成に失敗しました");
    }

    const image = new Image();
    return await new Promise((resolve) => {
        image.onload = () => {
            canvas.setAttribute("width", image.width.toString());
            canvas.setAttribute("height", image.height.toString());

            context.save();
            context.drawImage(image, 0, 0);
            context.restore();
            resolve(canvas.toDataURL("image/png")) ;
        };
        image.src = imageUrl;
    });
}

const fileToBytes = async (url: string): Promise<ArrayBuffer | null> => {
    const response = await fetch(url, {
        'method': 'GET',
    });

    return response.arrayBuffer();
}

const strToCharCodeArray = (src: string): Array<number> => {
    const result: number[] = Array<number>(src.length);
    for (let i = 0; i < src.length; ++i) {
        result[i] = src.charCodeAt(i);
    }
    return result;
}

const findChunkHead = (src: Uint8Array, chunkName: string, fromEnd: boolean = false): number => {
    const numChunkName: number[] = strToCharCodeArray(chunkName);
    const checkAt = (index: number): boolean => {
        for (let i = 0; i < numChunkName.length; ++i) {
            if (numChunkName[i] !== src.at(index + i)) {
                return false;
            }
        }
        return true;
    };

    let position = -1;
    if (fromEnd) {
        for (let i = src.byteLength - numChunkName.length - 1; i >= 0; --i) {
            if (checkAt(i)) {
                position = i;
                break;
            }
        }
    } else {
        for (let i = 0; i < src.byteLength - numChunkName.length; ++i) {
            if (checkAt(i)) {
                position = i;
                break;
            }
        }
    }

    if (position - 4 < 0) {
        return -1;
    }
    // body size記述部分だけオフセット
    return position - 4;
};

const makeChunk = (size: number, name: string="efAT"): ArrayBuffer | null => {
    console.log("size", size);
    const dstBuffer = new ArrayBuffer(size);
    const dst = new DataView(dstBuffer);

    const littleEndian = true;
    // Body部のサイズ
    const bodySize = size - (4 + name.length + 4);
    dst.setInt32(0, bodySize, littleEndian);
    // Chunk名
    const numChunkName: number[] = strToCharCodeArray(name);
    for (let i = 0; i < name.length; ++i) {
        dst.setUint8(12 + i, numChunkName[i]);
    }
    // Body
    let index = 4 + name.length;
    for (; index < size - 4; ++index) {
        dst.setUint8(index, 0);
    }
    // CRC
    let crc = Crc32Buf(numChunkName, 0);
    crc = Crc32Buf(new Uint8Array(dstBuffer, 4 + name.length, bodySize), crc);
    dst.setInt32(index, crc);

    return dstBuffer;
}

const makeFat = async (url: string, targetFilesize: number): Promise<ArrayBuffer | null> => {
    const bytes: ArrayBuffer | null = await fileToBytes(url);
    if (!bytes) {
        throw new Error("ファイルの読み込みに失敗しました");
    }

    const chunkSize = targetFilesize - bytes.byteLength;
    if (chunkSize < 12) {
        // 指定サイズにできない
        throw new Error(`基本サイズが${bytes.byteLength}byteであるため、${targetFilesize}byteのサイズを作成できません`);
    }

    const src = new Uint8Array(bytes);
    const iendPosition = findChunkHead(src, "IEND", true);
    if (iendPosition < 0) {
        // 挿入位置が見つからない
        throw new Error(`フォーマットエラー（IENDチャンクが見つかりません）`);
    }

    const chunkBuffer = makeChunk(chunkSize);
    if (!chunkBuffer) {
        // 空チャンク作成失敗
        throw new Error(`空チャンクの作成に失敗しました`);
    }

    const newBuffer = new ArrayBuffer(targetFilesize);
    const dst = new Uint8Array(newBuffer);
    const chunk = new Uint8Array(chunkBuffer);

    dst.set(src.slice(0, iendPosition), 0);
    dst.set(chunk, iendPosition);
    dst.set(src.slice(iendPosition), iendPosition + chunk.length);

    return newBuffer;
};

export const saveBinaryFile = (buffer: ArrayBuffer, defaultName: string = "image.png") => {
    var a = document.createElement("a");
    document.body.appendChild(a);

    var blob = new Blob([buffer], {type: "octet/stream"}),
    url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = defaultName;
    a.click();
    window.URL.revokeObjectURL(url);

    document.body.removeChild(a);
};

export const saveNewImage = async (width: number, height: number, targetFilesize: number, setIsProcessing: (value: boolean) => void, setError: (value: string) => void): Promise<void> => {
    try {
        setIsProcessing(true);

        const planeUrl = savePlaneImage(width, height);
        if (!planeUrl) {
            return;
        }

        const buffer = await makeFat(planeUrl, targetFilesize);
        if (!buffer) {
            return;
        }

        saveBinaryFile(buffer);
    
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        }
        
    } finally {
        setIsProcessing(false);
    }
};

export const saveWithExistingFile = async (file: FileUrl, targetFilesize: number, setIsProcessing: (value: boolean) => void, setError: (value: string) => void): Promise<void> => {
    try {
        setIsProcessing(true);

        const url = file.file.type === "image/png" 
            ? file.url : await saveImageFromImage(file.url);
        if (!url) {
            return;
        }

        const buffer = await makeFat(url, targetFilesize);
        if (!buffer) {
            return;
        }

        saveBinaryFile(buffer);

    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        }

    } finally {
        setIsProcessing(false);
    }
};