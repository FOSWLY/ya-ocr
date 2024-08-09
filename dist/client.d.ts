import { ClientResponse, FetchFunction, OCRFullData, OCROpts } from "./types/client.js";
import { Session, Srv } from "./types/yandex.js";
export default class OCRClient {
    host: string;
    fetch: FetchFunction;
    fetchOpts: Record<string, unknown>;
    userAgent: string;
    headers: Record<string, string>;
    session: Session | null;
    constructor({ fetchFn, fetchOpts, headers, }?: OCROpts);
    getOpts(body: unknown, headers?: Record<string, string>): {
        method: string;
        headers: {
            Referer: string;
            Origin: string;
        };
        body: unknown;
    };
    getSecure(srv: Srv): {
        srv: Srv;
        yu: string;
        yum: string;
    };
    request<T = unknown>(path: string, body: unknown, headers?: Record<string, string>): Promise<ClientResponse<T>>;
    getSession(): Promise<Session>;
    createSession(): Promise<Session>;
    scanByBlob(data: Blob | File): Promise<{
        status: true;
        data: OCRFullData;
    }>;
    scanByFile(filepath: string): Promise<{
        status: true;
        data: OCRFullData;
    }>;
    scanByUrl(url: string, headers?: Record<string, string>): Promise<{
        status: true;
        data: OCRFullData;
    }>;
}
//# sourceMappingURL=client.d.ts.map