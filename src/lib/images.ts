import { SITE } from "@/lib/site";

/** Image slot widths follow container-site padding, grid gaps and breakpoints. */
export const IMAGE_SIZES = {
  twoColumn:
    "(min-width: 1216px) 560px, (min-width: 768px) calc(50vw - 3rem), calc(100vw - 2.5rem)",
  pageHeader:
    "(min-width: 1216px) 556px, (min-width: 1024px) calc(50vw - 3.25rem), (min-width: 768px) calc(100vw - 4rem), calc(100vw - 2.5rem)",
  massageCard:
    "(min-width: 1216px) 363px, (min-width: 1024px) calc(33.333vw - 2.667rem), (min-width: 768px) calc(50vw - 3rem), (min-width: 640px) calc(50vw - 2.25rem), calc(100vw - 2.5rem)",
  blogCard:
    "(min-width: 1216px) 258px, (min-width: 1024px) calc(25vw - 2.875rem), (min-width: 768px) calc(50vw - 3.25rem), (min-width: 640px) calc(50vw - 2.5rem), calc(100vw - 2.5rem)",
  article: "(min-width: 768px) 704px, calc(100vw - 2.5rem)",
  fullWidth:
    "(min-width: 1216px) 1152px, (min-width: 768px) calc(100vw - 4rem), calc(100vw - 2.5rem)",
  stillLife: "(min-width: 1216px) 460px, calc(41.667vw - 2.917rem)",
} as const;

/** Request the crop the layout actually displays, rather than discard pixels in CSS. */
export function responsiveImage(
  source: string,
  sizes: string,
  ratio: number,
  widths = [320, 480, 640, 768, 960, 1200],
) {
  const url = new URL(source, SITE.url);
  if (url.hostname !== "images.unsplash.com") return { src: source };

  const candidate = (width: number) => {
    const image = new URL(url);
    image.searchParams.set("w", String(width));
    image.searchParams.set("h", String(Math.round(width / ratio)));
    image.searchParams.set("fit", "crop");
    return image.toString();
  };

  return {
    src: candidate(768),
    srcSet: widths.map((width) => `${candidate(width)} ${width}w`).join(", "),
    sizes,
  };
}
