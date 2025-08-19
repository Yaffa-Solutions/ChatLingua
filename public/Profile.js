 
const app = document.getElementById("app");

export function  createProfilePage  ()  {
  app.innerHTML = "";
  document.body.classList.add("bg-gray-50");

  const API_BASE = "http://localhost:5000";

  const LANGS = ["Select Language","Arabic","English","French","Spanish","German","Turkish"];

  const ID_MAP = [
    0, 
    1,
    2, 
    3, 
    4, 
    5, 
    6 
  ];

  let username = "";
  try {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    username = u?.username || "";
  } catch {}

  const main = createElement("main", [
    "relative","min-h-screen","flex","items-center","justify-center","p-6","overflow-hidden"
  ]);

  const blob1 = createElement("div", ["pointer-events-none","absolute","-top-24","-right-24","h-72","w-72","rounded-full","bg-indigo-300/30","blur-3xl"]);
  const blob2 = createElement("div", ["pointer-events-none","absolute","-bottom-24","-left-24","h-72","w-72","rounded-full","bg-violet-300/30","blur-3xl"]);

  const container = createElement("div", ["w-full","max-w-2xl","bg-white","rounded-3xl","shadow-xl","ring-1","ring-black/5","overflow-hidden"]);
  const banner = createElement("div", ["relative","h-28","bg-gradient-to-r","from-indigo-600","to-violet-600"]);

  const header = createElement("div", ["px-8","text-center","mt-6","mb-4"]);
  const title = createElement(
    "h2",
    ["text-2xl","font-bold","text-gray-900"],
    username ? `Hello, ${username}` : "Your Profile"
  );
  const subtitle = createElement("p", ["text-sm","text-gray-600"], "Add your details to personalize your experience");
  appendToParent(header, [title, subtitle]);

  const alertBox = createElement("span", ["mx-8","hidden","block","rounded-xl","border","p-4","text-sm","mb-2"]);
  alertBox.setAttribute("role","alert");
  alertBox.setAttribute("aria-live","polite");
  const showAlert = (msgs, type="error") => {
    const arr = Array.isArray(msgs) ? msgs : [String(msgs)];
    alertBox.className = "mx-8 block rounded-xl border p-4 text-sm mb-2";
    alertBox.classList.add(
      type==="success" ? "border-green-200" : "border-red-200",
      type==="success" ? "bg-green-50"    : "bg-red-50",
      type==="success" ? "text-green-700" : "text-red-700"
    );
    alertBox.innerHTML = arr.map(m => String(m)).join("<br>");
    alertBox.classList.remove("hidden");
    alertBox.scrollIntoView({ behavior:"smooth", block:"center" });
  };
  const hideAlert = () => { alertBox.classList.add("hidden"); alertBox.innerHTML = ""; };

  const setFieldError = (_wrap, input) => {
    input?.classList.add("ring-2","ring-red-300");
    input?.setAttribute("aria-invalid","true");
  };
  const clearFieldError = (_wrap, input) => {
    input?.classList.remove("ring-2","ring-red-300");
    input?.removeAttribute("aria-invalid");
  };

  const form = createElement("form", ["px-8","pb-8","space-y-6"]);
  form.noValidate = true;
  form.addEventListener("invalid", e => e.preventDefault(), true);


  const nativeDiv = createElement("div");
  const nativeLabel = createElement("label", ["block","mb-1.5","text-sm","font-medium","text-gray-800"], "Native Language");
  const nativeSelect = createElement("select", [
    "w-full","rounded-xl","border","border-gray-300","px-3","py-2.5","text-sm","bg-white",
    "focus:border-gray-400","focus:ring-2","focus:ring-gray-200","transition"
  ]);
  LANGS.forEach((lang,index) => {
    const option = createElement("option", [], lang);
    option.value = index; 
    nativeSelect.appendChild(option);
  });
  appendToParent(nativeDiv, [nativeLabel, nativeSelect]);

  const learningDiv = createElement("div");
  const learningLabel = createElement("label", ["block","mb-1.5","text-sm","font-medium","text-gray-800"], "Learning Language");
  const learningSelect = createElement("select", [
    "w-full","rounded-xl","border","border-gray-300","px-3","py-2.5","text-sm","bg-white",
    "focus:border-gray-400","focus:ring-2","focus:ring-gray-200","transition"
  ]);
  LANGS.forEach((lang,index) => {
    const option = createElement("option", [], lang);
    option.value = index;
    learningSelect.appendChild(option);
  });
  appendToParent(learningDiv, [learningLabel, learningSelect]);

  const imageUrlDiv = createElement("div");
  const imageUrlLabel = createElement("label", ["block","mb-1.5","text-sm","font-medium","text-gray-800"], "Image URL");
  const imageUrlInput = createElement("input", [
    "w-full","rounded-xl","border","border-gray-300","px-3","py-2.5","text-sm","bg-white",
    "focus:border-gray-400","focus:ring-2","focus:ring-gray-200","transition"
  ]);
  imageUrlInput.type = "url";
  imageUrlInput.placeholder = "https://example.com/avatar.jpg";
  appendToParent(imageUrlDiv, [imageUrlLabel, imageUrlInput]);

  const summary = createElement("div", ["flex","gap-2","flex-wrap"]);
  const chip = (t)=> createElement("span", ["inline-flex","items-center","gap-1","rounded-full","bg-gray-100","px-3","py-1","text-xs","text-gray-700"], t);
  const refreshSummary = () => {
    summary.innerHTML = "";
    const n = Number(nativeSelect.value) > 0 ? `Native: ${LANGS[Number(nativeSelect.value)]}` : "";
    const l = Number(learningSelect.value) > 0 ? `Learning: ${LANGS[Number(learningSelect.value)]}` : "";
    if (n) summary.appendChild(chip(n));
    if (l) summary.appendChild(chip(l));
  };
  nativeSelect.addEventListener("change", ()=>{ clearFieldError(nativeDiv, nativeSelect); refreshSummary(); });
  learningSelect.addEventListener("change", ()=>{ clearFieldError(learningDiv, learningSelect); refreshSummary(); });
  imageUrlInput.addEventListener("input", ()=> clearFieldError(imageUrlDiv, imageUrlInput));

  const tips = createElement("div", ["rounded-xl","bg-gray-50","border","border-gray-200","p-4","text-xs","text-gray-600"]);
  tips.innerHTML = "<strong>Tip:</strong> You can change these later from Settings. Choose your native and the language you want to practice.";

  const saveBtn = createElement("button", [
    "w-full","rounded-2xl","bg-gray-900","px-4","py-3","text-sm","font-semibold","text-white",
    "shadow-lg","transition","active:scale-[.99]","hover:bg-black","focus:outline-none","focus:ring-2","focus:ring-gray-300",
    "flex","items-center","justify-center","gap-2"
  ], "Save");

  const setLoading = (on) => {
    if (on) {
      saveBtn.disabled = true;
      saveBtn.classList.add("opacity-80","cursor-not-allowed");
      saveBtn.innerHTML = '<svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"></path></svg><span>Saving...</span>';
    } else {
      saveBtn.disabled = false;
      saveBtn.classList.remove("opacity-80","cursor-not-allowed");
      saveBtn.textContent = "Save";
    }
  };

  saveBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    hideAlert();

    const errors = [];
    const nativeIdx = Number(nativeSelect.value);
    const learningIdx = Number(learningSelect.value);
    const imageUrl = (imageUrlInput.value || "").trim();

    const isValidUrl = (u)=>{ try { new URL(u); return true; } catch { return false; } };

    if (!nativeIdx) { setFieldError(nativeDiv, nativeSelect); errors.push("Please select your native language."); }
    if (!learningIdx) { setFieldError(learningDiv, learningSelect); errors.push("Please select the language you are learning."); }
    if (nativeIdx && learningIdx && nativeIdx === learningIdx) { setFieldError(learningDiv, learningSelect); errors.push("Learning language must be different from native."); }
    if (!imageUrl) { setFieldError(imageUrlDiv, imageUrlInput); errors.push("Image URL is required."); }
    else if (!isValidUrl(imageUrl)) { setFieldError(imageUrlDiv, imageUrlInput); errors.push("Image URL must be a valid URL."); }

    const nativeId = ID_MAP[nativeIdx];
    const learningId = ID_MAP[learningIdx];
    if (nativeIdx && nativeId == null) errors.push(`Selected native language (“${LANGS[nativeIdx]}”) is not mapped to an ID.`);
    if (learningIdx && learningId == null) errors.push(`Selected learning language (“${LANGS[learningIdx]}”) is not mapped to an ID.`);

    if (errors.length) { showAlert(errors, "error"); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          native_language_id: Number(nativeId),
          learning_language_id: Number(learningId),
          image: imageUrl
        })
      });

      let data = null; try { data = await res.json(); } catch {}

      if (!res.ok) {
        const msg = data?.error || data?.message || `${res.status} ${res.statusText || "Request failed"}`;
        showAlert(msg, "error");
        return;
      }

      showAlert("Profile saved successfully!", "success");
      try { if (data?.data) localStorage.setItem("profile", JSON.stringify(data.data)); } catch {}
      refreshSummary();
    } catch {
      showAlert("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  });

  appendToParent(form, [nativeDiv, learningDiv, imageUrlDiv, summary, tips, saveBtn]);
  appendToParent(container, [banner, header, alertBox, form]);
  appendToParent(main, [blob1, blob2, container]);
  appendToParent(app, [main]);

  refreshSummary();
};
export default  createProfilePage;