/** Parcel from the parcel asset sheet: plain, or damaged (red crack on the front face). */
export function ParcelArt({ damaged }: { damaged: boolean }) {
  return (
    <svg viewBox="-10 -10 20 20" aria-hidden="true" className="size-full overflow-visible">
      <path d="M0-9 9-4.5v9L0 9-9 4.5v-9z" fill="#C49F6E" />
      <path d="M0-9 9-4.5 0 0-9-4.5z" fill="#D9B98C" />
      <path d="M0 0v9L-9 4.5v-9z" fill="#B88F5C" />
      <path d="M-4.5-6.75 4.5-2.25v2.2L-4.5-4.6z" fill="#EFE6D2" />
      {damaged && (
        <path d="M2 1l2 2-1.5 1.5 2 2" fill="none" stroke="#D1495B" strokeWidth={1.3} strokeLinecap="round" />
      )}
    </svg>
  );
}
