const app = document.getElementById("app");
const socket = io("https://chatlingua.onrender.com/");
let main;
let profileUserName;
let profileId;
let senderImage;
let receiver;
const LANGS = [
  "Select Language",
  "Arabic",
  "English",
  "French",
  "Spanish",
  "German",
  "Turkish",
];

let native_language;
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
      profileId = profile.data.id;
      senderImage = profile.data.image;
      profileImg.src = profile.data.image;
      profileUserName = profile.data.username;
      native_language = profile.data.native;
      profileName.textContent = `Welcome, ${profileUserName}`;
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
      userItem.addEventListener("click", () => {
        openChatModal(p);
        receiver = p.username;
      });
      userList.appendChild(userItem);
    });
  };

  appendToParent(sidebar, [profileSection, searchInput, userList]);

  // Main content
  main = createElement("div", [
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
  const mainText = createElement(
    "p",
    ["mt-4", "text-xl", "font-semibold", "text-gray-700"],
    "Start Learning Language by make conversation by people!"
  );
  appendToParent(main, [mainText]);

  appendToParent(app, [sidebar, main]);
}

function openChatModal(user) {
  const ChatName = "Chat";
  fetch("/chat", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: ChatName,
      username: user.username,
    }),
  })
    .then((res) => res.json())
    .then(({ data }) => {
      console.log(data[0].name);
      openMessageWindow(
        user.username,
        data[0].chat_id,
        data[0].name ? data[0].name : "Chat"
      );
    })
    .catch((err) => {});
}

