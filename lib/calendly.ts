const CALENDLY_SCRIPT =
  "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_CSS =
  "https://assets.calendly.com/assets/external/widget.css";

let loadingPromise: Promise<void> | null = null;

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

function loadStylesheet(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export function loadCalendly(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadStylesheet(CALENDLY_CSS);

  loadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Calendly"));
    document.head.appendChild(script);
  });

  return loadingPromise;
}

export function openCalendlyPopup(url: string) {
  if (!url) {
    console.warn("NEXT_PUBLIC_CALENDLY_URL is not configured");
    return;
  }

  void loadCalendly().then(() => {
    window.Calendly?.initPopupWidget({ url });
  });
}
