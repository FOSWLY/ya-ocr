import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileTypeFromBuffer } from "file-type";
import { YandexTranslateProvider } from "@toil/translate/providers";
import { ProviderError } from "@toil/translate/errors";
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
export default class OCRClient extends YandexTranslateProvider {
    withTranslate;
    translateLang;
    ocrUrl = "https://translate.yandex.net";
    constructor(params = {}) {
        super(params);
        this.withTranslate = params.withTranslate ?? false;
        this.translateLang = params.translateLang ?? this.baseLang;
    }
    getOpts(body, headers = {}, method = "POST") {
        return {
            method,
            headers: {
                ...this.headers,
                Referer: this.origin,
                Origin: this.origin,
                ...headers,
            },
            body,
            ...this.fetchOpts,
        };
    }
    isErrorRes(res, data) {
        return (res.status > 399 ||
            Object.hasOwn(data, "message") ||
            Object.hasOwn(data, "description"));
    }
    async request(path, body = null, headers = {}, method = "POST") {
        const options = this.getOpts(body, headers, method);
        if (body instanceof FormData) {
            delete options.headers["Content-Type"];
        }
        try {
            const baseOrigin = path.includes("/sessions")
                ? this.sessionUrl
                : this.apiUrl;
            const origin = path.includes("/ocr") ? this.ocrUrl : baseOrigin;
            const res = await this.fetch(`${origin}${path}`, options);
            const data = (await res.json());
            if (this.isErrorRes(res, data)) {
                throw new ProviderError(data.message ?? res.statusText);
            }
            return {
                success: true,
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
    async scanByBlob(data) {
        const { id: sid } = await this.getSession();
        const body = new FormData();
        body.append("file", data, "image");
        const params = this.getParams("tr-image", {
            sid,
            lang: "*",
            rotate: "auto",
        });
        const res = await this.request(`/ocr/v1.1/recognize?${params}`, body);
        if (!this.isSuccessProviderRes(res)) {
            throw new OCRError("Failed to request OCR", res);
        }
        let resultData = res.data.data;
        const textToTranslate = [];
        let blocks = resultData.blocks.map((block) => {
            const text = block.boxes.map((box) => box.text).join(" ");
            textToTranslate.push(text);
            return {
                ...block,
                text,
            };
        });
        const text = blocks.map((block) => block.text).join("\n");
        const result = {
            ...resultData,
            blocks,
            text,
        };
        if (!this.withTranslate) {
            return result;
        }
        const translateData = await this.translate(textToTranslate, `${resultData.detected_lang}-${this.translateLang}`);
        blocks = blocks.map((block, idx) => {
            return {
                ...block,
                translatedText: translateData.translations?.[idx],
            };
        });
        const translatedText = blocks
            .map((block) => block.translatedText)
            .join("\n");
        return {
            ...resultData,
            blocks,
            text,
            translatedText,
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
