export function cataloguePath(): string {
  return '/';
}
export function productPath(id: string): string {
  return `/jogos/${encodeURIComponent(id)}`;
}
