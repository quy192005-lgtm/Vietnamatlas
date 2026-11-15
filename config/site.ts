export const SITE_NAME = "Vietnam Atlas";
export const SITE_TAGLINE = "Places, routes and practical guides for travelling Vietnam";
export const SITE_URL = "https://vietnamatlas-three.vercel.app";
export const ADS_ENABLED = false; // Set to true after Google AdSense approval
export const CONTACT_EMAIL: string = ""; // TODO: fill with real active email (do not invent unowned domain emails)

// NV-12 & NV-13: Community Photo Submission via Google Form
export const PHOTO_FORM_URL: string =
  "https://docs.google.com/forms/d/e/1FAIpQLSedSSyHAN82tmE3R0w49ZtyeIkb1IJX3KE8wucWfYa2tqq0gQ/viewform";
export const PHOTO_FORM_PLACE_FIELD: string = ""; // Điền mã entry.xxxxx nếu muốn tự điền sẵn tên địa điểm

/**
 * Builds the Google Form URL for photo contribution.
 * If placeNameEn is provided and PHOTO_FORM_PLACE_FIELD is set, appends pre-fill parameters.
 * Returns null if PHOTO_FORM_URL is '#' or empty.
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
