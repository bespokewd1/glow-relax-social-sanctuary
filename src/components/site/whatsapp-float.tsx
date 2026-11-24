import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { SITE, whatsappUrl } from "@/lib/site";

const DISMISS_KEY = "glow-relax-wa-dismissed";

export function WhatsAppIcon({ className = "h-5 w-5 shrink-0" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2Zm5.82 14.01c-.24.69-1.41 1.32-1.95 1.4-.5.08-1.14.11-1.84-.11-.42-.14-.97-.32-1.67-.62-2.93-1.26-4.85-4.21-5-4.41-.14-.2-1.19-1.59-1.19-3.03 0-1.44.75-2.15 1.02-2.44.27-.29.59-.37.78-.37h.57c.18 0 .43-.07.67.51.25.6.84 2.06.92 2.21.07.15.12.32.02.52-.1.2-.15.32-.29.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.47.12.64-.07.17-.2.74-.86.93-1.16.2-.3.39-.25.66-.15.27.1 1.72.81 2.02.96.29.15.49.22.56.34.07.12.07.72-.17 1.4Z" />
    </svg>
  );
}

export function WhatsAppFloat() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
      if (!dismissed && window.innerWidth >= 768) {
        setOpen(true);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // ignore storage errors
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {open && (
        <div role="dialog" aria-label="Welcome to Glow and Relax WhatsApp chat" className="w-[min(21rem,calc(100vw-2rem))] overflow-hidden rounded-lg border bg-card shadow-xl">
          <div className="flex items-start justify-between gap-3 bg-primary px-4 py-3.5 text-primary-foreground">
            <div>
              <p className="font-display text-xl leading-tight">Welcome to {SITE.name}</p>
              <p className="mt-0.5 text-xs opacity-85">{SITE.tagline}</p>
            </div>
            <button type="button" onClick={handleClose} aria-label="Close WhatsApp welcome message" className="rounded p-1 opacity-80 transition-opacity hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4">
            <p className="rounded-md bg-secondary/50 p-3 text-sm leading-relaxed text-foreground">
              Offering massage, brow, lash and permanent lip-colour services in a welcoming studio inside Marina Mall, Cold Lake. How can we help?
            </p>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-3 w-full">
              <WhatsAppIcon className="h-4 w-4 shrink-0" /> Message Us on WhatsApp
            </a>
            <p className="mt-2 text-center text-xs text-muted-foreground">WhatsApp: {SITE.whatsapp.display}</p>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? "Hide WhatsApp chat" : "Open WhatsApp chat"}
        className="inline-flex h-13 items-center gap-2 rounded-full bg-whatsapp px-4 text-sm font-bold text-whatsapp-foreground shadow-lg transition-transform hover:scale-[1.02] hover:bg-primary"
      >
        <WhatsAppIcon className="h-5 w-5 shrink-0" />
        <span className="hidden sm:inline">WhatsApp</span>
      </button>
    </div>
  );
}