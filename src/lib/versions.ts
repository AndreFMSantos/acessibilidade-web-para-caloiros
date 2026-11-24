export const versions = [
  { name: '', filter: false, contrast: false, status: false },
  { name: 'filtro', filter: true, contrast: false, status: false },
  { name: 'contraste', filter: false, contrast: true, status: false },
  { name: 'carrinho', filter: false, contrast: false, status: true },
  { name: 'corrigida', filter: true, contrast: true, status: true },
] as const;

export function cataloguePath(version: string): string {
  return version ? `/${version}` : '/';
}

export function productPath(id: string, version: string): string {
  return `${version ? `/${version}` : ''}/jogos/${encodeURIComponent(id)}`;
}
