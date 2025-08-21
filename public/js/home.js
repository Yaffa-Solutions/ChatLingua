const app = document.getElementById("app");

export function createHomePage() {
  app.innerHTML = "";
  app.classList.add("flex", "h-screen", "bg-gray-100", "font-sans");

  // Sidebar
  const sidebar = createElement("div", [
    "w-72",
    "bg-white",
    "border-r",
    "p-4",
    "flex",
    "flex-col",
    "gap-4",
  ]);
  // Profile section
  const profileSection = createElement("div", [
    "flex",
    "items-center",
    "gap-3",
  ]);
  const profileImg = createElement("img", [
    "w-12",
    "h-12",
    "rounded-full",
    "object-cover",
  ]);
  const profileName = createElement("span", ["font-semibold"]);
  const editBtn = createElement("button", [
    "ml-auto",
    "bg-black",
    "text-white",
    "py-1",
    "px-2",
    "rounded",
  ]);
  editBtn.innerHTML = `<i class="fas fa-edit"></i>`;

  // Search bar
  const searchInput = createElement("input", [
    "border",
    "border-gray-300",
    "rounded",
    "p-2",
    "w-full",
  ]);
  searchInput.placeholder = "Search users...";

  profileSection.append(profileImg, profileName, editBtn);
  fetch("/profile", { credentials: "include" })
    .then((res) => res.json())
    .then((profile) => {
      profileImg.src = profile.data.image;
      profileName.textContent = `Welcome, ${profile.data.username}`;

      editBtn.addEventListener("click", () => openProfileModal(profile));

      const learnId = profile.data.learn_id;
      return fetch(`/chat/profiles/${learnId}`, { credentials: "include" });
    })
    .then((res) => res.json())
    .then((data) => {
      const profiles = data?.data?.profiles || [];
      renderList(profiles);
    })
    .catch((err) => {
      console.error("Failed to load profiles:", err);
    });

  const userList = createElement("div", [
    "flex",
    "flex-col",
    "gap-2",
    "overflow-y-auto",
  ]);


  // Users list
  const renderList = (profiles) => {
    if (!profiles.length) {
      const emptyMsg = createElement(
        "div",
        ["text-sm", "text-gray-400", "p-2"],
        "No users found"
      );
      appendToParent(userList, emptyMsg);
    }
    profiles.forEach((p) => {
      const userItem = createElement("div", [
        "flex",
        "items-center",
        "gap-2",
        "p-2",
        "hover:bg-gray-100",
        "border-b",
        "border-gray-300",
        "cursor-pointer",
      ]);
      const uImg = createElement("img", [
        "w-10",
        "h-10",
        "rounded-full",
        "object-cover",
      ]);
      uImg.src = p.image;
      const uName = createElement("span", ["font-medium"], p.username);
      userItem.append(uImg, uName);
      userItem.addEventListener('click',()=>openChatModal(p))
      userList.appendChild(userItem);
    });
  };

  appendToParent(sidebar, [profileSection, searchInput, userList]);

  // Main content
  const main = createElement("div", [
    "flex-1",
    "flex",
    "flex-col",
    "justify-center",
    "items-center",
    "bg-gradient-to-b",
    "from-blue-100",
    "to-white",
    "text-center",
  ]);
  const mainImg = createElement("img", ["w-1/2", "rounded-lg", "shadow-lg"]);
  const mainText = createElement(
    "p",
    ["mt-4", "text-xl", "font-semibold", "text-gray-700"],
    "Start Learning Language by make conversation by people!"
  );
  appendToParent(main, [mainImg, mainText]);

  appendToParent(app, [sidebar, main]);
}

function openChatModal(user) {
  const overlay = createElement("div", [
    "fixed",
    "inset-0",
    "bg-black/50",
    "flex",
    "items-center",
    "justify-center",
    "z-50",
  ]);

  const modal = createElement("div", [
    "bg-white",
    "p-6",
    "rounded-lg",
    "shadow-lg",
    "w-80",
    "flex",
    "flex-col",
    "gap-4",
  ]);

  const title = createElement(
    "h2",
    ["text-lg", "font-semibold"],
    `Start chat with ${user.username}`
  );

  const chatNameInput = createElement("input", [
    "border",
    "border-gray-300",
    "rounded",
    "p-2",
    "w-full",
  ]);
  chatNameInput.placeholder = "Enter chat name";
  chatNameInput.value=user.username;

  const actions = createElement("div", ["flex", "justify-end", "gap-2"]);
  const cancelBtn = createElement(
    "button",
    ["px-3", "py-1", "rounded", "bg-gray-300", "hover:bg-gray-400"],
    "Cancel"
  );
  const joinBtn = createElement(
    "button",
    [
      "px-3",
      "py-1",
      "rounded",
      "bg-blue-500",
      "text-white",
      "hover:bg-blue-600",
    ],
    "Join"
  );

  cancelBtn.addEventListener("click", () => overlay.remove());
  joinBtn.addEventListener("click", () => {
    const chatName = chatNameInput.value.trim();
    fetch('/chat', {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: chatName,
      })
    }).then(res=>res.json())
    .then(({data})=>{
      console.log(data)
      console.log(data.chat.id,data.chat.name)
      if(data.error){
        console.log(data.error)
        alert(data.error)
        return
      }
      openMessageWindow(data.chat.id,data.chat.name)
    })
    overlay.remove();
  });

  actions.append(cancelBtn, joinBtn);
  modal.append(title, chatNameInput, actions);
  overlay.appendChild(modal);
  app.appendChild(overlay);
}

