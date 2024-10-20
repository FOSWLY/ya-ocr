import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileTypeFromBuffer } from "file-type";
import { YandexTranslateProvider } from "@toil/translate/providers";
import {
  BaseProviderType,
  ClientType,
  YandexTranslateProviderType,
} from "@toil/translate/types";
import { ProviderError } from "@toil/translate/errors";

import { OCRFullBlock, OCRFullData, OCROpts } from "@/types/client";
import { OCRSuccessResponse } from "@/types/yandex";
import { supportedTypes } from "@/consts";

class OCRError extends Error {
  constructor(
    message: string,
    public data: unknown = undefined,
  ) {
    super(message);
    this.name = "OCRError";
    this.message = message;
  }
}

export default class OCRClient extends YandexTranslateProvider {
  withTranslate: boolean;
  translateLang: ClientType.Lang;
  ocrUrl = "https://translate.yandex.net";

  /**
   * If you don't want to use the classic fetch
   * @includeExample examples/with_ofetch.ts:1-13
   */
  constructor(params: OCROpts = {}) {
    super(params);
    this.withTranslate = params.withTranslate ?? false;
    this.translateLang = params.translateLang ?? this.baseLang;
  }

  getOpts<T = URLSearchParams>(
    body: T | null,
    headers: Record<string, string> = {},
    method: BaseProviderType.RequestMethod = "POST",
  ) {
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

  isErrorRes<T extends object>(
    res: Response,
    data: T | YandexTranslateProviderType.FailedResponse,
  ): data is YandexTranslateProviderType.FailedResponse {
    return (
      res.status > 399 ||
      Object.hasOwn(data, "message") || // for translation
      Object.hasOwn(data, "description") // for ocr
    );
  }

  async request<T extends object, B = URLSearchParams>(
    path: string,
    body: B | null = null,
    headers: Record<string, string> = {},
    method: BaseProviderType.RequestMethod = "POST",
  ): Promise<BaseProviderType.ProviderResponse<T>> {
    const options = this.getOpts<B>(body, headers, method) as {
      method: BaseProviderType.RequestMethod;
      headers: Record<string, string>;
      body: T | null;
    };
    if (body instanceof FormData) {
      delete options.headers["Content-Type"];
    }

    try {
      const baseOrigin = path.includes("/sessions")
        ? this.sessionUrl
        : this.apiUrl;
      const origin = path.includes("/ocr") ? this.ocrUrl : baseOrigin;
      const res = await this.fetch(`${origin}${path}`, options);
      const data = (await res.json()) as T;
      if (this.isErrorRes<T>(res, data)) {
        throw new ProviderError(data.message ?? res.statusText);
      }

      return {
        success: true,
        data,
      };
    } catch (err) {
      return {
        success: false,
        data: (err as Error)?.message,
      };
    }
  }

  async scanByBlob(data: Blob | File) {
    const { id: sid } = await this.getSession();
    const body = new FormData();
    body.append("file", data, "image");

    const params = this.getParams("tr-image", {
      sid,
      lang: "*", // autodetect language
      rotate: "auto",
    });
    const res = await this.request<OCRSuccessResponse, FormData>(
      `/ocr/v1.1/recognize?${params}`,
      body,
    );

    if (!this.isSuccessProviderRes<OCRSuccessResponse>(res)) {
      throw new OCRError("Failed to request OCR", res);
    }

    let resultData = res.data.data;

    const textToTranslate: string[] = [];

    let blocks: OCRFullBlock[] = resultData.blocks.map((block) => {
      const text = block.boxes.map((box) => box.text).join(" ");
      textToTranslate.push(text);
      return {
        ...block,
        text,
      };
    });

    const text = blocks.map((block) => block.text).join("\n");
    const result: OCRFullData = {
      ...resultData,
      blocks,
      text,
    };

    if (!this.withTranslate) {
      return result;
    }

    const translateData = await this.translate(
      textToTranslate,
      `${resultData.detected_lang}-${this.translateLang}`,
    );

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

  async scanByFile(filepath: string) {
    const fullpath = path.resolve(__dirname, filepath);
    let buffer: Buffer | null = null;
    try {
      buffer = await readFile(fullpath);
    } catch (err: unknown) {
      switch ((err as Error)?.name) {
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

    const arrayBuffer = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    ) as ArrayBuffer;

    const fileType = await fileTypeFromBuffer(arrayBuffer);
    if (!fileType || !supportedTypes.includes(fileType.mime)) {
      throw new OCRError(`Unsupported file type: ${fileType?.mime}`);
    }

    return await this.scanByBlob(
      new Blob([arrayBuffer], { type: fileType.mime }) as Blob,
    );
  }

  async scanByUrl(url: string, headers: Record<string, string> = {}) {
    if (!URL.canParse(url)) {
      throw new OCRError(`${url} isn't a valid URL`);
    }

    const fileUrl = new URL(url) as URL;

    const res = await this.fetch(fileUrl, {
      headers: {
        ...this.headers,
        ...headers,
      },
      ...this.fetchOpts,
    });

    const data = (await res.blob()) as Blob;
    return await this.scanByBlob(data);
  }
}
