import { supportedTypes } from "../consts";
import { OCRBlock, OCRData } from "./yandex";

export type FetchFunction = (
  input: string | URL | Request,
  init?: any,
) => Promise<Response>;

export type SupportedType = (typeof supportedTypes)[number];

export type OCROpts = {
  host?: string;
  fetchFn?: FetchFunction; // e.g. GM_fetch, ofetch.native and etc
  fetchOpts?: Record<string, unknown>; // e.g. { dispatcher: ... }
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

export type ClientResponse<T = unknown> =
  | ClientFailedResponse
  | ClientSuccessResponse<T>;

export interface OCRFullBlock extends OCRBlock {
  text: string;
}

export interface OCRFullData extends OCRData {
  text: string;
  blocks: OCRFullBlock[];
}
