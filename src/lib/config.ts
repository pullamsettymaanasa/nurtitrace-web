export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "NutriTrace",
} as const;

export function getImageUrl(imagePath: string): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("http")) return imagePath;
  return `${config.apiUrl}/uploads/${imagePath}`;
}
