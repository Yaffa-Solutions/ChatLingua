const createElement = (tag, classes = [], text = "") => {
  let element = document.createElement(tag);
  classes.forEach((clas) => {
    element.classList.add(clas);
  });
  element.textContent = text;
  return element;
};

const appendToParent = (parent, children = []) => {
  children.forEach((child) => {
    parent.appendChild(child);
  });
};

const createDivForm = (name) => {
  let div = createElement("div");
  let label = createElement(
    "label",
    ["block", "mb-1", "text-sm", "font-medium", "text-gray-900"],
    name
  );
  let input;
  input = createElement("input", [
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

  if (name == "Password"||name=="Confirm Password") {
    input.type = "password";
  } else {
    input.type = "text";
  }
  input.name = name;
  input.addEventListener("input", () => {
    let errorMessage = input.nextElementSibling;
    if (errorMessage && errorMessage.tagName === "P") {
      errorMessage.remove();
    }
  });
  appendToParent(div, [label, input]);
  return div;
};
