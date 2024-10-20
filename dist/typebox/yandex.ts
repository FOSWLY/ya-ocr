import { Type, Static } from '@sinclair/typebox'


export type ErrorType = Static<typeof ErrorType>
export const ErrorType = Type.Union([
Type.Literal("BadArgument"),
Type.Literal("UnsupportedImageType"),
Type.Literal("BadRequest")
])

export type OCRFailedResponse = Static<typeof OCRFailedResponse>
export const OCRFailedResponse = Type.Object({
error: ErrorType,
description: Type.String()
})

export type OCRPoint = Static<typeof OCRPoint>
export const OCRPoint = Type.Object({
x: Type.Number(),
y: Type.Number()
})

export type Color = Static<typeof Color>
export const Color = Type.Object({
a: Type.Number(),
b: Type.Number(),
r: Type.Number(),
x: Type.Number(),
y: Type.Number(),
g: Type.Number(),
Points: Type.Array(OCRPoint)
})

export type PolyCoefs = Static<typeof PolyCoefs>
export const PolyCoefs = Type.Object({
a3: Type.Number(),
a2: Type.Number(),
a1: Type.Number(),
a0: Type.Number(),
fromXtoY: Type.Boolean(),
hh: Type.Number()
})

export type Word = Static<typeof Word>
export const Word = Type.Object({
x: Type.Number(),
y: Type.Number(),
w: Type.Number(),
h: Type.Number(),
polyCoefs: PolyCoefs,
text: Type.String()
})

export type OCRBox = Static<typeof OCRBox>
export const OCRBox = Type.Object({
x: Type.Number(),
y: Type.Number(),
w: Type.Number(),
h: Type.Number(),
backgroundColor: Color,
textColor: Color,
polyCoefs: PolyCoefs,
text: Type.String(),
orientation: Type.Number(),
line_size_category: Type.Number(),
words: Type.Array(Word)
})

export type OCRBlock = Static<typeof OCRBlock>
export const OCRBlock = Type.Object({
angle: Type.Number(),
x: Type.Number(),
y: Type.Number(),
w: Type.Number(),
h: Type.Number(),
rx: Type.Number(),
ry: Type.Number(),
rw: Type.Number(),
rh: Type.Number(),
boxes: Type.Array(OCRBox)
})

export type OCRData = Static<typeof OCRData>
export const OCRData = Type.Object({
detected_lang: Type.String(),
rotate: Type.Number(),
blocks: Type.Array(OCRBlock),
tables: Type.Array(Type.Unknown())
})

export type OCRSuccessResponse = Static<typeof OCRSuccessResponse>
export const OCRSuccessResponse = Type.Object({
status: Type.Literal("success"),
data: OCRData,
request_id: Type.String()
})

export type OCRResponse = Static<typeof OCRResponse>
export const OCRResponse = Type.Union([
OCRSuccessResponse,
OCRFailedResponse
])