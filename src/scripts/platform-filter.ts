import { element } from './dom';

export function initPlatformFilter(setPlatform: (value: string) => void) {
  const trigger = document.querySelector('[data-platform-trigger]');
  const options = document.querySelector('[data-platform-options]');
  if (trigger instanceof HTMLElement && options instanceof HTMLElement) {
    trigger.addEventListener('click', () => {
      options.hidden = !options.hidden;
    });
    options.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      const value = event.target.dataset.platformOption;
      if (!value) return;
      element('#platform-value', HTMLSpanElement).textContent = value;
      options.hidden = true;
      setPlatform(value);
    });
    document.addEventListener('click', (event) => {
      if (
        event.target instanceof Node &&
        !trigger.contains(event.target) &&
        !options.contains(event.target)
      )
        options.hidden = true;
    });
  }
}
