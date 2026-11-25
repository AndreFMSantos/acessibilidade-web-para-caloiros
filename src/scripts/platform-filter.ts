import { element } from './dom';

export function initPlatformFilter(setPlatform: (value: string) => void) {
  const select = element('#platform', HTMLSelectElement);
  select.addEventListener('change', () => setPlatform(select.value));
}
