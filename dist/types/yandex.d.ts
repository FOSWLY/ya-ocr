export type Session = {
    creationTimestamp: number;
    id: string;
    maxAge: number;
    status: string;
    statusCode: number;
};
export type Srv = "tr-text" | "tr-image";
export type SessionResponse = Record<"session", Session>;
export type ErrorType = "BadArgument" | "UnsupportedImageType" | "BadRequest";
export type OCRFailedResponse = {
    error: ErrorType;
    description: string;
};
export type OCRPoint = {
    x: number;
    y: number;
};
export type Color = {
    a: number;
    b: number;
    r: number;
    x: number;
    y: number;
    g: number;
    Points: OCRPoint[];
};
export type PolyCoefs = {
    a3: number;
    a2: number;
    a1: number;
    a0: number;
    fromXtoY: boolean;
    hh: number;
};
export type Word = {
    x: number;
    y: number;
    w: number;
    h: number;
    polyCoefs: PolyCoefs;
    text: string;
};
export type OCRBox = {
    x: number;
    y: number;
    w: number;
    h: number;
    backgroundColor: Color;
    textColor: Color;
    polyCoefs: PolyCoefs;
    text: string;
    orientation: number;
    line_size_category: number;
    words: Word[];
};
export type OCRBlock = {
    angle: number;
    x: number;
    y: number;
    w: number;
    h: number;
    rx: number;
    ry: number;
    rw: number;
    rh: number;
    boxes: OCRBox[];
};
export type OCRData = {
    detected_lang: string;
    rotate: number;
    blocks: OCRBlock[];
    tables: unknown[];
};
export type OCRSuccessResponse = {
    status: "success";
    data: OCRData;
    request_id: string;
};
export type OCRResponse = OCRSuccessResponse | OCRFailedResponse;
//# sourceMappingURL=yandex.d.ts.map