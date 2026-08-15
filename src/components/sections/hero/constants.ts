/** Shared hero widget constants. */

export const FLUENT_3D =
  "https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets";

/**
 * Build a Fluent Emoji 3D asset URL from a pack folder + file base name.
 * The folder is sentence-case (e.g. "Busts in silhouette"); we URL-encode
 * the space so callers can pass the label as-is.
 */
export const fluent = (folder: string, fileBase: string) =>
  `${FLUENT_3D}/${encodeURIComponent(folder)}/3D/${fileBase}_3d.png`;
