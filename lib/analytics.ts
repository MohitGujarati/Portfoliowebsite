type Gtag = (command: 'event', name: string, params?: Record<string, string>) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function trackPetClick() {
  window.gtag?.('event', 'software_pet_click', {
    interaction: 'click',
    surface: 'portfolio_pet',
  });
}

export {};
