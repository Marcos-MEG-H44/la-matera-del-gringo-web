/**
 * Utilidades de sanitización y seguridad para entradas de usuario
 * Previene inyecciones de scripts (XSS) y contenido malicioso
 */

export function sanitizeText(input = "") {
  if (typeof input !== "string") return "";
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:[^"']*/gi, "")
    .replace(/onload|onerror|onclick|onmouseover/gi, "")
    .trim();
}

export function sanitizeUrl(url = "") {
  if (typeof url !== "string") return "";
  const trimmed = url.trim();
  
  // Acepta URLs locales que empiezan con / o URLs seguras http/https o data:image
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("data:image/")
  ) {
    return trimmed;
  }
  
  return "";
}
