/* eslint-disable prefer-destructuring */
import create from "../create";
import { getCloseButton } from "../close-button";

function getModalSave() {
  const modal = document.querySelector(".modal-window.modal-save");
  const overlay = create("div", "modal-overlay");
  modal.appendChild(overlay);

  const wrapper = create("div", "save-block");
  wrapper.appendChild(getCloseButton(modal));

  const title = create("div", "modal-title");
  title.setAttribute("data-lang", "save_code");
  title.textContent = "code";
  wrapper.appendChild(title);

  const container = create("div", "modal-container");
  const text = create("span");
  text.setAttribute("data-lang", "save_msg");
  text.textContent = "Your code is:";
  container.appendChild(text);

  const fileName = create("input", "save-block__code");
  fileName.setAttribute("type", "text");
  fileName.readonly = true;
  container.appendChild(fileName);

  const divAlert = create("div", "copy-alert");
  divAlert.textContent = "copy!";
  divAlert.setAttribute("data-lang", "copy_alert");

  const buttonCopy = create("button", "save-block__copy-button");
  buttonCopy.innerHTML = "<i class=\"far fa-copy\"></i>";
  buttonCopy.addEventListener("click", () => {
    fileName.select();
    document.execCommand("copy");
    fileName.blur();

    divAlert.classList.add("active");
    setTimeout(() => divAlert.classList.remove("active"), 1000);
  });
  container.appendChild(buttonCopy);

  container.appendChild(divAlert);

  wrapper.appendChild(container);

  modal.appendChild(wrapper);
}

function getFormConstructorData() {
  const form = document.querySelector(".form-constructor");
  const allInput = form.querySelectorAll("input");
  const data = [];
  allInput.forEach((input) => {
    const obj = {};
    obj.part = input.className.split(" ")[1];
    obj["data-target"] = input.getAttribute("data-target");
    obj.value = input.value;
    obj.text = input.textContent;
    obj["data-lang"] = input.getAttribute("data-lang");
    if (input.value === "custom_text") obj["data-text"] = input.getAttribute("data-text");
    obj["data-color"] = input.getAttribute("data-color");
    data.push(obj);
  });
  return data;
}

// сохранение промежуточных раскрасок пользователей
function saveColoring() {
  const saveButton = document.querySelector(".main-buttons__save");
  saveButton.addEventListener("click", () => {
    fetch("/save-coloring", {
      method: "POST",
      body: JSON.stringify(getFormConstructorData()),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => response.text())
      .then((body) => {
        const modal = document.querySelector(".modal-window.modal-save");
        modal.classList.add("open");
        const code = modal.querySelector(".save-block__code");
        code.value = body;
      });
  });
}

export { saveColoring, getModalSave, getFormConstructorData };
