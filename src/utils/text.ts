import { Color } from "@/types/yandex";

export const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const toRgba = (color: Color) =>
  `rgba(${color.r}, ${color.g}, ${color.b}, ${1 - color.a})`;

export const formatNumber = (value: number) => Number(value.toFixed(3));

export const getCharWidth = (char: string) => {
  if (/\s/.test(char)) {
    return 0.33;
  }

  if ((char.codePointAt(0) ?? 0) > 0xff) {
    return 0.95;
  }

  if (/[ilI|!.,:'`]/.test(char)) {
    return 0.28;
  }

  if (/[mwMW@#%&]/.test(char)) {
    return 0.85;
  }

  if (/[A-Z0-9]/.test(char)) {
    return 0.62;
  }

  return 0.54;
};

export const getTextWidth = (text: string, fontSize: number) =>
  Array.from(text).reduce(
    (width, char) => width + getCharWidth(char) * fontSize,
    0,
  );
