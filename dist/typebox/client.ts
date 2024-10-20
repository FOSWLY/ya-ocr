import { ClientType } from "@toil/translate/types";
import { supportedTypes } from "@/consts";
import { OCRBlock, OCRData } from "./yandex";

import { Type, Static } from '@sinclair/typebox'


export type SupportedType = Static<typeof SupportedType>
export const SupportedType = Type.Index((typeof supportedTypes), Type.Number())

export type OCROpts = Static<typeof OCROpts>
export const OCROpts = Type.Object({
host: Type.Optional(Type.String()),
withTranslate: Type.Optional(Type.Boolean()),
translateLang: Type.Optional(ClientType.Lang),
fetchFn: Type.Optional(ClientType.FetchFunction),
fetchOpts: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
headers: Type.Optional(Type.Record(Type.String(), Type.String()))
})

export type OCRFullBlock = Static<typeof OCRFullBlock>
export const OCRFullBlock = Type.Composite([OCRBlock, Type.Object({
text: Type.String(),
translatedText: Type.Optional(Type.String())
})])

export type OCRFullData = Static<typeof OCRFullData>
export const OCRFullData = Type.Composite([OCRData, Type.Object({
text: Type.String(),
translatedText: Type.Optional(Type.String()),
blocks: Type.Array(OCRFullBlock)
})])