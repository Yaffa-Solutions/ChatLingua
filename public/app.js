const app = document.getElementById("app");

const createSignUpPage = () => {
  app.innerHTML = "";
  document.body.classList.add("bg-gray-50");

  const main = createElement("main", ["grid", "min-h-screen", "md:grid-cols-2"]);

  const leftSection = createElement("section", ["relative", "hidden", "md:block"]);
  const img = createElement("img", ["absolute", "inset-0", "h-full", "w-full", "object-cover"]);
  img.src = "./images/img.webp";
  img.alt = "Welcome";
  const overlay = createElement("div", ["absolute", "inset-0", "bg-gradient-to-t", "from-black/60", "via-black/40", "to-black/20"]);
  const overlayContent = createElement("div", ["relative", "z-10", "flex", "h-full", "flex-col", "justify-between", "p-8", "text-white"]);
  const welcomeBox = createElement("div", ["space-y-2"]);
  const badge = createElement("span", ["inline-block", "rounded-full", "bg-white/10", "px-3", "py-1", "text-xs", "backdrop-blur"], "Welcome");
  const heading = createElement("h1", ["text-3xl", "font-semibold", "leading-tight", "md:text-4xl"], "Join our platform");
  const desc = createElement("p", ["max-w-md", "text-white/90"], "Create an account to get started with all features.");
  appendToParent(welcomeBox, [badge, heading, desc]);
  appendToParent(overlayContent, [welcomeBox]);
  appendToParent(leftSection, [img, overlay, overlayContent]);

  const rightSection = createElement("section", ["flex", "items-center", "justify-center", "p-6", "md:p-10"]);
  const formContainer = createElement("div", ["w-full", "max-w-md"]);

  const headerBox = createElement("div", ["mb-8", "text-center"]);
  const iconBox = createElement("div", ["mx-auto", "mb-4", "h-12", "w-12", "rounded-2xl", "bg-gray-900", "text-white", "grid", "place-items-center", "shadow-lg"], "📝");
  const signUpTitle = createElement("h2", ["text-2xl", "font-bold"], "Create Account");
  const signUpDesc = createElement("p", ["mt-1", "text-gray-600", "text-sm"], "Please fill in your details to sign up");
  appendToParent(headerBox, [iconBox, signUpTitle, signUpDesc]);

  const alertBox = createElement("div", ["mb-4", "hidden", "rounded-xl", "border", "p-4", "text-sm"]);
  const showAlert = (msgs, type = "error") => {
    const messages = Array.isArray(msgs) ? msgs : [String(msgs)];
    alertBox.classList.remove("hidden", "border-red-200", "bg-red-50", "text-red-700", "border-green-200", "bg-green-50", "text-green-700");
    alertBox.classList.add(type === "success" ? "border-green-200" : "border-red-200",
                           type === "success" ? "bg-green-50" : "bg-red-50",
                           type === "success" ? "text-green-700" : "text-red-700");
    const ul = document.createElement("ul");
    ul.className = "list-disc pl-5 space-y-1";
    ul.innerHTML = messages.map(m => `<li>${m}</li>`).join("");
    alertBox.innerHTML = "";
    alertBox.appendChild(ul);
    alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const hideAlert = () => { alertBox.classList.add("hidden"); alertBox.innerHTML = ""; };

  const setFieldError = (wrap, input, msg) => {
    if (!wrap || !input) return;
    input.classList.add("ring-2", "ring-red-300");
    let p = wrap.querySelector("[data-error]");
    if (!p) {
      p = document.createElement("p");
      p.dataset.error = "true";
      p.className = "mt-1 text-xs text-red-600";
      wrap.appendChild(p);
    }
    p.textContent = msg;
  };
  const clearFieldError = (wrap, input) => {
    if (input) input.classList.remove("ring-2", "ring-red-300");
    const p = wrap?.querySelector("[data-error]");
    if (p) p.remove();
  };

  const form = createElement("form", ["space-y-5"]);
  form.method = "POST";

  const userNameDiv = createDivForm("UserName", "text");
  const passwordDiv = createDivForm("Password", "password");
  const confirmPasswordDiv = createDivForm("Confirm Password", "password");

  const usernameInput = userNameDiv.querySelector("input");
  const passwordInput = passwordDiv.querySelector("input");
  const confirmInput = confirmPasswordDiv.querySelector("input");

  if (usernameInput) {
    usernameInput.name = "username";
    usernameInput.required = true;
    usernameInput.autocomplete = "username";
  }
  if (passwordInput) {
    passwordInput.name = "password";
    passwordInput.required = true;
    passwordInput.minLength = 6;
    passwordInput.autocomplete = "new-password";
  }
  if (confirmInput) {
    confirmInput.name = "confirm_password";
    confirmInput.required = true;
    confirmInput.minLength = 6;
    confirmInput.autocomplete = "new-password";
  }

  const checkPasswordsMatch = () => {
    if (!passwordInput || !confirmInput) return true;
    if (confirmInput.value === "") { clearFieldError(confirmPasswordDiv, confirmInput); return true; }
    if (passwordInput.value !== confirmInput.value) {
      setFieldError(confirmPasswordDiv, confirmInput, "Passwords do not match.");
      return false;
    }
    clearFieldError(confirmPasswordDiv, confirmInput);
    return true;
  };
  confirmInput?.addEventListener("input", checkPasswordsMatch);
  passwordInput?.addEventListener("input", checkPasswordsMatch);

  const signUpBtn = createElement("button",
    ["w-full","rounded-2xl","bg-gray-900","px-4","py-3","text-sm","font-semibold","text-white","shadow-lg","transition","active:scale-[.99]","hover:bg-black","focus:outline-none","focus:ring-2","focus:ring-gray-300"],
    "Sign Up"
  );
  signUpBtn.type = "submit";

  const loginP = createElement("p", ["mt-6", "text-center", "text-sm", "text-gray-700"]);
  loginP.innerHTML = `Already have an account?
    <a class="font-semibold text-gray-900 underline-offset-4 hover:underline">Login</a>`;
  loginP.addEventListener("click", () => createLoginPage());

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert();
    clearFieldError(userNameDiv, usernameInput);
    clearFieldError(passwordDiv, passwordInput);
    clearFieldError(confirmPasswordDiv, confirmInput);

    const username = (usernameInput?.value || "").trim();
    const password = passwordInput?.value || "";
    const confirm = confirmInput?.value || "";

    const errors = [];
    if (!username) { setFieldError(userNameDiv, usernameInput, "Username is required."); errors.push("Username is required."); }
    if (!password) { setFieldError(passwordDiv, passwordInput, "Password is required."); errors.push("Password is required."); }
    if (password && password.length < 6) { setFieldError(passwordDiv, passwordInput, "Password must be at least 6 characters."); errors.push("Password must be at least 6 characters."); }
    if (!confirm) { setFieldError(confirmPasswordDiv, confirmInput, "Confirm password is required."); errors.push("Confirm password is required."); }
    if (password && confirm && password !== confirm) { setFieldError(confirmPasswordDiv, confirmInput, "Passwords do not match."); errors.push("Passwords do not match."); }

    if (errors.length) { showAlert(errors, "error"); return; }

    signUpBtn.disabled = true;
    const originalBtnText = signUpBtn.textContent;
    signUpBtn.classList.add("opacity-80", "cursor-not-allowed");
    signUpBtn.textContent = "Creating account...";

    let didRedirect = false;
    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        const apiErrors = [];

        const rawMsg = (data?.error || data?.message || "").toString().toLowerCase();
        if (rawMsg.includes("duplicate") && rawMsg.includes("username")) {
          apiErrors.push("Username is already taken.");
          setFieldError(userNameDiv, usernameInput, "Username is already taken.");
        }

        if (Array.isArray(data?.errors)) apiErrors.push(...data.errors.map(String));
        else if (data?.errors && typeof data.errors === "object") {
          Object.values(data.errors).forEach(v => Array.isArray(v) ? apiErrors.push(...v.map(String)) : apiErrors.push(String(v)));
        }
        if (!apiErrors.length) apiErrors.push(`${res.status} ${res.statusText || "Request failed"}`);

        showAlert(apiErrors, "error");
        return;
      }

      showAlert("Account created successfully. Redirecting to login...", "success");
      didRedirect = true;
      setTimeout(() => { createLoginPage(); }, 700);
    } catch {
      showAlert("Network error. Please check your connection and try again.", "error");
    } finally {
      if (!didRedirect) {
        signUpBtn.disabled = false;
        signUpBtn.classList.remove("opacity-80", "cursor-not-allowed");
        signUpBtn.textContent = originalBtnText;
      }
    }
  });

  appendToParent(form, [userNameDiv, passwordDiv, confirmPasswordDiv, signUpBtn, loginP]);
  appendToParent(formContainer, [headerBox, alertBox, form]);
  appendToParent(rightSection, [formContainer]);
  appendToParent(main, [leftSection, rightSection]);
  appendToParent(app, [main]);
};

