const app = document.getElementById("app");

const createSignUpPage = () => {
  app.innerHTML = "";
  document.body.classList.add("bg-gray-50");

  const main = createElement("main", [
    "grid",
    "min-h-screen",
    "md:grid-cols-2",
  ]);

  // Left Section (same as login)
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

  // Right Section (Sign Up Form)
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

  const form = createElement("form", ["space-y-5"]);
  form.method = "POST";

  // Fields
  const userNameDiv = createDivForm("UserName", "text");
  const passwordDiv = createDivForm("Password", "password");
  const confirmPasswordDiv = createDivForm("Confirm Password", "password");

  // Sign Up Button
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

  // Already have account
  const loginP = createElement("p", [
    "mt-6",
    "text-center",
    "text-sm",
    "text-gray-700",
  ]);
  loginP.innerHTML = `Already have an account?
    <a  class="font-semibold text-gray-900 underline-offset-4 hover:underline">Login</a>`;

  loginP.addEventListener("click", () => {
    createLoginPage();
  });
  appendToParent(form, [
    userNameDiv,
    passwordDiv,
    confirmPasswordDiv,
    signUpBtn,
    loginP,
  ]);

  appendToParent(formContainer, [headerBox, form]);
  appendToParent(rightSection, [formContainer]);

  // Final Append
  appendToParent(main, [leftSection, rightSection]);
  appendToParent(app, [main]);
};

const createLoginPage = () => {
  app.innerHTML = "";
  document.body.classList.add("bg-gray-50");
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

  // Right side section (form)
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

  const form = createElement("form", ["space-y-5"]);
  form.method = "POST";

  // Email field
  const emailDiv = createDivForm("UserName", "text");

  // Password field
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
  appendToParent(passInputWrapper, [passInput]);

  appendToParent(passwordDiv, [flexBox, passInputWrapper]);

  // Login Button
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

  // Sign up link
  const signupP = createElement("p", [
    "mt-6",
    "text-center",
    "text-sm",
    "text-gray-700",
  ]);
  signupP.innerHTML = `Don't have an account?
      <a class="font-semibold text-gray-900 underline-offset-4 hover:underline">Sign Up</a>`;

  signupP.addEventListener("click", () => {
    createSignUpPage();
  });

  appendToParent(form, [emailDiv, passwordDiv, loginBtn, signupP]);
  appendToParent(formContainer, [headerBox, form]);
  appendToParent(rightSection, [formContainer]);

  // Append to main
  appendToParent(main, [leftSection, rightSection]);
  appendToParent(app, [main]);
};

// createLoginPage();


const createProfilePage = () => {
  document.body.classList.add("bg-gray-50");

  const main = createElement("main", [
    "min-h-screen",
    "flex",
    "items-center",
    "justify-center",
    "p-6",
  ]);

  const container = createElement("div", [
    "w-full",
    "max-w-lg",
    "bg-white",
    "rounded-2xl",
    "shadow-lg",
    "p-8",
    "space-y-6",
  ]);

  // Header
  const header = createElement("div", ["text-center", "mb-6"]);
  const title = createElement(
    "h2",
    ["text-2xl", "font-bold", "text-gray-900"],
    "Your Profile"
  );
  const subtitle = createElement(
    "p",
    ["text-sm", "text-gray-600"],
    "add your details below"
  );
  appendToParent(header, [title, subtitle]);

  // Profile Image Upload
  const imageDiv = createElement("div", ["flex", "flex-col", "items-center"]);
  const previewImg = createElement("img", [
    "w-24",
    "h-24",
    "rounded-full",
    "object-cover",
    "mb-3",
    "border",
    "border-gray-300",
  ]);
  previewImg.src = "./images/default-avatar.png";

  const uploadInput = createElement("input");
  uploadInput.type = "file";
  uploadInput.accept = "image/*";
  uploadInput.classList.add("hidden");

  const uploadBtn = createElement(
    "button",
    [
      "px-4",
      "py-2",
      "text-sm",
      "rounded-xl",
      "bg-gray-900",
      "text-white",
      "hover:bg-black",
      "focus:ring-2",
      "focus:ring-gray-300",
    ],
    "Upload Image"
  );

  // preview image on file select
  uploadBtn.addEventListener("click", () => uploadInput.click());
  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        previewImg.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  });

  appendToParent(imageDiv, [previewImg, uploadBtn, uploadInput]);

  // Native Language Select
  const nativeDiv = createElement("div");
  const nativeLabel = createElement(
    "label",
    ["block", "mb-1", "text-sm", "font-medium", "text-gray-800"],
    "Native Language"
  );
  const nativeSelect = createElement("select", [
    "w-full",
    "rounded-xl",
    "border",
    "border-gray-300",
    "px-3",
    "py-2",
    "text-sm",
    "focus:border-gray-400",
    "focus:ring-2",
    "focus:ring-gray-200",
  ]);
  ["Select Language","Arabic", "English", "French","Spanish", "German","Turkish"].forEach((lang) => {
    const option = createElement("option", [], lang);
    option.value = lang.toLowerCase();
    nativeSelect.appendChild(option);
  });
  appendToParent(nativeDiv, [nativeLabel, nativeSelect]);

  // Learning Language Select
  const learningDiv = createElement("div");
  const learningLabel = createElement(
    "label",
    ["block", "mb-1", "text-sm", "font-medium", "text-gray-800"],
    "Learning Language"
  );
  const learningSelect = createElement("select", [
    "w-full",
    "rounded-xl",
    "border",
    "border-gray-300",
    "px-3",
    "py-2",
    "text-sm",
    "focus:border-gray-400",
    "focus:ring-2",
    "focus:ring-gray-200",
  ]);
  ["Select Language","Arabic", "English", "French","Spanish", "German","Turkish"].forEach((lang) => {
    const option = createElement("option", [], lang);
    option.value = lang.toLowerCase();
    learningSelect.appendChild(option);
  });
  appendToParent(learningDiv, [learningLabel, learningSelect]);

  // Save Button
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
    ],
    "Save"
  );

  // Collect data on submit
  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const profileData = {
      image: previewImg.src,
      nativeLanguage: nativeSelect.value,
      learningLanguage: learningSelect.value,
    };
    console.log("Profile saved:", profileData);
    alert("✅ Profile updated successfully!");
  });

  appendToParent(container, [
    header,
    imageDiv,
    nativeDiv,
    learningDiv,
    saveBtn,
  ]);
  appendToParent(main, [container]);
  appendToParent(app, [main]);
};
createLoginPage()