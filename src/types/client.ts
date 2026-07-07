import { ClientType } from "@toil/translate/types";

import { supportedTypes } from "@/consts";
import { OCRBlock, OCRBox, OCRData } from "./yandex";

export type SupportedType = (typeof supportedTypes)[number];

export type OCROpts = {
  host?: string;
  withTranslate?: boolean;
  translateLang?: ClientType.Lang;
  fetchFn?: ClientType.FetchFunction; // e.g. GM_fetch, ofetch.native and etc
  fetchOpts?: Record<string, unknown>; // e.g. { dispatcher: ... }
  headers?: Record<string, string>;
};

export interface OCRFullBox extends OCRBox {
  translatedText?: string;
}

export interface OCRFullBlock extends OCRBlock {
  text: string;
  translatedText?: string;
  boxes: OCRFullBox[];
}

export interface OCRFullData extends OCRData {
  text: string;
  translatedText?: string;
  svg?: string;
  blocks: OCRFullBlock[];
}
