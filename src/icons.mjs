const paths = {
  arrow: '<path d="M4 12h15M13 5l7 7-7 7"/>',
  phone:
    '<path d="m5 3 4 1 1 5-3 2c2 3 3 4 6 6l2-3 5 1 1 4c-1 5-9 1-13-3S0 4 5 3Z"/>',
  menu: '<path class="menu-line-top" d="M4 7h16"/><path class="menu-line-bottom" d="M4 17h16"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  masonry: '<path d="M3 5h18v14H3ZM3 12h18M9 5v7M15 12v7"/>',
  partition: '<path d="M4 20V4h16v16M9 4v16M15 20v-8h5"/>',
  tiling: '<path d="M3 3h18v18H3ZM3 12h18M12 3v18"/>',
  external: '<path d="M14 3h7v7M21 3 11 13M10 3H3v18h18v-7"/>',
};

export function icon(name) {
  if (!Object.hasOwn(paths, name)) throw new Error(`Unknown icon: ${name}`);
  return `<svg class="icon icon-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
}
