import { createHomePage } from "./home.js";
const app = document.getElementById("app");

export function createLoginPage() {
  app.innerHTML = "";
  document.body.classList.add("bg-gray-50");

  const escapeHtml = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[c])
    );

  const main = createElement("main", [
    "grid",
    "min-h-screen",
    "md:grid-cols-2",
  ]);

  const leftSection = createElement("section", [
    "relative",
    "hidden",
    "md:block",
  ]);
  const img = createElement("img", [
    "absolute",
    "inset-0",
    "h-full",
    "w-full",
    "object-cover",
  ]);
  img.src = "./images/img.webp";
  img.alt = "Welcome";

  const overlay = createElement("div", [
    "absolute",
    "inset-0",
    "bg-gradient-to-t",
    "from-black/60",
    "via-black/40",
    "to-black/20",
  ]);

  const overlayContent = createElement("div", [
    "relative",
    "z-10",
    "flex",
    "h-full",
    "flex-col",
    "justify-between",
    "p-8",
    "text-white",
  ]);

  const welcomeBox = createElement("div", ["space-y-2"]);
  const badge = createElement(
    "span",
    [
      "inline-block",
      "rounded-full",
      "bg-white/10",
      "px-3",
      "py-1",
      "text-xs",
      "backdrop-blur",
    ],
    "Welcome"
  );
  const heading = createElement(
    "h1",
    ["text-3xl", "font-semibold", "leading-tight", "md:text-4xl"],
    "Welcome back to your platform"
  );
  const desc = createElement(
    "p",
    ["max-w-md", "text-white/90"],
    "Sign in to manage your account and stay updated easily."
  );
  appendToParent(welcomeBox, [badge, heading, desc]);
  appendToParent(overlayContent, [welcomeBox]);
  appendToParent(leftSection, [img, overlay, overlayContent]);

  const rightSection = createElement("section", [
    "flex",
    "items-center",
    "justify-center",
    "p-6",
    "md:p-10",
  ]);
  const formContainer = createElement("div", ["w-full", "max-w-md"]);

  const headerBox = createElement("div", ["mb-8", "text-center"]);
  const iconBox = createElement(
    "div",
    [
      "mx-auto",
      "mb-4",
      "h-12",
      "w-12",
      "rounded-2xl",
      "bg-gray-900",
      "text-white",
      "grid",
      "place-items-center",
      "shadow-lg",
    ],
    "🔐"
  );
  const loginTitle = createElement("h2", ["text-2xl", "font-bold"], "Login");
  const loginDesc = createElement(
    "p",
    ["mt-1", "text-gray-600", "text-sm"],
    "Please enter your credentials to continue"
  );
  appendToParent(headerBox, [iconBox, loginTitle, loginDesc]);

  const alertBox = document.createElement("span");
  alertBox.className = "mb-4 hidden block rounded-xl border p-4 text-sm";
  alertBox.setAttribute("role", "alert");
  alertBox.setAttribute("aria-live", "polite");

  const showAlert = (msgs, type = "error") => {
    const messages = Array.isArray(msgs) ? msgs : [String(msgs)];
    alertBox.classList.remove(
      "hidden",
      "border-red-200",
      "bg-red-50",
      "text-red-700",
      "border-green-200",
      "bg-green-50",
      "text-green-700"
    );
    alertBox.classList.add(
      type === "success" ? "border-green-200" : "border-red-200",
      type === "success" ? "bg-green-50" : "bg-red-50",
      type === "success" ? "text-green-700" : "text-red-700"
    );
    alertBox.innerHTML = messages.map((m) => escapeHtml(m)).join("<br>");
    alertBox.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const hideAlert = () => {
    alertBox.classList.add("hidden");
    alertBox.innerHTML = "";
  };

  const form = createElement("form", ["space-y-5"]);
  form.method = "POST";
  form.noValidate = true;
  form.addEventListener("invalid", (e) => e.preventDefault(), true);

  const usernameDiv = createDivForm("UserName", "text");
  const usernameInput = usernameDiv.querySelector("input");
  if (usernameInput) {
    usernameInput.name = "username";
    usernameInput.required = true;
    usernameInput.placeholder = "Your username (letters & numbers only)";
    usernameInput.autocomplete = "username";
  }

  const passwordDiv = createElement("div");
  const flexBox = createElement("div", [
    "flex",
    "items-center",
    "justify-between",
  ]);
  const passLabel = createElement(
    "label",
    ["mb-1.5", "block", "text-sm", "font-medium", "text-gray-800"],
    "Password"
  );
  passLabel.setAttribute("for", "password");
  appendToParent(flexBox, [passLabel]);

  const passInputWrapper = createElement("div", ["relative"]);
  const passInput = createElement("input", [
    "w-full",
    "rounded-2xl",
    "border",
    "border-gray-200",
    "bg-white",
    "px-4",
    "py-3",
    "text-sm",
    "outline-none",
    "transition",
    "focus:border-gray-400",
    "focus:ring-2",
    "focus:ring-gray-200",
    "pr-12",
  ]);
  passInput.type = "password";
  passInput.name = "password";
  passInput.placeholder = "••••••••";
  passInput.required = true;
  passInput.autocomplete = "current-password";
  appendToParent(passInputWrapper, [passInput]);
  appendToParent(passwordDiv, [flexBox, passInputWrapper]);

  const loginBtn = createElement(
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
    ],
    "Login"
  );
  loginBtn.type = "submit";
  loginBtn.setAttribute("formnovalidate", "");

  const signupP = createElement("p", [
    "mt-6",
    "text-center",
    "text-sm",
    "text-gray-700",
  ]);
  signupP.innerHTML = `Don't have an account?
      <a class="font-semibold text-gray-900 underline-offset-4 hover:underline">Sign Up</a>`;
  signupP.addEventListener("click", () => createSignUpPage());

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    hideAlert();
    const username = (usernameInput?.value || "").trim();
    const password = passInput?.value || "";
    const errors = [];

    const usernameRegex = /^[A-Za-z0-9]{3,20}$/;
    if (!username) {
      errors.push("Username is required.");
    } else if (!usernameRegex.test(username)) {
      errors.push("Username must be 3–20 letters/numbers only.");
    }
    if (!password) {
      errors.push("Password is required.");
    }

    if (errors.length) {
      showAlert(errors, "error");
      return;
    }

    loginBtn.disabled = true;
    loginBtn.classList.add("opacity-80", "cursor-not-allowed");
    loginBtn.textContent = "Signing in...";
    let didRedirect = false;

    fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          showAlert(data.error);
          return;
        }
        showAlert(data.message, "success");
        didRedirect = true;
        setTimeout(() => {
          createHomePage();
        }, 700);
        return;
      })
      .catch((err) => {
        showAlert(["Network error: " + err.message], "error");
      })
      .finally(() => {
        if (!didRedirect) {
          loginBtn.disabled = false;
          loginBtn.classList.remove("opacity-80", "cursor-not-allowed");
          loginBtn.textContent = "Login";
        }
      });
  });

  appendToParent(form, [usernameDiv, passwordDiv, loginBtn, signupP]);
  appendToParent(formContainer, [headerBox, alertBox, form]);
  appendToParent(rightSection, [formContainer]);

  appendToParent(main, [leftSection, rightSection]);
  appendToParent(app, [main]);
}
