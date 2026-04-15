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

  // Right side
  const right = document.createElement("div");
  right.className = "desktop-nav__right";
  right.innerHTML = `
    <a href="/admin" class="sign-in-btn">Sign In</a>
  `;

  inner.appendChild(logoLink);
  inner.appendChild(nav);
  inner.appendChild(right);
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

  // Account mobile link
  const accountLink = document.createElement("a");
  accountLink.href = "/account";
  accountLink.className = "mobile-nav__link" + (currentPath === "/account" ? " active" : "");
  accountLink.appendChild(createIcon("user", 20));
  const accLabel = document.createElement("span");
  accLabel.className = "mobile-nav__label";
  accLabel.textContent = "Account";
  accountLink.appendChild(accLabel);
  mobileInner.appendChild(accountLink);

  mobileNav.appendChild(mobileInner);

  // Insert into DOM
  document.body.prepend(mobileNav);
  document.body.prepend(header);
}

/* Client-side navigation handler */
function handleNavClick(e) {
  // Let the browser handle navigation naturally since we're using server-side routing
}

/* Initialize on DOM ready */
document.addEventListener("DOMContentLoaded", renderNavigation);
