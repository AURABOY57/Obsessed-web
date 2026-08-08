export function isVideoUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  return (
    /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i.test(url) ||
    url.includes("/video/upload/") ||
    url.startsWith("data:video/") ||
    url.includes("resource_type=video")
  );
}
