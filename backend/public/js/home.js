const app = document.getElementById("app");
const socket = io("https://chatlingua.onrender.com/");
let main;
let profileUserName;
let profileId;
let senderImage;
let receiver = {};
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

function openMessageWindow(username, chatId, chatName) {
  let IsDeleted;
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

    const msgClasses = [
      "px-4",
      "py-[2px]",
      "rounded-2xl",
      "text-sm",
      "flex",
      "items-center",
      "justify-center",
      "shadow-sm",
      "break-words",
    ];
    if (sender_id == profileId) {
      msgClasses.push(
        "bg-gradient-to-r",
        "from-blue-700",
        "to-cyan-500",
        "text-white",
        "rounded-br-none"
      );
    } else {
      msgClasses.push(
        "bg-white",
        "text-gray-900",
        "rounded-bl-none",
        "border",
        "border-gray-200"
      );
    }

    const msgEl = createElement("div", msgClasses, content);

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
      }
    }

    socket.on("removedMessage", ({ messageId }) => {
      removeMessageFor(messageId);
    });
    msgWrapper.appendChild(msgContainer);
    messagesContainer.appendChild(msgWrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

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
    "py-[10px]",
    "px-3",
    "border-b",
    "text-lg",
    "text-left",
    "bg-white",
    "w-full",
    "flex",
    "items-center",
    "justify-between",
  ]);

  const divReceiver = createElement("div", ["flex", "items-center", "gap-2"]);

  const recImg = createElement("img", [
    "w-10",
    "h-10",
    "rounded-full",
    "object-cover",
  ]);

  recImg.src = receiver.image;

  const chatTitle = createElement(
    "span",
    ["font-medium"],
    chatName,
    receiver.lang
  );
  chatTitle.id = "chatTitle";

  const divRec = createElement("div", ["flex", "flex-col"]);

  const chatLang = createElement(
    "span",
    ["text-sm", "text-gray-500", "-mt-1"],
    receiver.lang
  );

  appendToParent(divRec, [chatTitle, chatLang]);

  appendToParent(divReceiver, [recImg, divRec]);

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

  // const editChatOption = createElement(
  //   "div",
  //   ["px-3", "py-2", "cursor-pointer", "hover:bg-gray-100"],
  //   "Edit Chat Name"
  // );
  const deleteChatOption = createElement(
    "div",
    ["px-3", "py-2", "cursor-pointer", "hover:bg-gray-100"],
    "Delete Chat"
  );

  appendToParent(headerDropdown, [deleteChatOption]);
  appendToParent(chatHeader, [divReceiver, headerMenuIcon]);
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

  // editChatOption.addEventListener("click", () => {
  //   editChatModal(chatId, chatName);
  // });
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
    "px-4",
    "py-2",
    "rounded-full",
    "border",
    "border-gray-300",
    "focus:outline-none",
    "ring-2",
    "ring-cyan-500",
    "focus:ring-2",
    "focus:ring-cyan-500",
    "text-sm",
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
    [
      "px-3",
      "py-2",
      "rounded-full",
      "text-white",
      "bg-gradient-to-r",
      "from-blue-700",
      "to-cyan-500",
      "hover:opacity-90",
      "transition",
    ],
    ""
  );

  const sendIcon = createElement("i", ["fa-solid", "fa-paper-plane"]);
  appendToParent(sendBtn, [sendIcon]);
  inputWrapper.append(chatInput, sendBtn);

  appendToParent(main, [chatHeader, messagesContainer, pTyping, inputWrapper]);

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

