import type { LegalStatus, PropertyType, RegionId } from "./data";

export type ListingFilter = {
  region: RegionId | "all";
  type?: PropertyType;
  status?: LegalStatus;
};

const EVENT = "luxea:filter";

/** Ask the listing grid to apply a filter, then scroll to it. */
export function applyListingFilter(filter: ListingFilter) {
  window.dispatchEvent(new CustomEvent<ListingFilter>(EVENT, { detail: filter }));
  document.getElementById("listings")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function onListingFilter(handler: (filter: ListingFilter) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<ListingFilter>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