const editChatModal = (chatId, chatName) => {
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

  const title = createElement(
    "h2",
    ["text-xl", "font-bold", "text-center"],
    "Edit Chat Name"
  );

  const errorContainer = createElement("div", []);

  const nameLabel = createElement("label", ["block", "text-sm"], "Chat Name");
  const nameInput = createElement("input", [
    "w-full",
    "rounded",
    "border",
    "p-2",
  ]);
  nameInput.type = "text";
  nameInput.value = chatName || "";

  const actions = createElement("div", [
    "flex",
    "justify-end",
    "gap-2",
    "mt-4",
  ]);
  const cancelBtn = createElement(
    "button",
    ["px-4", "py-2", "bg-gray-300", "rounded", "hover:bg-gray-400"],
    "Cancel"
  );
  const saveBtn = createElement(
    "button",
    [
      "px-4",
      "py-2",
      "bg-blue-500",
      "text-white",
      "rounded",
      "hover:bg-blue-600",
    ],
    "Save"
  );
  actions.append(saveBtn, cancelBtn);
  modal.append(title, nameLabel, nameInput, actions);
  overlay.append(modal);
  app.append(overlay);

  cancelBtn.addEventListener("click", () => overlay.remove());
  saveBtn.addEventListener("click", () => {
    const newName = nameInput.value.trim();

    let errors = [];
    if (!newName) errors.push("Please enter a chat name");

    errorContainer.innerHTML = "";
    if (errors.length) {
      errorContainer.appendChild(showErrorAlert(errors));
      return;
    }

    fetch(`/chat/${chatId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        errorContainer.innerHTML = "";
        if (data.error) {
          errorContainer.appendChild(showErrorAlert([data.error]));
          return;
        }
        socket.emit("changeChatName", { chat_id: chatId, chat_name: newName });
        Swal.fire({
          icon: "success",
          title: "Chat Name Updated",
          text: "Chat name has been updated successfully!",
          confirmButtonColor: "#3b82f6",
        }).then(() => {
          overlay.remove();
        });
      })
      .catch(() => {
        errorContainer.innerHTML = "";
        errorContainer.appendChild(showErrorAlert(["Network error"]));
      });
  });
};

socket.on("chatNameChanged", ({ chat_id, chat_name }) => {
//  openMessageWindow(receiver, chat_id, chat_name);
  console.log("Chat name changed:", chat_name);
  const chatTitle = document.querySelector("#chatTitle");
  console.log(chatTitle);
  if (chatTitle) chatTitle.textContent = chat_name;
});

const openProfileModal = (profile) => {
  console.log(profile);
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

  const title = createElement(
    "h2",
    ["text-xl", "font-bold", "text-center"],
    "Edit Profile"
  );

  const errorContainer = createElement("div", []);

  const nativeLabel = createElement(
    "label",
    ["block", "text-sm"],
    "Native Language"
  );
  const nativeSelect = createElement("select", [
    "w-full",
    "rounded",
    "border",
    "p-2",
  ]);
  LANGS.forEach((lang, i) => {
    const opt = createElement("option", [], lang);
    opt.value = i;
    if (i === profile.data.native_id) opt.selected = true;
    nativeSelect.appendChild(opt);
  });

  const learningLabel = createElement(
    "label",
    ["block", "text-sm"],
    "Learning Language"
  );
  const learningSelect = createElement("select", [
    "w-full",
    "rounded",
    "border",
    "p-2",
  ]);
  LANGS.forEach((lang, i) => {
    const opt = createElement("option", [], lang);
    opt.value = i;
    if (i === profile.data.learn_id) opt.selected = true;
    learningSelect.appendChild(opt);
  });

  const imgLabel = createElement("label", ["block", "text-sm"], "Image URL");
  const imgInput = createElement("input", [
    "w-full",
    "rounded",
    "border",
    "p-2",
  ]);
  imgInput.type = "url";
  imgInput.value = profile.data.image || "";

  const actions = createElement("div", [
    "flex",
    "justify-end",
    "gap-2",
    "mt-4",
  ]);
  const cancelBtn = createElement(
    "button",
    ["px-4", "py-2", "bg-gray-300", "rounded", "hover:bg-gray-400"],
    "Cancel"
  );
  const saveBtn = createElement(
    "button",
    [
      "px-4",
      "py-2",
      "bg-blue-500",
      "text-white",
      "rounded",
      "hover:bg-blue-600",
    ],
    "Save"
  );

  cancelBtn.addEventListener("click", () => overlay.remove());
  saveBtn.addEventListener("click", () => {
    const nativeIdx = Number(nativeSelect.value);
    const learningIdx = Number(learningSelect.value);
    const imageUrl = imgInput.value.trim();

    let errors = [];
    if (!nativeIdx) errors.push("Please select a native language");
    if (!learningIdx) errors.push("Please select a learning language");
    if (nativeIdx === learningIdx)
      errors.push("Native and learning languages cannot be the same");
    if (!imageUrl) errors.push("Please enter an image URL");

    errorContainer.innerHTML = "";
    if (errors.length) {
      errorContainer.appendChild(showErrorAlert(errors));
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
        errorContainer.innerHTML = "";
        if (data.error) {
          errorContainer.appendChild(showErrorAlert([data.error]));
          return;
        }
        Swal.fire({
          icon: "success",
          title: "Profile Updated",
          text: "Your profile has been updated successfully!",
          confirmButtonColor: "#3b82f6",
        }).then(() => {
          overlay.remove();
          createHomePage();
        });
      })
      .catch(() => {
        errorContainer.innerHTML = "";
        errorContainer.appendChild(showErrorAlert(["Network error"]));
      });
  });

  actions.append(cancelBtn, saveBtn);
  modal.append(
    title,
    errorContainer,
    nativeLabel,
    nativeSelect,
    learningLabel,
    learningSelect,
    imgLabel,
    imgInput,
    actions
  );
  overlay.appendChild(modal);
  app.appendChild(overlay);
};

function openMessageWindow(username, chatId, chatName) {
  let IsDeleted;

  fetch(`/checkChat?chat_id=${chatId}&profile_id=${profileId}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then(({ data }) => {
      IsDeleted = data[0].deleted_by;

      if (!IsDeleted) {
        return fetch(
          `/chat/messages?chat_id=${chatId}&profile_id=${profileId}`
        );
      }
    })
    .then((res) => res.json())
    .then(({ data: { messages } }) => {
      console.log(messages);
      messages.forEach((m) => {
        renderMessage(m.content, m.sender_id, m.id, m.sender_image);
      });
    })
    .catch((err) => console.error(err));

  let receiverUserName = username;
  // Clear main content
  main.innerHTML = "";

  // Chat header
  const chatHeader = createElement("div", [
    "relative",
    "p-3",
    "border-b",
    "text-lg",
    "text-left",
    "bg-white",
    "w-full",
    "flex",
    "items-center",
    "justify-between",
  ]);

  const chatTitle = createElement("span", ["font-bold"], chatName );
  chatTitle.id='chatTitle';
    const headerMenuIcon = createElement(
    "span",
    ["relative", "cursor-pointer", "text-xl", "select-none"],
    "⋮"
  );

  const headerDropdown = createElement("div", [
    "absolute",
    "left-[-150px]",
    "top-full",
    "mt-1",
    "w-40",
    "bg-white",
    "rounded-md",
    "shadow-lg",
    "text-sm",
    "z-10",
  ]);
  headerDropdown.style.display = "none";

  const editChatOption = createElement(
    "div",
    ["px-3", "py-2", "cursor-pointer", "hover:bg-gray-100"],
    "Edit Chat Name"
  );
  const deleteChatOption = createElement(
    "div",
    ["px-3", "py-2", "cursor-pointer", "hover:bg-gray-100"],
    "Delete Chat"
  );

  appendToParent(headerDropdown, [editChatOption, deleteChatOption]);
  appendToParent(chatHeader, [chatTitle, headerMenuIcon]);
  headerMenuIcon.appendChild(headerDropdown);

  let isOpen = false;
  headerMenuIcon.addEventListener("click", (e) => {
    e.stopPropagation();
    isOpen = !isOpen;
    headerDropdown.style.display = isOpen ? "block" : "none";
  });

  document.addEventListener("click", (e) => {
    if (!headerMenuIcon.contains(e.target)) {
      headerDropdown.style.display = "none";
      isOpen = false;
    }
  });

  editChatOption.addEventListener("click", () => {

    editChatModal(chatId, chatName);
  });
  deleteChatOption.addEventListener("click", () => {
    Swal.fire({
      title: "Are you sure?",
      html: `
      <div class="text-center mx-auto">
        <p>Do you want to delete this chat?</p>
        <label class="flex mb-2 justify-center items-center gap-3">
          <input type="checkbox" id="deleteForOther">
          Delete for the other person too
        </label>
      </div>
    `,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const checkbox = Swal.getPopup().querySelector("#deleteForOther");
        const deleteForOther = checkbox.checked;

        if (deleteForOther) {
          fetch(`/chat/${chatId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((data) => {
              socket.emit("deleteChat", { chat_id: chatId });
              console.log(data);
              Swal.fire(
                "Deleted!",
                "Chat has been deleted for both users.",
                "success"
              );
            })
            .catch(() => {
              Swal.fire("Error!", "Something went wrong.", "error");
            });
        } else {
          fetch("/chat_profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              profile_id: profileId,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              Swal.fire(
                "Deleted!",
                "Chat has been deleted for you.",
                "success"
              );
              main.innerHTML = "";
              const mainText = createElement(
                "p",
                ["mt-4", "text-xl", "font-semibold", "text-gray-700"],
                "Start Learning Language by make conversation by people!"
              );
              appendToParent(main, [mainText]);
            })
            .catch((err) => console.error(err));
        }
      }
    });
  });

  socket.on("chatDeleted", ({ chat_id }) => {
    main.innerHTML = "";
    const mainText = createElement(
      "p",
      ["mt-4", "text-xl", "font-semibold", "text-gray-700"],
      "Start Learning Language by make conversation by people!"
    );
    appendToParent(main, [mainText]);
  });

  // Messages container (fills available space)
  let messagesContainer = createElement("div", [
    "flex-1",
    "w-full",
    "overflow-y-auto",
    "p-3",
    "flex",
    "flex-col",
    "gap-2",
  ]);

  // Input area
  const inputWrapper = createElement("div", [
    "flex",
    "border-t",
    "p-2",
    "gap-2",
    "w-full",
  ]);

  let pTyping = createElement("p", [
    "mt-auto",
    "text-gray-500",
    "italic",
    "text-left",
  ]);

  let chatInput = createElement("input", [
    "flex-1",
    "border",
    "p-2",
    "rounded",
  ]);
  chatInput.placeholder = "Type a message...";

  let typingTime;
  socket.off("userTyping").on("userTyping", ({ username }) => {
    clearTimeout(typingTime);
    typingTime = setTimeout(() => {
      pTyping.textContent = "";
    }, 1000);
    pTyping.textContent = `${username} is Typing`;
  });

  chatInput.addEventListener("input", () => {
    socket.emit("typing", profileUserName, chatId);
  });
  let sendBtn = createElement(
    "button",
    ["bg-blue-500", "text-white", "px-4", "rounded"],
    "Send"
  );
  inputWrapper.append(chatInput, sendBtn);

  appendToParent(main, [chatHeader, messagesContainer, pTyping, inputWrapper]);
  let openDropdown = null;
  const renderMessage = (content, sender_id, messageId = 0, senderImg) => {
    const profileImg = createElement("img", [
      "w-12",
      "h-12",
      "p-2",
      "rounded-full",
      "object-cover",
    ]);

    profileImg.src = senderImg;

    const msgWrapper = createElement("div", [
      "flex",
      "flex-col",
      "w-full",
      "mb-2",
      sender_id == profileId ? "items-end" : "items-start",
    ]);

    const msgContainer = createElement("div", [
      "relative",
      "flex",
      sender_id == profileId ? "flex-row-reverse" : "flex-row",
      "max-w-xs",
    ]);

    const msgEl = createElement(
      "div",
      [
        "p-3",
        "rounded-xl",
        "break-words",
        "shadow",
        sender_id == profileId ? "bg-blue-500" : "bg-gray-200",
        sender_id == profileId ? "text-white" : "text-gray-900",
      ],
      content
    );
    msgEl.setAttribute("data-id", messageId);
    msgContainer.appendChild(profileImg);

    msgContainer.appendChild(msgEl);
    const menuIcon = createElement(
      "span",
      [
        "absolute",
        sender_id == profileId ? "left-[-25px]" : "right-[-25px]",
        "top-1/2",
        "-translate-y-1/2",
        "cursor-pointer",
        "text-gray-400",
        "hover:text-blue-400",
        "text-lg",
        "select-none",
        "opacity-0",
        "transition-opacity",
        "duration-200",
      ],
      "⋮"
    );

    msgWrapper.addEventListener("mouseenter", () => {
      menuIcon.style.opacity = "1";
    });
    msgWrapper.addEventListener("mouseleave", () => {
      menuIcon.style.opacity = "0";
    });

    msgContainer.appendChild(menuIcon);

    const dropdown = createElement("div", [
      "absolute",
      sender_id == profileId ? "left-[-30px]" : "left-0",
      "top-full",
      "mt-1",
      "w-28",
      "bg-white",
      "rounded-md",
      "shadow-lg",
      "text-sm",
      "z-10",
    ]);
    dropdown.style.display = "none";

    const translateOption = createElement(
      "div",
      ["px-3", "py-2", "hover:bg-gray-100", "cursor-pointer"],
      "Translate"
    );
    const deleteOption = createElement(
      "div",
      ["px-3", "py-2", "hover:bg-gray-100", "cursor-pointer"],
      "Delete"
    );

    dropdown.appendChild(translateOption);
    dropdown.appendChild(deleteOption);
    msgContainer.appendChild(dropdown);

    menuIcon.onclick = (e) => {
      e.stopPropagation();
      if (openDropdown && openDropdown !== dropdown) {
        openDropdown.style.display = "none";
      }
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
      openDropdown = dropdown.style.display === "block" ? dropdown : null;
    };
    document.addEventListener("click", (e) => {
      if (openDropdown) {
        if (!openDropdown.contains(e.target) && !menuIcon.contains(e.target)) {
          openDropdown.style.display = "none";
          openDropdown = null;
        }
      }
    });
    let isTranslated = false;
    translateOption.onclick = () => {
      if (!isTranslated) {
        fetch("/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, native_language }),
        })
          .then((res) => res.json())
          .then(({ data }) => {
            msgEl.textContent = data;
            translateOption.textContent = "Original";
            isTranslated = true;
          })
          .catch((err) => console.log(err));
      } else {
        msgEl.textContent = content;
        translateOption.textContent = "Translate";
        isTranslated = false;
      }
    };

    deleteOption.onclick = () => {
      const id = msgEl.getAttribute("data-id");
      if (openDropdown === dropdown) openDropdown = null;

      sender_id == profileId
        ? Swal.fire({
            title: "Delete message?",
            html: `
    <div class="flex flex-col items-center gap-2 text-left">
      <label class="flex items-center gap-2">
        <input type="radio" name="deleteOption" value="me">
        <span>Delete for me</span>
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" name="deleteOption" value="everyone">
        <span>Delete for everyone</span>
      </label>
    </div>
  `,
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            focusConfirm: false,
            preConfirm: () => {
              const option = document.querySelector(
                'input[name="deleteOption"]:checked'
              )?.value;
              if (!option) {
                Swal.showValidationMessage("Please select an option");
              }
              return option;
            },
          }).then((result) => {
            if (result.isConfirmed) {
              if (result.value === "me") {
                fetch("/removeMessageFor", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    profile_id: parseInt(profileId),
                    message_id: parseInt(id),
                  }),
                })
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data);
                    removeMessageFor(parseInt(id));
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              } else if (result.value === "everyone") {
                fetch(`/message/${parseInt(id)}`, {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                })
                  .then((res) => res.json())
                  .then((result) => {
                    console.log(result);
                    socket.emit("removeMessage", {
                      messageId: id,
                      chat_id: chatId,
                    });
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }
            }
          })
        : Swal.fire({
            title: "Delete message for me?",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
          }).then((result) => {
            if (result.isConfirmed) {
              console.log("here", profileId);
              fetch("/removeMessageFor", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  profile_id: parseInt(profileId),
                  message_id: parseInt(id),
                }),
              })
                .then((res) => res.json())
                .then((data) => {
                  console.log(data);
                  removeMessageFor(parseInt(id));
                })
                .catch((err) => {
                  console.error(err);
                });
            }
          });
    };

    function removeMessageFor(messageId) {
      const msgToRemove = document.querySelector(`[data-id="${messageId}"]`);
      if (msgToRemove) {
        msgToRemove.parentElement.parentElement.remove();
        console.log("Message removed:", messageId);
      }
    }

    socket.on("removedMessage", ({ messageId }) => {
      console.log(messageId);
      removeMessageFor(messageId);
    });
    msgWrapper.appendChild(msgContainer);
    messagesContainer.appendChild(msgWrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  // Join chat room
  socket.emit("UserJoin", profileUserName, chatId);

  // Receive messages
  socket
    .off("receiveMessage")
    .on(
      "receiveMessage",
      ({ messageId, chat_id, content, sender_id, sender_image }) => {
        if (chatId !== chat_id) return;
        renderMessage(content, sender_id, messageId, sender_image);
        fetch(`/restoreChat?chat_id=${chatId}&profile_id=${profileId}`, {
          method: "GET",
        });
      }
    );

  // Notify when new user joins

  socket.off("UserJoined");

  socket.on("UserJoined", ({ username: receiverUserName }) => {
    const infoEl = createElement(
      "div",
      ["text-gray-500", "text-sm", "italic"],
      `${
        receiverUserName === profileUserName ? "you" : receiverUserName
      } joined the chat`
    );

    messagesContainer.appendChild(infoEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  // Send message
  sendBtn.onclick = () => {
    const msg = chatInput.value.trim();
    if (!msg) return;
    let profileId_receiver;
    console.log(receiverUserName);
    fetch(`/profiles/${receiverUserName}`)
      .then((res) => res.json())
      .then(({ data }) => {
        profileId_receiver = data.profile[0].id;
        return fetch("/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: parseInt(chatId),
            content: msg,
            sender_id: parseInt(profileId),
            receiver_id: parseInt(profileId_receiver),
          }),
        });
      })
      .then((result) => result.json())
      .then(({ data: { messages } }) => {
        console.log(messages);
        socket.emit("sendMessage", {
          messageId: messages.id,
          chat_id: chatId,
          content: msg,
          sender_id: profileId,
          receiver_id: profileId_receiver,
          sender_image: senderImage,
        });
        chatInput.value = "";
        fetch(`/restoreChat?chat_id=${chatId}&profile_id=${profileId}`, {
          method: "GET",
        }).catch((err) => console.log(err));
      })
      .catch((err) => {
        console.error(err);
      });
  };
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
