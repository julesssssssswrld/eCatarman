/* ==========================================================================
   Lucide-style SVG Icon Library (vanilla JS)
   All icons match the originals used by the Next.js + lucide-react version.
   ========================================================================== */

const Icons = {
  /* Creates a base SVG element with standard attributes */
  _svg(size = 24) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    return svg;
  },

  home(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`;
    return svg;
  },

  layoutGrid(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>`;
    return svg;
  },

  alertTriangle(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>`;
    return svg;
  },

  newspaper(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>`;
    return svg;
  },

  user(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`;
    return svg;
  },

  arrowRight(size = 18) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`;
    return svg;
  },

  fileText(size = 28) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>`;
    return svg;
  },

  heartPulse(size = 28) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>`;
    return svg;
  },

  shieldCheck(size = 28) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>`;
    return svg;
  },

  phoneCall(size = 22) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/><path d="M14.05 2a9 9 0 0 1 8 7.94"/><path d="M14.05 6A5 5 0 0 1 18 10"/>`;
    return svg;
  },

  building(size = 28) {
    const svg = this._svg(size);
    svg.innerHTML = `<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>`;
    return svg;
  },

  ambulance(size = 28) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/><path d="M8 8v4"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>`;
    return svg;
  },

  flame(size = 28) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`;
    return svg;
  },

  copy(size = 20) {
    const svg = this._svg(size);
    svg.innerHTML = `<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>`;
    return svg;
  },

  info(size = 20) {
    const svg = this._svg(size);
    svg.innerHTML = `<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>`;
    return svg;
  },

  search(size = 24) {
    const svg = this._svg(size);
    svg.setAttribute("stroke-width", "2.5");
    svg.innerHTML = `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`;
    return svg;
  },

  filter(size = 20) {
    const svg = this._svg(size);
    svg.innerHTML = `<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>`;
    return svg;
  },

  fileBadge(size = 28) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M5 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M7 16.5 8 22l-3-1-3 1 1-5.5"/>`;
    return svg;
  },

  briefcase(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>`;
    return svg;
  },

  graduationCap(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>`;
    return svg;
  },

  heart(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`;
    return svg;
  },

  bus(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>`;
    return svg;
  },

  mapPin(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`;
    return svg;
  },

  mail(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`;
    return svg;
  },

  clock(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`;
    return svg;
  },

  chevronDown(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="m6 9 6 6 6-6"/>`;
    return svg;
  },

  chevronRight(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="m9 18 6-6-6-6"/>`;
    return svg;
  },

  check(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M20 6 9 17l-5-5"/>`;
    return svg;
  },

  x(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`;
    return svg;
  },

  plus(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M5 12h14"/><path d="M12 5v14"/>`;
    return svg;
  },

  barChart(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>`;
    return svg;
  },

  users(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`;
    return svg;
  },

  settings(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>`;
    return svg;
  },

  eye(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`;
    return svg;
  },

  send(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>`;
    return svg;
  },

  star(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`;
    return svg;
  },

  target(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`;
    return svg;
  },

  globe(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>`;
    return svg;
  },

  logOut(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>`;
    return svg;
  },

  clipboardList(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>`;
    return svg;
  },

  activity(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>`;
    return svg;
  },

  externalLink(size = 24) {
    const svg = this._svg(size);
    svg.innerHTML = `<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>`;
    return svg;
  },
};

/* Helper: creates an icon SVG and optionally adds fill + class */
function createIcon(name, size, options = {}) {
  const icon = Icons[name](size);
  if (options.filled) {
    icon.setAttribute("fill", "currentColor");
  }
  if (options.className) {
    icon.setAttribute("class", options.className);
  }
  return icon;
}
