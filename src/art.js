// Small, self-contained drawings. No remote fonts or platform emoji.
const svg = (body, viewBox = '0 0 24 24', className = 'ui-icon') =>
  `<svg class="${className}" viewBox="${viewBox}" fill="none" aria-hidden="true" focusable="false">${body}</svg>`;

export function icon(name) {
  const paths = {
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
    sound: '<path d="m11 4-5 4H3v8h3l5 4V4Zm4 4c2 2 2 6 0 8m3-11c4 4 4 10 0 14"/>',
    muted: '<path d="m11 4-5 4H3v8h3l5 4V4Zm5 5 5 6m0-6-5 6"/>',
    family: '<path d="m3 10 9-7 9 7v10H3V10Zm6 10v-7h6v7"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    leaf: '<path d="M5 19C0 6 12 3 21 3c0 10-5 17-16 16Zm0 0L16 8m-6 6v-4m0 4h5"/>',
    spark: '<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z"/>',
    heart: '<path d="M12 20 4 12C-2 5 8 0 12 7c4-7 14-2 8 5l-8 8Z"/>',
  };
  return svg(`<g stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.spark}</g>`);
}

export function apple() {
  return svg('<path d="M34 20c-2-8-1-12 3-15" stroke="#684b32" stroke-width="4" stroke-linecap="round"/><path d="M36 15c3-12 16-11 20-9-4 9-11 12-20 9" fill="#648b50"/><path d="M33 20C13 10 4 28 10 44c5 16 13 18 23 14 10 4 18 2 23-14 6-16-3-34-23-24Z" fill="#ca634c"/><path d="M33 23c-12-6-21 2-20 13" stroke="#f2b18f" stroke-width="4" stroke-linecap="round"/><path d="M49 29c3 10 0 19-7 23" stroke="#b44e3d" stroke-width="3" stroke-linecap="round"/>', '0 0 66 66', 'apple-art');
}

export function firefly() {
  return svg('<ellipse cx="18" cy="17" rx="9" ry="5" transform="rotate(35 18 17)" fill="#dde3c3"/><ellipse cx="30" cy="17" rx="9" ry="5" transform="rotate(-35 30 17)" fill="#dde3c3"/><circle cx="24" cy="27" r="10" fill="#ecd489" opacity=".4"/><ellipse cx="24" cy="25" rx="5" ry="9" fill="#f0d077"/><circle cx="24" cy="17" r="4" fill="#465e44"/>', '0 0 48 48', 'firefly-art');
}
