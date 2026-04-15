/* ==========================================================================
   Navigation Component (vanilla JS)
   Renders both the desktop top nav and mobile bottom nav
   ========================================================================== */

function renderNavigation() {
  const currentPath = window.location.pathname.replace(/\/+$/, "") || "/";

  const navItems = [
    { name: "Home", href: "/", icon: "home" },
    { name: "Services", href: "/services", icon: "layoutGrid" },
    { name: "Emergency", href: "/emergency", icon: "alertTriangle" },
  ];

  /* ---- Desktop Top Nav ---- */
  const header = document.createElement("header");
  header.className = "desktop-nav";

  const inner = document.createElement("div");
  inner.className = "desktop-nav__inner";

  // Logo
  const logoLink = document.createElement("a");
  logoLink.href = "/";
  logoLink.className = "logo";
  logoLink.innerHTML = `
    <span class="logo__text">e<span>Catarman</span></span>
  `;

  // Pill nav
  const nav = document.createElement("nav");
  nav.className = "pill-nav";
  navItems.forEach((item) => {
    const a = document.createElement("a");
    a.href = item.href;
    a.className = "pill-nav__link" + (currentPath === item.href ? " active" : "");
    a.textContent = item.name;
    a.addEventListener("click", handleNavClick);
    nav.appendChild(a);
  });

  inner.appendChild(logoLink);
  inner.appendChild(nav);
  header.appendChild(inner);

  /* ---- Mobile Bottom Nav ---- */
  const mobileNav = document.createElement("div");
  mobileNav.className = "mobile-nav";

  const mobileInner = document.createElement("div");
  mobileInner.className = "mobile-nav__inner";

  navItems.forEach((item) => {
    const a = document.createElement("a");
    a.href = item.href;
    a.className = "mobile-nav__link" + (currentPath === item.href ? " active" : "");
    a.appendChild(createIcon(item.icon, 20));
    const span = document.createElement("span");
    span.className = "mobile-nav__label";
    span.textContent = item.name;
    a.appendChild(span);
    a.addEventListener("click", handleNavClick);
    mobileInner.appendChild(a);
  });  

  mobileNav.appendChild(mobileInner);

  /* ---- Site Footer ---- */
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="site-footer__inner">
      <div class="site-footer__brand">
        <span class="site-footer__logo">e<span>Catarman</span></span>
        <p class="site-footer__tagline">Modular E-Governance Platform</p>
      </div>
      <div class="site-footer__links">
        <a href="/" class="site-footer__link">Home</a>
        <a href="/services" class="site-footer__link">Services</a>
        <a href="/emergency" class="site-footer__link">Emergency</a>
      </div>
      <div class="site-footer__bottom">
        <p class="site-footer__copy">&copy; 2026 Municipality of Catarman, Northern Samar. All rights reserved.</p>
        <a href="/admin" class="site-footer__admin-link">Staff Portal</a>
      </div>
    </div>
  `;

  // Insert into DOM
  document.body.prepend(mobileNav);
  document.body.prepend(header);
  document.body.appendChild(footer);
}

/* Client-side navigation handler */
function handleNavClick(e) {
  // Let the browser handle navigation naturally since we're using server-side routing
}

/* Initialize on DOM ready */
document.addEventListener("DOMContentLoaded", renderNavigation);
