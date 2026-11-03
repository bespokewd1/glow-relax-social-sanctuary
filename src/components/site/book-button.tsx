import { useState, type ReactNode } from "react";
import { SITE } from "@/lib/site";

/** Online booking isn't live yet: clicking shows "Coming Soon" and a call link. */
export function BookButton({ className = "btn btn-primary", children = "Book Appointment" }: { className?: string; children?: ReactNode }) {
  const [shown, setShown] = useState(false);
  if (shown) {
    return (
      <a href={SITE.phoneHref} className={className} aria-live="polite">
        Coming Soon — Call {SITE.phoneDisplay}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={() => setShown(true)}>
      {children}
    </button>
  );
}
