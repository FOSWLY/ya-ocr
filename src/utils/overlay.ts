import { imageDimensionsFromData } from "image-dimensions";

import { OCRFullBlock, OCRFullBox } from "@/types/client";
import { escapeXml, formatNumber, getTextWidth, toRgba } from "./text";
import { Point } from "@/types/overlay";
import { NUM_DOTS, SMOOTHING } from "@/consts";

const getFunctionValue = (box: OCRFullBox, value: number) =>
  box.polyCoefs.a3 * value ** 3 +
  box.polyCoefs.a2 * value ** 2 +
  box.polyCoefs.a1 * value +
  box.polyCoefs.a0;

const makePathPoint = (box: OCRFullBox, value: number): Point => {
  const result = getFunctionValue(box, value);
  return box.polyCoefs.fromXtoY
    ? { x: value, y: result }
    : { x: result, y: value };
};

const constructPoints = (box: OCRFullBox) => {
  const start = box.polyCoefs.fromXtoY ? box.x : box.y;
  const width = box.polyCoefs.fromXtoY ? box.w : box.h;
  const step = width / NUM_DOTS;
  const points = [makePathPoint(box, start)];

  for (let index = 1; index <= NUM_DOTS; index += 1) {
    points.push(makePathPoint(box, start + step * index));
  }

  return points;
};

const getBezierFragment = (point: Point, index: number, points: Point[]) => {
  const previousPoint = points[index - 1]!;
  const startControlPoint = getControlPoint(
    previousPoint,
    points[index - 2],
    point,
    false,
  );
  const endControlPoint = getControlPoint(
    point,
    previousPoint,
    points[index + 1],
    true,
  );

  return ` C ${formatNumber(startControlPoint.x)} ${formatNumber(startControlPoint.y)}, ${formatNumber(endControlPoint.x)} ${formatNumber(endControlPoint.y)}, ${formatNumber(point.x)} ${formatNumber(point.y)}`;
};

const getControlPoint = (
  point: Point,
  previousPoint: Point | undefined,
  nextPoint: Point | undefined,
  reverse: boolean,
): Point => {
  const start = previousPoint ?? point;
  const end = nextPoint ?? point;
  const line = getLineFromPoints(start, end);
  const angle = line.angle + (reverse ? Math.PI : 0);
  const length = line.length * SMOOTHING;

  return {
    x: point.x + Math.cos(angle) * length,
    y: point.y + Math.sin(angle) * length,
  };
};

const getLineFromPoints = (start: Point, end: Point) => {
  const x = end.x - start.x;
  const y = end.y - start.y;

  return {
    length: Math.sqrt(x ** 2 + y ** 2),
    angle: Math.atan2(y, x),
  };
};

const getBgPath = (box: OCRFullBox) => {
  const points = constructPoints(box);
  let path = "";

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index]!;
    if (index === 0) {
      path += `M ${formatNumber(point.x)} ${formatNumber(point.y)}`;
      continue;
    }

    path += getBezierFragment(point, index, points);
  }

  return path;
};

const getOverlayText = (box: OCRFullBox) => {
  const text = box.translatedText ?? box.text;
  return text.trim();
};

const getLineLength = (box: OCRFullBox) =>
  box.polyCoefs.fromXtoY ? box.w : box.h;

const getFontSize = (box: OCRFullBox) => {
  const text = getOverlayText(box);
  if (!text) {
    return Math.max(1, Math.floor(box.h * 0.8));
  }

  return Math.max(1, Math.floor(box.polyCoefs.hh * 0.92));
};

const renderBox = (idx: number, box: OCRFullBox) => {
  const text = getOverlayText(box);
  if (!text) {
    return "";
  }

  const fontSize = getFontSize(box);
  const bgWidth = Math.round(box.polyCoefs.hh * 1.3);
  const bgPath = getBgPath(box);
  const measuredTextLength = getTextWidth(text, fontSize);
  const availableTextLength = getLineLength(box) * 0.94;
  const textLength = formatNumber(
    Math.min(
      Math.max(measuredTextLength, availableTextLength),
      getLineLength(box),
    ),
  );

  return `
    <g>
      <path id="path-${idx}" fill="transparent" d="${bgPath}" stroke="${toRgba(box.backgroundColor)}" stroke-width="${bgWidth}" stroke-linecap="round" stroke-linejoin="round" />
      <text dy="0.3em" fill="${toRgba(box.textColor)}" font-family="sans-serif" font-size="${fontSize}" lengthAdjust="spacingAndGlyphs" textLength="${textLength}">
        <textPath href="#path-${idx}" lengthAdjust="spacingAndGlyphs">${escapeXml(text)}</textPath>
      </text>
    </g>`;
};

export async function getOverlay(imageBlob: Blob, blocks: OCRFullBlock[]) {
  const imageData = await imageBlob.bytes();
  const image = imageDimensionsFromData(imageData);
  if (!image) {
    throw new Error("Failed to get image dimensions");
  }

  const imageBase64 = imageData.toBase64();
  const boxes = blocks.flatMap((block) => block.boxes);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${image.width}" height="${image.height}" viewBox="0 0 ${image.width} ${image.height}">
  <image href="data:image/jpeg;base64,${imageBase64}" width="${image.width}" height="${image.height}" />${boxes.map((box, idx) => renderBox(idx, box)).join("")}
</svg>
`;
}
