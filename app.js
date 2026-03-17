/* Minimal UI interactions (no framework). */

function $(sel, root = document) {
  return root.querySelector(sel);
}
function $all(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}

function setHidden(el, hidden) {
  if (!el) return;
  el.classList.toggle("hidden", hidden);
}

function setupYear() {
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function setupMobileMenu() {
  const btn = $("#btnMobileMenu");
  const menu = $("#mobileMenu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isHidden = menu.classList.contains("hidden");
    setHidden(menu, !isHidden);
    btn.setAttribute("aria-expanded", String(isHidden));
  });

  $all("#mobileMenu a").forEach((a) => {
    a.addEventListener("click", () => {
      setHidden(menu, true);
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

function setupAuthModal() {
  const modal = $("#authModal");
  const openBtn = $("#btnOpenAuth");
  const openBtns = $all("[data-open-auth]");
  const closeBtns = $all("[data-close-auth]");
  const tabLogin = $("#tabLogin");
  const tabRegister = $("#tabRegister");
  const loginForm = $("#loginForm");
  const registerForm = $("#registerForm");

  if (!modal) return;

  function open() {
    setHidden(modal, false);
    document.body.style.overflow = "hidden";
  }
  function close() {
    setHidden(modal, true);
    document.body.style.overflow = "";
  }

  function setTab(tab) {
    const isLogin = tab === "login";
    if (tabLogin && tabRegister) {
      tabLogin.className =
        "h-10 rounded-full text-sm font-semibold " +
        (isLogin ? "bg-white text-ink-900 shadow-sm" : "text-ink-700 hover:bg-white/60");
      tabRegister.className =
        "h-10 rounded-full text-sm font-semibold " +
        (!isLogin ? "bg-white text-ink-900 shadow-sm" : "text-ink-700 hover:bg-white/60");
    }
    setHidden(loginForm, !isLogin);
    setHidden(registerForm, isLogin);
  }

  openBtn?.addEventListener("click", open);
  openBtns.forEach((b) => b.addEventListener("click", open));
  closeBtns.forEach((b) => b.addEventListener("click", close));

  modal.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    if (target === modal.firstElementChild) close(); // backdrop
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) close();
  });

  tabLogin?.addEventListener("click", () => setTab("login"));
  tabRegister?.addEventListener("click", () => setTab("register"));
  setTab("login");

  // Demo-only submit behavior: set "logged in" state, close modal, then go to dashboard.
  loginForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      window.localStorage.setItem("bantuin:isLoggedIn", "true");
    } catch (_) {}
    close();
    window.location.href = "./dashboard.html";
  });
  registerForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      window.localStorage.setItem("bantuin:isLoggedIn", "true");
    } catch (_) {}
    close();
    window.location.href = "./dashboard.html";
  });
}

function setupUserMenu() {
  const btn = $("#userMenuButton");
  const menu = $("#userMenu");
  if (!btn || !menu) return;

  function close() {
    setHidden(menu, true);
    btn.setAttribute("aria-expanded", "false");
  }
  function toggle() {
    const isHidden = menu.classList.contains("hidden");
    setHidden(menu, !isHidden);
    btn.setAttribute("aria-expanded", String(isHidden));
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Node)) return;
    if (!menu.contains(target) && !btn.contains(target)) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

function setupAuthState() {
  const btnOpenAuth = $("#btnOpenAuth");
  const userMenuWrapper = $("#userMenuWrapper");
  const logoutBtn = $("#btnLogout");

  let isLoggedIn = false;
  try {
    isLoggedIn = window.localStorage.getItem("bantuin:isLoggedIn") === "true";
  } catch (_) {
    isLoggedIn = false;
  }

  if (isLoggedIn) {
    if (btnOpenAuth) btnOpenAuth.classList.add("hidden");
    if (userMenuWrapper) userMenuWrapper.classList.remove("hidden");
  } else {
    if (btnOpenAuth) btnOpenAuth.classList.remove("hidden");
    if (userMenuWrapper) userMenuWrapper.classList.add("hidden");
  }

  logoutBtn?.addEventListener("click", () => {
    try {
      window.localStorage.removeItem("bantuin:isLoggedIn");
    } catch (_) {}
    // After logout back to landing page and reset header state.
    window.location.href = "./index.html";
  });
}

setupYear();
setupMobileMenu();
setupAuthModal();
setupUserMenu();
setupAuthState();

