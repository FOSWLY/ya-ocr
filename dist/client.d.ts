import { YandexTranslateProvider } from "@toil/translate/providers";
import { BaseProviderType, ClientType, YandexTranslateProviderType } from "@toil/translate/types";
import { OCRFullData, OCROpts } from "./types/client.js";
export default class OCRClient extends YandexTranslateProvider {
    withTranslate: boolean;
    translateLang: ClientType.Lang;
    ocrUrl: string;
    constructor(params?: OCROpts);
    getOpts<T = URLSearchParams>(body: T | null, headers?: Record<string, string>, method?: BaseProviderType.RequestMethod): {
        method: BaseProviderType.RequestMethod;
        headers: {
            Referer: string;
            Origin: string;
            "Content-Type": string;
            "User-Agent": string;
        };
        body: T | null;
    };
    isErrorRes<T extends object>(res: Response, data: T | YandexTranslateProviderType.FailedResponse): data is YandexTranslateProviderType.FailedResponse;
    request<T extends object, B = URLSearchParams>(path: string, body?: B | null, headers?: Record<string, string>, method?: BaseProviderType.RequestMethod): Promise<BaseProviderType.ProviderResponse<T>>;
    scanByBlob(data: Blob | File): Promise<OCRFullData>;
    scanByFile(filepath: string): Promise<OCRFullData>;
    scanByUrl(url: string, headers?: Record<string, string>): Promise<OCRFullData>;
}
//# sourceMappingURL=client.d.ts.map