export function element<T extends Element>(selector: string, elementType: { new (): T }): T {
  const node = document.querySelector(selector);
  if (!(node instanceof elementType)) throw new Error(`Elemento em falta: ${selector}`);
  return node;
}

export function showError(message: string) {
  const error = element('#api-error', HTMLParagraphElement);
  error.textContent = message;
  error.hidden = false;
}
