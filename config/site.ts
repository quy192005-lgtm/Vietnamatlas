export const SITE_NAME = "Vietnam Atlas";
export const SITE_TAGLINE = "Places, routes and practical guides for travelling Vietnam";
export const SITE_URL = ""; // TODO: fill with custom domain once deployed
export const ADS_ENABLED = false; // Set to true after Google AdSense approval

// NV-12: Community Photo Submission via Google Form
export const PHOTO_FORM_URL: string = "#"; // TODO: dán link Google Form thật
export const PHOTO_FORM_PLACE_FIELD: string = ""; // TODO: mã entry của ô "Place name" trong form, để trống nếu chưa biết

/**
 * Builds the pre-filled Google Form URL for photo contribution.
 * Returns null if PHOTO_FORM_URL is "#" or empty (photo contribution is disabled).
 */
export function getPhotoSubmissionUrl(placeNameEn?: string): string | null {
  if (!PHOTO_FORM_URL || PHOTO_FORM_URL.trim() === "#" || PHOTO_FORM_URL.trim() === "") {
    return null;
  }

  const base = PHOTO_FORM_URL.trim();
  const field = PHOTO_FORM_PLACE_FIELD.trim();
  if (placeNameEn && field !== "") {
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}usp=pp_url&${encodeURIComponent(field)}=${encodeURIComponent(
      placeNameEn
    )}`;
  }

  return base;
}
