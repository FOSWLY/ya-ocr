import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileTypeFromBuffer } from "file-type";

import config from "./config/config";
import { fetchWithTimeout, getTimestamp } from "./utils/utils";
import {
  ClientResponse,
  FetchFunction,
  OCRFullBlock,
  OCRFullData,
  OCROpts,
} from "./types/client";
import {
  OCRResponse,
  OCRSuccessResponse,
  Session,
  SessionResponse,
  Srv,
} from "./types/yandex";
import { genYandexMetrikaUID, genYandexUID } from "./secure";
import { supportedTypes } from "./consts";

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

export default class OCRClient {
  host: string;

  /**
   * If you don't want to use the classic fetch
   * @includeExample examples/with_ofetch.ts:1-13
   */
  fetch: FetchFunction;
  fetchOpts: Record<string, unknown>;
  userAgent: string = config.userAgent;

  /**
   * Headers for interacting with Yandex API
   */
  headers: Record<string, string> = {
    "User-Agent": this.userAgent,
  };

  session: Session | null = null;

  constructor({
    fetchFn = fetchWithTimeout,
    fetchOpts = {},
    headers = {},
  }: OCROpts = {}) {
    this.host = "https://translate.yandex.net";
    this.fetch = fetchFn;
    this.fetchOpts = fetchOpts;
    this.headers = { ...this.headers, ...headers };
  }

  getOpts(body: unknown, headers: Record<string, string> = {}) {
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

  getSecure(srv: Srv) {
    return {
      srv,
      yu: genYandexUID(),
      yum: genYandexMetrikaUID(),
    };
  }

  /**
   * The standard method for requesting the Yandex API, if necessary, you can override how it is done in the example
   */
  async request<T = unknown>(
    path: string,
    body: unknown,
    headers: Record<string, string> = {},
  ): Promise<ClientResponse<T>> {
    const options: any = this.getOpts(body, headers);

    try {
      const res = await this.fetch(`${this.host}${path}`, options);
      const data = (await res.json()) as T;
      return {
        success: res.status === 200,
        data,
      };
    } catch (err: unknown) {
      return {
        success: false,
        data: (err as Error)?.message,
      };
    }
  }

  async getSession() {
    const timestamp = getTimestamp();
    if (
      this.session &&
      this.session.creationTimestamp + this.session.maxAge > timestamp
    ) {
      return this.session;
    }

    return (this.session = await this.createSession());
  }

  async createSession() {
    const res = await this.request<SessionResponse>(
      "/props/api/v1.0/sessions?" +
        new URLSearchParams(this.getSecure("tr-text")).toString(),
      null,
    );

    if (!res.success) {
      throw new OCRError("Failed to request create session", res);
    }

    return res.data.session;
  }

  async scanByBlob(data: Blob | File) {
    const { id: sid } = await this.getSession();
    const body = new FormData();
    body.append("file", data, "test");

    const res = await this.request<OCRResponse>(
      "/ocr/v1.1/recognize?" +
        new URLSearchParams({
          sid,
          lang: "*", // autodetect language
          rotate: "auto",
          ...this.getSecure("tr-image"),
        }).toString(),
      body,
    );

    if (!res.success) {
      throw new OCRError("Failed to request OCR", res);
    }

    const blocks: OCRFullBlock[] = (
      res.data as OCRSuccessResponse
    ).data.blocks.map((block) => {
      const text = block.boxes.map((box) => box.text).join(" ");
      return {
        ...block,
        text,
      };
    });

    const text = blocks.map((block) => block.text).join("\n");
    const result: OCRFullData = {
      ...(res.data as OCRSuccessResponse).data,
      blocks,
      text,
    };

    return {
      status: res.success,
      data: result,
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