const createLoginPage = () => {
  app.innerHTML = "";
  document.body.classList.add("bg-gray-50");
  const main = createElement("main", ["grid", "min-h-screen", "md:grid-cols-2"]);

  // Left
  const leftSection = createElement("section", ["relative", "hidden", "md:block"]);
  const img = createElement("img", ["absolute", "inset-0", "h-full", "w-full", "object-cover"]);
  img.src = "./images/img.webp";
  img.alt = "Welcome";

  const overlay = createElement("div", [
    "absolute", "inset-0", "bg-gradient-to-t",
    "from-black/60", "via-black/40", "to-black/20"
  ]);

  const overlayContent = createElement("div", [
    "relative", "z-10", "flex", "h-full", "flex-col", "justify-between", "p-8", "text-white"
  ]);

  const welcomeBox = createElement("div", ["space-y-2"]);
  const badge = createElement("span", [
    "inline-block","rounded-full","bg-white/10","px-3","py-1","text-xs","backdrop-blur"
  ], "Welcome");
  const heading = createElement("h1", ["text-3xl","font-semibold","leading-tight","md:text-4xl"], "Welcome back to your platform");
  const desc = createElement("p", ["max-w-md","text-white/90"], "Sign in to manage your account and stay updated easily.");
  appendToParent(welcomeBox, [badge, heading, desc]);
  appendToParent(overlayContent, [welcomeBox]);
  appendToParent(leftSection, [img, overlay, overlayContent]);

  // Right (form)
  const rightSection = createElement("section", ["flex","items-center","justify-center","p-6","md:p-10"]);
  const formContainer = createElement("div", ["w-full","max-w-md"]);

  const headerBox = createElement("div", ["mb-8","text-center"]);
  const iconBox = createElement("div", [
    "mx-auto","mb-4","h-12","w-12","rounded-2xl","bg-gray-900","text-white","grid","place-items-center","shadow-lg"
  ], "🔐");
  const loginTitle = createElement("h2", ["text-2xl","font-bold"], "Login");
  const loginDesc = createElement("p", ["mt-1","text-gray-600","text-sm"], "Please enter your credentials to continue");
  appendToParent(headerBox, [iconBox, loginTitle, loginDesc]);

  // Alert box (top of form)
  const alertBox = createElement("div", ["mb-4","hidden","rounded-xl","border","p-4","text-sm"]);
  const showAlert = (msgs, type = "error") => {
    const arr = Array.isArray(msgs) ? msgs : [String(msgs)];
    alertBox.className = "mb-4 rounded-xl border p-4 text-sm";
    alertBox.classList.add(type === "success" ? "border-green-200" : "border-red-200",
                           type === "success" ? "bg-green-50" : "bg-red-50",
                           type === "success" ? "text-green-700" : "text-red-700");
    const ul = document.createElement("ul");
    ul.className = "list-disc pl-5 space-y-1";
    ul.innerHTML = arr.map(m => `<li>${m}</li>`).join("");
    alertBox.innerHTML = "";
    alertBox.appendChild(ul);
    alertBox.classList.remove("hidden");
    alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const hideAlert = () => { alertBox.classList.add("hidden"); alertBox.innerHTML = ""; };

  // Field error helpers
  const setFieldError = (wrap, input, msg) => {
    input?.classList.add("ring-2","ring-red-300");
    let p = wrap.querySelector("[data-error]");
    if (!p) {
      p = document.createElement("p");
      p.dataset.error = "true";
      p.className = "mt-1 text-xs text-red-600";
      wrap.appendChild(p);
    }
    p.textContent = msg;
  };
  const clearFieldError = (wrap, input) => {
    input?.classList.remove("ring-2","ring-red-300");
    wrap?.querySelector("[data-error]")?.remove();
  };

  const form = createElement("form", ["space-y-5"]);
  form.method = "POST";

  // Username field
  const usernameDiv = createDivForm("UserName", "text");
  const usernameInput = usernameDiv.querySelector("input");
  if (usernameInput) {
    usernameInput.name = "username";
    usernameInput.required = true;
    usernameInput.placeholder = "Your username (letters & numbers only)";
    usernameInput.autocomplete = "username";
  }

  // Password field
  const passwordDiv = createElement("div");
  const flexBox = createElement("div", ["flex","items-center","justify-between"]);
  const passLabel = createElement("label", ["mb-1.5","block","text-sm","font-medium","text-gray-800"], "Password");
  passLabel.setAttribute("for", "password");
  appendToParent(flexBox, [passLabel]);

  const passInputWrapper = createElement("div", ["relative"]);
  const passInput = createElement("input", [
    "w-full","rounded-2xl","border","border-gray-200","bg-white","px-4","py-3","text-sm",
    "outline-none","transition","focus:border-gray-400","focus:ring-2","focus:ring-gray-200","pr-12"
  ]);
  passInput.type = "password";
  passInput.name = "password";
  passInput.placeholder = "••••••••";
  passInput.required = true;
  passInput.autocomplete = "current-password";
  appendToParent(passInputWrapper, [passInput]);
  appendToParent(passwordDiv, [flexBox, passInputWrapper]);

  // Button
  const loginBtn = createElement("button", [
    "w-full","rounded-2xl","bg-gray-900","px-4","py-3","text-sm","font-semibold",
    "text-white","shadow-lg","transition","active:scale-[.99]","hover:bg-black","focus:outline-none",
    "focus:ring-2","focus:ring-gray-300"
  ], "Login");
  loginBtn.type = "submit";

  // Sign up link
  const signupP = createElement("p", ["mt-6","text-center","text-sm","text-gray-700"]);
  signupP.innerHTML = `Don't have an account?
      <a class="font-semibold text-gray-900 underline-offset-4 hover:underline">Sign Up</a>`;
  signupP.addEventListener("click", () => createSignUpPage());

  // Submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert();
    clearFieldError(usernameDiv, usernameInput);
    clearFieldError(passwordDiv, passInput);

    const username = (usernameInput?.value || "").trim();
    const password = passInput?.value || "";
    const errors = [];

    const usernameRegex = /^[A-Za-z0-9]{3,20}$/;
    if (!username) { setFieldError(usernameDiv, usernameInput, "Username is required."); errors.push("Username is required."); }
    else if (!usernameRegex.test(username)) {
      setFieldError(usernameDiv, usernameInput, "Username must be 3–20 letters/numbers only.");
      errors.push("Username must be 3–20 letters/numbers only.");
    }
    if (!password) { setFieldError(passwordDiv, passInput, "Password is required."); errors.push("Password is required."); }

    if (errors.length) { showAlert(errors, "error"); return; }

    // loading UI
    loginBtn.disabled = true;
    const originalText = loginBtn.textContent;
    loginBtn.classList.add("opacity-80","cursor-not-allowed");
    loginBtn.textContent = "Signing in...";

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      let data = null;
      try { data = await res.json(); } catch {}

      if (!res.ok) {
        const msgs = [];
        const raw = (data?.error || data?.message || "").toString();

        if (res.status === 401 || /invalid/i.test(raw)) {
          setFieldError(usernameDiv, usernameInput, "Invalid username or password.");
          setFieldError(passwordDiv, passInput, "Invalid username or password.");
          msgs.push("Invalid username or password.");
        }
        if (!msgs.length) msgs.push(raw || `${res.status} ${res.statusText || "Login failed"}`);

        showAlert(msgs, "error");
        return;
      }

      // Success: save token/user (optional but useful) then go to profile
      try {
        if (data?.token) localStorage.setItem("token", data.token);
        if (data?.data) localStorage.setItem("user", JSON.stringify(data.data));
      } catch {}

      // Redirect
      createProfilePage();
    } catch {
      showAlert("Network error. Please check your connection and try again.", "error");
    } finally {
      // If we didn't redirect, restore button
      if (!document.body.contains(app) || loginBtn.disabled) {
        // if redirected, the old DOM is gone; skip restoring
      }
      loginBtn.disabled = false;
      loginBtn.classList.remove("opacity-80","cursor-not-allowed");
      loginBtn.textContent = originalText;
    }
  });

  appendToParent(form, [usernameDiv, passwordDiv, loginBtn, signupP]);
  appendToParent(formContainer, [headerBox, alertBox, form]);
  appendToParent(rightSection, [formContainer]);

  appendToParent(main, [leftSection, rightSection]);
  appendToParent(app, [main]);
};



