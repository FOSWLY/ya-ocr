import { supportedTypes } from "../consts";
import { OCRBlock, OCRData } from "./yandex";

import { Type, Static, TSchema } from '@sinclair/typebox'


export type FetchFunction = Static<typeof FetchFunction>
export const FetchFunction = Type.Function([Type.Union([
Type.String(),
Type.Never(),
Type.Never()
]), Type.Optional(Type.Any())], Type.Promise(Type.Never()))

export type SupportedType = Static<typeof SupportedType>
export const SupportedType = Type.Index((typeof supportedTypes), Type.Number())

export type OCROpts = Static<typeof OCROpts>
export const OCROpts = Type.Object({
host: Type.Optional(Type.String()),
fetchFn: Type.Optional(FetchFunction),
fetchOpts: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
headers: Type.Optional(Type.Record(Type.String(), Type.String()))
})

export type ClientSuccessResponse<T extends TSchema> = Static<ReturnType<typeof ClientSuccessResponse<T>>>
export const ClientSuccessResponse = <T extends TSchema>(T: T) => Type.Object({
success: Type.Boolean(),
data: T
})

export type ClientFailedResponse = Static<typeof ClientFailedResponse>
export const ClientFailedResponse = Type.Object({
success: Type.Literal(false),
data: Type.Union([
Type.String(),
Type.Null()
])
})

export type ClientResponse<T extends TSchema> = Static<ReturnType<typeof ClientResponse<T>>>
export const ClientResponse = <T extends TSchema>(T: T) => Type.Union([
ClientFailedResponse,
ClientSuccessResponse(T)
])

export type OCRFullBlock = Static<typeof OCRFullBlock>
export const OCRFullBlock = Type.Composite([OCRBlock, Type.Object({
text: Type.String()
})])

export type OCRFullData = Static<typeof OCRFullData>
export const OCRFullData = Type.Composite([OCRData, Type.Object({
text: Type.String(),
blocks: Type.Array(OCRFullBlock)
})])