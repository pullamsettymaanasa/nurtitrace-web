export const config = {
  apiUrl: "/api",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "NutriTrace",
} as const;

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${config.apiUrl}/uploads/${imagePath}`;
}