const createProfilePage = () => {
  app.innerHTML = "";
  document.body.classList.add("bg-gray-50");

  let username = "";
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    username = u?.username || "";
  } catch {}

  const main = createElement("main", [
    "relative",
    "min-h-screen",
    "flex",
    "items-center",
    "justify-center",
    "p-6",
    "overflow-hidden",
  ]);

  const blob1 = createElement("div", [
    "pointer-events-none",
    "absolute",
    "-top-24",
    "-right-24",
    "h-72",
    "w-72",
    "rounded-full",
    "bg-indigo-300/30",
    "blur-3xl",
  ]);
  const blob2 = createElement("div", [
    "pointer-events-none",
    "absolute",
    "-bottom-24",
    "-left-24",
    "h-72",
    "w-72",
    "rounded-full",
    "bg-violet-300/30",
    "blur-3xl",
  ]);

  const container = createElement("div", [
    "w-full",
    "max-w-2xl",
    "bg-white",
    "rounded-3xl",
    "shadow-xl",
    "ring-1",
    "ring-black/5",
    "overflow-hidden",
  ]);

  const banner = createElement("div", [
    "relative",
    "h-28",
    "bg-gradient-to-r",
    "from-indigo-600",
    "to-violet-600",
  ]);

  const avatarWrap = createElement("div", [
    "relative",
    "mx-auto",
    "-mt-12",
    "h-28",
    "w-28",
  ]);

  const previewImg = createElement("img", [
    "h-28",
    "w-28",
    "rounded-full",
    "object-cover",
    "border-4",
    "border-white",
    "shadow-md",
    "bg-white",
  ]);
  previewImg.src = "./images/default-avatar.png";

  const avatarOverlay = createElement(
    "button",
    [
      "absolute",
      "bottom-0",
      "right-0",
      "translate-x-1",
      "translate-y-1",
      "rounded-full",
      "bg-gray-900",
      "text-white",
      "px-2.5",
      "py-1.5",
      "text-xs",
      "shadow",
      "hover:bg-black",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-gray-300",
    ],
    "Change"
  );
  const uploadInput = createElement("input");
  uploadInput.type = "file";
  uploadInput.accept = "image/*";
  uploadInput.classList.add("hidden");

  avatarOverlay.addEventListener("click", () => uploadInput.click());
  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (previewImg.src = reader.result);
      reader.readAsDataURL(file);
    }
  });

  appendToParent(avatarWrap, [previewImg, avatarOverlay, uploadInput]);

  const header = createElement("div", ["px-8", "text-center", "mt-2", "mb-4"]);
  const title = createElement(
    "h2",
    ["text-2xl", "font-bold", "text-gray-900"],
    username ? `Hello, ${username}` : "Your Profile"
  );
  const subtitle = createElement(
    "p",
    ["text-sm", "text-gray-600"],
    "Add your details to personalize your experience"
  );
  appendToParent(header, [title, subtitle]);

  const alertBox = createElement("div", [
    "mx-8",
    "hidden",
    "rounded-xl",
    "border",
    "p-4",
    "text-sm",
    "mb-2",
  ]);
  const showAlert = (msgs, type = "error") => {
    const arr = Array.isArray(msgs) ? msgs : [String(msgs)];
    alertBox.className = "mx-8 rounded-xl border p-4 text-sm mb-2";
    alertBox.classList.add(
      type === "success" ? "border-green-200" : "border-red-200",
      type === "success" ? "bg-green-50" : "bg-red-50",
      type === "success" ? "text-green-700" : "text-red-700"
    );
    const ul = document.createElement("ul");
    ul.className = "list-disc pl-5 space-y-1";
    ul.innerHTML = arr.map((m) => `<li>${m}</li>`).join("");
    alertBox.innerHTML = "";
    alertBox.appendChild(ul);
    alertBox.classList.remove("hidden");
    alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const hideAlert = () => {
    alertBox.classList.add("hidden");
    alertBox.innerHTML = "";
  };

  const form = createElement("form", ["px-8", "pb-8", "space-y-6"]);

  const setFieldError = (wrap, input, msg) => {
    input?.classList.add("ring-2", "ring-red-300");
    let p = wrap.querySelector("[data-error]");
    if (!p) {
      p = document.createElement("p");
      p.dataset.error = "true";
      p.className = "mt-1 text-xs text-red-600";
      wrap.appendChild(p);
    }
    p.textContent = msg;
  };
  const clearFieldError = (wrap, input) => {
    input?.classList.remove("ring-2", "ring-red-300");
    wrap?.querySelector("[data-error]")?.remove();
  };

  const LANGS = [
    { label: "Select Language", value: "" },
    { label: "🇸🇦 Arabic", value: "arabic" },
    { label: "🇬🇧 English", value: "english" },
    { label: "🇫🇷 French", value: "french" },
    { label: "🇪🇸 Spanish", value: "spanish" },
    { label: "🇩🇪 German", value: "german" },
    { label: "🇹🇷 Turkish", value: "turkish" },
  ];

  const nativeDiv = createElement("div");
  const nativeLabel = createElement(
    "label",
    ["block", "mb-1.5", "text-sm", "font-medium", "text-gray-800"],
    "Native Language"
  );
  const nativeSelect = createElement("select", [
    "w-full",
    "rounded-xl",
    "border",
    "border-gray-300",
    "px-3",
    "py-2.5",
    "text-sm",
    "bg-white",
    "focus:border-gray-400",
    "focus:ring-2",
    "focus:ring-gray-200",
    "transition",
  ]);
  LANGS.forEach((l) => {
    const opt = createElement("option", [], l.label);
    opt.value = l.value;
    nativeSelect.appendChild(opt);
  });
  appendToParent(nativeDiv, [nativeLabel, nativeSelect]);

  const learningDiv = createElement("div");
  const learningLabel = createElement(
    "label",
    ["block", "mb-1.5", "text-sm", "font-medium", "text-gray-800"],
    "Learning Language"
  );
  const learningSelect = createElement("select", [
    "w-full",
    "rounded-xl",
    "border",
    "border-gray-300",
    "px-3",
    "py-2.5",
    "text-sm",
    "bg-white",
    "focus:border-gray-400",
    "focus:ring-2",
    "focus:ring-gray-200",
    "transition",
  ]);
  LANGS.forEach((l) => {
    const opt = createElement("option", [], l.label);
    opt.value = l.value;
    learningSelect.appendChild(opt);
  });
  appendToParent(learningDiv, [learningLabel, learningSelect]);

  const summary = createElement("div", ["flex", "gap-2", "flex-wrap"]);
  const chip = (text) =>
    createElement(
      "span",
      [
        "inline-flex",
        "items-center",
        "gap-1",
        "rounded-full",
        "bg-gray-100",
        "px-3",
        "py-1",
        "text-xs",
        "text-gray-700",
      ],
      text
    );
  const refreshSummary = () => {
    summary.innerHTML = "";
    const n = nativeSelect.value
      ? `Native: ${nativeSelect.options[nativeSelect.selectedIndex].text}`
      : "";
    const l = learningSelect.value
      ? `Learning: ${learningSelect.options[learningSelect.selectedIndex].text}`
      : "";
    if (n) summary.appendChild(chip(n));
    if (l) summary.appendChild(chip(l));
  };
  nativeSelect.addEventListener("change", () => {
    clearFieldError(nativeDiv, nativeSelect);
    refreshSummary();
  });
  learningSelect.addEventListener("change", () => {
    clearFieldError(learningDiv, learningSelect);
    refreshSummary();
  });

  const tips = createElement("div", [
    "rounded-xl",
    "bg-gray-50",
    "border",
    "border-gray-200",
    "p-4",
    "text-xs",
    "text-gray-600",
  ]);
  tips.innerHTML =
    "<strong>Tip:</strong> You can change these later from Settings. Choose your native and the language you want to practice.";

  const saveBtn = createElement(
    "button",
    [
      "w-full",
      "rounded-2xl",
      "bg-gray-900",
      "px-4",
      "py-3",
      "text-sm",
      "font-semibold",
      "text-white",
      "shadow-lg",
      "transition",
      "active:scale-[.99]",
      "hover:bg-black",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-gray-300",
      "flex",
      "items-center",
      "justify-center",
      "gap-2",
    ],
    "Save"
  );
  const setLoading = (on) => {
    if (on) {
      saveBtn.disabled = true;
      saveBtn.classList.add("opacity-80", "cursor-not-allowed");
      saveBtn.innerHTML =
        '<svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"></path></svg><span>Saving...</span>';
    } else {
      saveBtn.disabled = false;
      saveBtn.classList.remove("opacity-80", "cursor-not-allowed");
      saveBtn.textContent = "Save";
    }
  };

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    hideAlert();

    let hasErr = false;
    if (!nativeSelect.value) {
      setFieldError(nativeDiv, nativeSelect, "Please select your native language.");
      hasErr = true;
    }
    if (!learningSelect.value) {
      setFieldError(learningDiv, learningSelect, "Please select the language you are learning.");
      hasErr = true;
    }
    if (nativeSelect.value && learningSelect.value && nativeSelect.value === learningSelect.value) {
      setFieldError(learningDiv, learningSelect, "Learning language must be different from native.");
      hasErr = true;
    }
    if (hasErr) {
      showAlert("Please fix the highlighted fields.", "error");
      return;
    }

    setLoading(true);

    try {
      const profileData = {
        image: previewImg.src,
        nativeLanguage: nativeSelect.value,
        learningLanguage: learningSelect.value,
      };
      localStorage.setItem("profile", JSON.stringify(profileData));
      refreshSummary();
      showAlert("Profile updated successfully!", "success");
    } catch {
      showAlert("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  });

  appendToParent(form, [nativeDiv, learningDiv, summary, tips, saveBtn]);

  appendToParent(container, [banner, avatarWrap, header, alertBox, form]);
  appendToParent(main, [blob1, blob2, container]);
  appendToParent(app, [main]);

  refreshSummary();
};

createLoginPage()