export function createHomePage() {
  app.innerHTML = "";
  app.classList.add("flex", "h-screen", "bg-gray-50", "font-sans");

  // Sidebar
  const sidebar = createElement("div", [
    "w-72",
    "bg-white",
    "border-r",
    "flex",
    "flex-col",
  ]);
  // Profile section
  const profileSection = createElement("div", [
    "px-4",
    "py-3",
    "flex",
    "items-center",
    "gap-2",
    "bg-gradient-to-r",
    "from-blue-700",
    "to-cyan-500",
  ]);
  const profileImg = createElement("img", [
    "h-10",
    "w-10",
    "rounded-full",
    "object-cover",
    "border-2",
    "border-white",
  ]);
  const profileName = createElement("span", [
    "text-md",
    "font-medium",
    "text-white",
  ]);
  const editBtn = createElement("button", [
    "ml-auto",
    "bg-white/30",
    "text-white",
    "py-1",
    "px-2",
    "rounded",
  ]);

  // Change icon to settings gear
  editBtn.innerHTML = `<i class="fas fa-gear"></i>`;

  // Search bar
  // Create search container
  const searchContainer = createElement("div", [
    "w-full",
    "px-4",
    "py-3",
    "border-b",
    "border-gray-100",
    "bg-white",
    "flex",
    "justify-center",
  ]);

  // Inner wrapper (to hold icon + input)
  const searchWrapper = createElement("div", [
    "flex",
    "items-center",
    "gap-2",
    "w-full",
    "max-w-md",
    "px-4",
    "py-2",
    "rounded-full",
    "border",
    "ring-2",
    "ring-cyan-500",
    "bg-white",
  ]);

  // Search icon
  const searchIcon = document.createElement("i");
  searchIcon.classList.add("fas", "fa-search", "text-gray-400");

  // Input field
  const searchInput = createElement("input", [
    "flex-1",
    "outline-none",
    "text-gray-700",
  ]);
  searchInput.type = "text";
  searchInput.placeholder = "Search users...";

  // Append icon + input to wrapper
  appendToParent(searchWrapper, [searchIcon, searchInput]);

  // Append wrapper to container
  appendToParent(searchContainer, [searchWrapper]);

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
    "px-1",
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
        "user-item",
        "flex",
        "items-center",
        "gap-2",
        "mx-1",
        "rounded-lg",
        "px-3",
        "py-[14px]",
        "hover:bg-gray-100",
        "cursor-pointer",
      ]);
      userItem.dataset.username = p.username;
      const uImg = createElement("img", [
        "w-10",
        "h-10",
        "rounded-full",
        "object-cover",
      ]);
      uImg.src = p.image;
      const uDiv = createElement("div", ["flex", "flex-col"]);
      const uName = createElement("span", ["font-medium"], p.username);
      const spanNativeLang = createElement(
        "span",
        ["text-sm", "text-gray-500"],
        `Native in ${LANGS[p.native_language_id]}`
      );
      appendToParent(uDiv, [uName, spanNativeLang]);
      userItem.append(uImg, uDiv);
      userItem.addEventListener("click", () => {
        receiver.name = p.username;
        receiver.image = p.image;
        receiver.lang = `Native ${LANGS[p.native_language_id]}`;

        document.querySelectorAll(".user-item").forEach((el) => {
          el.classList.remove(
            "bg-gradient-to-r",
            "from-blue-700/20",
            "to-cyan-500/20"
          );
          if (el.dataset.username === p.username) {
            el.classList.add(
              "bg-gradient-to-r",
              "from-blue-700/20",
              "to-cyan-500/20"
            );
          }
        });

        openChatModal(p);
      });
      userList.appendChild(userItem);
    });
  };

  appendToParent(sidebar, [profileSection, searchContainer, userList]);

  // Main content
  main = createElement("div", [
    "flex",
    "flex-col",
    "flex-1",
    "h-full",
    "items-center",
    "justify-center",
    "text-center",
    "gap-4",
  ]);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("viewBox", "0 0 640 640");
  svg.classList.add("w-12", "h-12");

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  const linearGradient = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "linearGradient"
  );
  linearGradient.setAttribute("id", "sendGradient");
  linearGradient.setAttribute("x1", "0%");
  linearGradient.setAttribute("y1", "0%");
  linearGradient.setAttribute("x2", "100%");
  linearGradient.setAttribute("y2", "0%");

  const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#1778c7ff");

  const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "#1894ceff");

  appendToParent(linearGradient, [stop1, stop2]);
  appendToParent(defs, [linearGradient]);

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "url(#sendGradient)");
  path.setAttribute(
    "d",
    "M64 304C64 358.4 83.3 408.6 115.9 448.9L67.1 538.3C65.1 542 64 546.2 64 550.5C64 564.6 75.4 576 89.5 576C93.5 576 97.3 575.4 101 573.9L217.4 524C248.8 536.9 283.5 544 320 544C461.4 544 576 436.5 576 304C576 171.5 461.4 64 320 64C178.6 64 64 171.5 64 304zM158 471.9C167.3 454.8 165.4 433.8 153.2 418.7C127.1 386.4 112 346.8 112 304C112 200.8 202.2 112 320 112C437.8 112 528 200.8 528 304C528 407.2 437.8 496 320 496C289.8 496 261.3 490.1 235.7 479.6C223.8 474.7 210.4 474.8 198.6 479.9L140 504.9L158 471.9zM208 336C225.7 336 240 321.7 240 304C240 286.3 225.7 272 208 272C190.3 272 176 286.3 176 304C176 321.7 190.3 336 208 336zM352 304C352 286.3 337.7 272 320 272C302.3 272 288 286.3 288 304C288 321.7 302.3 336 320 336C337.7 336 352 321.7 352 304zM432 336C449.7 336 464 321.7 464 304C464 286.3 449.7 272 432 272C414.3 272 400 286.3 400 304C400 321.7 414.3 336 432 336z"
  );

  appendToParent(svg, [defs, path]);

  const heading = createElement(
    "h1",
    ["text-xl", "font-semibold", "text-black"],
    "Select a conversation"
  );
  const paragraph = createElement(
    "p",
    ["text-sm", "-mt-2", "text-gray-700"],
    "Choose a contact from the sidebar to start chatting"
  );

  appendToParent(main, [svg, heading, paragraph]);
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
      openMessageWindow(user.username, data[0].chat_id, user.username);
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
    ["px-4", "py-2", "bg-gray-300", "rounded-xl", "hover:bg-gray-400"],
    "Cancel"
  );
  const saveBtn = createElement(
    "button",
    [
      "px-4",
      "py-2",
      "bg-gradient-to-r",
      "from-blue-700",
      "to-cyan-500",
      "text-white",
      "rounded-xl",
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
  const chatTitle = document.querySelector("#chatTitle");
  if (chatTitle) chatTitle.textContent = chat_name;
});

const openProfileModal = (profile) => {
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
    ["px-4", "py-2", "bg-gray-300", "rounded-xl", "hover:bg-gray-400"],
    "Cancel"
  );
  const saveBtn = createElement(
    "button",
    [
      "px-4",
      "py-2",
      "bg-gradient-to-r",
      "from-blue-700",
      "to-cyan-500",
      "text-white",
      "rounded-xl",
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
