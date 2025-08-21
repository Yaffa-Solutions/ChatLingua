import { createLoginPage } from "./login.js";
import createProfilePage from "./Profile.js";

const app = document.getElementById("app");

export function createSignUpPage() {
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
    "Join our platform"
  );
  const desc = createElement(
    "p",
    ["max-w-md", "text-white/90"],
    "Create an account to get started with all features."
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
    "📝"
  );
  const signUpTitle = createElement(
    "h2",
    ["text-2xl", "font-bold"],
    "Create Account"
  );
  const signUpDesc = createElement(
    "p",
    ["mt-1", "text-gray-600", "text-sm"],
    "Please fill in your details to sign up"
  );
  appendToParent(headerBox, [iconBox, signUpTitle, signUpDesc]);

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
    alertBox.textContent = "";
  };

  const form = createElement("form", ["space-y-5"]);
  form.method = "POST";
  form.addEventListener("invalid", (e) => e.preventDefault(), true);
  const userNameDiv = createDivForm("UserName", "text");
  const passwordDiv = createDivForm("Password", "password");
  const confirmPasswordDiv = createDivForm("Confirm Password", "password");

  const usernameInput = userNameDiv.querySelector("input");
  const passwordInput = passwordDiv.querySelector("input");
  const confirmInput = confirmPasswordDiv.querySelector("input");

  if (usernameInput) {
    usernameInput.name = "username";
    usernameInput.autocomplete = "username";
  }
  if (passwordInput) {
    passwordInput.name = "password";
    passwordInput.minLength = 6;
    passwordInput.autocomplete = "new-password";
  }
  if (confirmInput) {
    confirmInput.type = "password";
    confirmInput.name = "confirm_password";
    confirmInput.minLength = 6;
    confirmInput.autocomplete = "new-password";
  }

  const checkPasswordsMatch = () => {
    if (!passwordInput || !confirmInput) return true;
    if (confirmInput.value === "") {
      return true;
    }
    if (passwordInput.value !== confirmInput.value) {
      return false;
    }
    return true;
  };
  confirmInput?.addEventListener("input", checkPasswordsMatch);
  passwordInput?.addEventListener("input", checkPasswordsMatch);

  const signUpBtn = createElement(
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
    "Sign Up"
  );
  signUpBtn.type = "submit";
  signUpBtn.setAttribute("formnovalidate", "");

  const loginP = createElement("p", [
    "mt-6",
    "text-center",
    "text-sm",
    "text-gray-700",
  ]);
  loginP.innerHTML = `Already have an account?
    <a class="font-semibold text-gray-900 underline-offset-4 hover:underline">Login</a>`;
  loginP.addEventListener("click", () => createLoginPage());

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideAlert();

    const username = (usernameInput?.value || "").trim();
    const password = passwordInput?.value || "";
    const confirm = confirmInput?.value || "";

    const errors = [];
    if (!username) {
      errors.push("Username is required.");
    }
    if (!password) {
      errors.push("Password is required.");
    }
    if (password && password.length < 6) {
      errors.push("Password must be at least 6 characters.");
    }
    if (!confirm) {
      errors.push("Confirm password is required.");
    }
    if (password && confirm && password !== confirm) {
      errors.push("Passwords do not match.");
    }

    if (errors.length) {
      showAlert(errors, "error");
      return;
    }

    signUpBtn.disabled = true;
    signUpBtn.classList.add("opacity-80", "cursor-not-allowed");
    signUpBtn.textContent = "Creating account...";

    let didRedirect = false;
    fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          showAlert(data.error);
          return;
        }
        showAlert(data.message, "success");
        didRedirect = true;
        setTimeout(() => {
          createProfilePage();
        }, 700);
        return;
      })
      .catch((err) => {
        showAlert(["Network error: " + err.message], "error");
      })
      .finally(() => {
        if (!didRedirect) {
          signUpBtn.disabled = false;
          signUpBtn.classList.remove("opacity-80", "cursor-not-allowed");
          signUpBtn.textContent = "Sign up";
        }
      });
  });

  appendToParent(form, [
    userNameDiv,
    passwordDiv,
    confirmPasswordDiv,
    signUpBtn,
    loginP,
  ]);
  appendToParent(formContainer, [headerBox, alertBox, form]);
  appendToParent(rightSection, [formContainer]);
  appendToParent(main, [leftSection, rightSection]);
  appendToParent(app, [main]);
}

export default createSignUpPage;