const openProfileModal=(profile)=> {
  console.log(profile)
  const overlay = createElement("div", [
    "fixed",
    "inset-0",
    "bg-black/50",
    "flex",
    "items-center",
    "justify-center",
    "z-50",
  ]);

  const modal = createElement("div", [
    "bg-white",
    "p-6",
    "rounded-2xl",
    "shadow-lg",
    "w-full",
    "max-w-lg",
    "space-y-4",
  ]);

  const title = createElement("h2", ["text-xl", "font-bold","text-center"], "Edit Profile");

  const LANGS = [
    "Select Language",
    "Arabic",
    "English",
    "French",
    "Spanish",
    "German",
    "Turkish",
  ];

  const nativeLabel = createElement("label", ["block", "text-sm"], "Native Language");
  const nativeSelect = createElement("select", [
    "w-full","rounded","border","p-2"
  ]);
  LANGS.forEach((lang, i) => {
    const opt = createElement("option", [], lang);
    opt.value = i;
    if (i === profile.data.native_id) opt.selected = true;
    nativeSelect.appendChild(opt);
  });

  const learningLabel = createElement("label", ["block", "text-sm"], "Learning Language");
  const learningSelect = createElement("select", [
    "w-full","rounded","border","p-2"
  ]);
  LANGS.forEach((lang, i) => {
    const opt = createElement("option", [], lang);
    opt.value = i;
    if (i === profile.data.learn_id) opt.selected = true;
    learningSelect.appendChild(opt);
  });

  const imgLabel = createElement("label", ["block", "text-sm"], "Image URL");
  const imgInput = createElement("input", [
    "w-full","rounded","border","p-2"
  ]);
  imgInput.type = "url";
  imgInput.value = profile.data.image || "";

  const actions = createElement("div", ["flex","justify-end","gap-2","mt-4"]);
  const cancelBtn = createElement("button", [
    "px-4","py-2","bg-gray-300","rounded","hover:bg-gray-400"
  ], "Cancel");
  const saveBtn = createElement("button", [
    "px-4","py-2","bg-blue-500","text-white","rounded","hover:bg-blue-600"
  ], "Save");

  cancelBtn.addEventListener("click", () => overlay.remove());
  saveBtn.addEventListener("click", () => {
    const nativeIdx = Number(nativeSelect.value);
    const learningIdx = Number(learningSelect.value);
    const imageUrl = imgInput.value.trim();

    if (!nativeIdx || !learningIdx || nativeIdx === learningIdx || !imageUrl) {
      alert("Please fill all fields correctly!");
      return;
    }

    fetch(`/profile`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        native_language_id: nativeIdx,
        learning_language_id: learningIdx,
        image: imageUrl,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
          return;
        }
        alert("Profile updated!");
        overlay.remove();
        createHomePage();
      })
      .catch(() => {
        alert("Network error");
      });
  });

  actions.append(cancelBtn, saveBtn);
  modal.append(title, nativeLabel, nativeSelect, learningLabel, learningSelect, imgLabel, imgInput, actions);
  overlay.appendChild(modal);
  app.appendChild(overlay);
}

function showErrorAlert(errors = []) {
  if (!errors.length) return null;

  const alert = document.createElement("div");
  alert.className =
    "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4";
  alert.setAttribute("role", "alert");

  const title = document.createElement("strong");
  title.className = "font-bold";
  title.textContent = "Errors:";

  const ul = document.createElement("ul");
  ul.className = "list-disc pl-5 mt-1 text-sm";

  errors.forEach((err) => {
    const li = document.createElement("li");
    li.textContent = err;
    ul.appendChild(li);
  });

  alert.appendChild(title);
  alert.appendChild(ul);

  return alert;
}


export default createHomePage;
