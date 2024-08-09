import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileTypeFromBuffer } from "file-type";
import config from "./config/config.js";
import { fetchWithTimeout, getTimestamp } from "./utils/utils.js";
import { genYandexMetrikaUID, genYandexUID } from "./secure.js";
import { supportedTypes } from "./consts.js";
class OCRError extends Error {
    data;
    constructor(message, data = undefined) {
        super(message);
        this.data = data;
        this.name = "OCRError";
        this.message = message;
    }
}
export default class OCRClient {
    host;
    fetch;
    fetchOpts;
    userAgent = config.userAgent;
    headers = {
        "User-Agent": this.userAgent,
    };
    session = null;
    constructor({ fetchFn = fetchWithTimeout, fetchOpts = {}, headers = {}, } = {}) {
        this.host = "https://translate.yandex.net";
        this.fetch = fetchFn;
        this.fetchOpts = fetchOpts;
        this.headers = { ...this.headers, ...headers };
    }
    getOpts(body, headers = {}) {
        const origin = this.host;
        return {
            method: "POST",
            headers: {
                ...this.headers,
                Referer: origin,
                Origin: origin,
                ...headers,
            },
            body,
            ...this.fetchOpts,
        };
    }
    getSecure(srv) {
        return {
            srv,
            yu: genYandexUID(),
            yum: genYandexMetrikaUID(),
        };
    }
    async request(path, body, headers = {}) {
        const options = this.getOpts(body, headers);
        try {
            const res = await this.fetch(`${this.host}${path}`, options);
            const data = (await res.json());
            return {
                success: res.status === 200,
                data,
            };
        }
        catch (err) {
            return {
                success: false,
                data: err?.message,
            };
        }
    }
    async getSession() {
        const timestamp = getTimestamp();
        if (this.session &&
            this.session.creationTimestamp + this.session.maxAge > timestamp) {
            return this.session;
        }
        return (this.session = await this.createSession());
    }
    async createSession() {
        const res = await this.request("/props/api/v1.0/sessions?" +
            new URLSearchParams(this.getSecure("tr-text")).toString(), null);
        if (!res.success) {
            throw new OCRError("Failed to request create session", res);
        }
        return res.data.session;
    }
    async scanByBlob(data) {
        const { id: sid } = await this.getSession();
        const body = new FormData();
        body.append("file", data, "test");
        const res = await this.request("/ocr/v1.1/recognize?" +
            new URLSearchParams({
                sid,
                lang: "*",
                rotate: "auto",
                ...this.getSecure("tr-image"),
            }).toString(), body);
        if (!res.success) {
            throw new OCRError("Failed to request OCR", res);
        }
        const blocks = res.data.data.blocks.map((block) => {
            const text = block.boxes.map((box) => box.text).join(" ");
            return {
                ...block,
                text,
            };
        });
        const text = blocks.map((block) => block.text).join("\n");
        const result = {
            ...res.data.data,
            blocks,
            text,
        };
        return {
            status: res.success,
            data: result,
        };
    }
    async scanByFile(filepath) {
        const fullpath = path.resolve(`${process.platform === 'win32' ? '' : '/'}${/file:\/{2,3}(.+)\/[^/]/.exec(import.meta.url)[1]}`, filepath);
        let buffer = null;
        try {
            buffer = await readFile(fullpath);
        }
        catch (err) {
            switch (err?.name) {
                case "ENOENT":
                    throw new OCRError(`File not found by path: ${fullpath}`);
                case "EACCES":
                    throw new OCRError(`Not enough rights to read file: ${fullpath}`);
                case "EISDIR":
                    throw new OCRError(`Expected file, but found dir: ${fullpath}`);
            }
        }
        if (!buffer) {
            throw new OCRError(`File is empty: ${fullpath}`);
        }
        const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
        const fileType = await fileTypeFromBuffer(arrayBuffer);
        if (!fileType || !supportedTypes.includes(fileType.mime)) {
            throw new OCRError(`Unsupported file type: ${fileType?.mime}`);
        }
        return await this.scanByBlob(new Blob([arrayBuffer], { type: fileType.mime }));
    }
    async scanByUrl(url, headers = {}) {
        if (!URL.canParse(url)) {
            throw new OCRError(`${url} isn't a valid URL`);
        }
        const fileUrl = new URL(url);
        const res = await this.fetch(fileUrl, {
            headers: {
                ...this.headers,
                ...headers,
            },
            ...this.fetchOpts,
        });
        const data = (await res.blob());
        return await this.scanByBlob(data);
    }
}
