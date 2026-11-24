export function initPlatformFilter(setPlatform: (value: string) => void) {
  document.querySelector('[data-platform-select]')?.addEventListener('change', (event) => {
    if (event.target instanceof HTMLSelectElement) setPlatform(event.target.value);
  });
}
