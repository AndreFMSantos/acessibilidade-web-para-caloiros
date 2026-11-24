export function element<T extends Element>(selector: string, constructor: { new (): T }): T {
  const node = document.querySelector(selector);
  if (!(node instanceof constructor)) throw new Error(`Elemento em falta: ${selector}`);
  return node;
}

export function showError(message: string) {
  const error = element('#api-error', HTMLParagraphElement);
  error.textContent = message;
  error.hidden = false;
}
