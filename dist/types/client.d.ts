import { ClientType } from "@toil/translate/types";
import { supportedTypes } from "../consts.js";
import { OCRBlock, OCRData } from "./yandex.js";
export type SupportedType = (typeof supportedTypes)[number];
export type OCROpts = {
    host?: string;
    withTranslate?: boolean;
    translateLang?: ClientType.Lang;
    fetchFn?: ClientType.FetchFunction;
    fetchOpts?: Record<string, unknown>;
    headers?: Record<string, string>;
};
export interface OCRFullBlock extends OCRBlock {
    text: string;
    translatedText?: string;
}
export interface OCRFullData extends OCRData {
    text: string;
    translatedText?: string;
    blocks: OCRFullBlock[];
}
//# sourceMappingURL=client.d.ts.map