"use client";

import dynamic from "next/dynamic";

// Both are interaction-gated overlays (search trigger click / exit-intent-or-delay) —
// invisible on first paint, so keep them out of the initial JS bundle. ssr:false
// requires a Client Component boundary, hence this thin wrapper.
const SearchOverlay = dynamic(() => import("./SearchOverlay"), { ssr: false });
const LeadCapturePopup = dynamic(() => import("./LeadCapturePopup"), { ssr: false });

export default function ClientOverlays() {
  return (
    <>
      <SearchOverlay />
      <LeadCapturePopup />
    </>
  );
}
