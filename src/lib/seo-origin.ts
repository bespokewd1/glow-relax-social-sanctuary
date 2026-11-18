import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestUrl } from "@tanstack/react-start/server";

// Cards ship with each deployment, which can differ from the canonical domain.
// Read per request so SSR and client navigation agree without global host state.
export const getSocialImageOrigin = createIsomorphicFn()
  .server(() => getRequestUrl().origin)
  .client(() => window.location.origin);
