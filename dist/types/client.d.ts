import { supportedTypes } from "../consts.js";
import { OCRBlock, OCRData } from "./yandex.js";
export type FetchFunction = (input: string | URL | Request, init?: any) => Promise<Response>;
export type SupportedType = (typeof supportedTypes)[number];
export type OCROpts = {
    host?: string;
    fetchFn?: FetchFunction;
    fetchOpts?: Record<string, unknown>;
    headers?: Record<string, string>;
};
export type ClientSuccessResponse<T = unknown> = {
    success: boolean;
    data: T;
};
export type ClientFailedResponse = {
    success: false;
    data: string | null;
};
export type ClientResponse<T = unknown> = ClientFailedResponse | ClientSuccessResponse<T>;
export interface OCRFullBlock extends OCRBlock {
    text: string;
}
export interface OCRFullData extends OCRData {
    text: string;
    blocks: OCRFullBlock[];
}
//# sourceMappingURL=client.d.ts.map