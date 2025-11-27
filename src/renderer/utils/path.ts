// Cross-platform path helpers for renderer (no Node dependency)

/**
 * Normalize path separators and return the last segment.
 */
export function getBaseName(filePath: string): string {
  if (!filePath) return '';
  const normalized = filePath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  return parts[parts.length - 1] || '';
}

/**
 * Return the filename without its extension.
 */
export function getFileStem(filePath: string): string {
  const base = getBaseName(filePath);
  const dotIndex = base.lastIndexOf('.');
  return dotIndex === -1 ? base : base.slice(0, dotIndex);
}
