import { getFormConstructorData } from "../save-coloring/save-coloring";
import create from "../create";
import { getCloseButton } from "../close-button";

function getModalOrder() {
  const modal = document.querySelector(".modal-window.modal-order");
  const overlay = create("div", "modal-overlay");
  modal.appendChild(overlay);

  const wrapper = create("div", "order-block");
  wrapper.appendChild(getCloseButton(modal));

  const title = create("div", "modal-title");
  title.setAttribute("data-lang", "order_title");
  title.textContent = "thank you!";
  wrapper.appendChild(title);

  const container = create("div", "modal-container");
  const text = create("span", "order_msg");
  text.setAttribute("data-lang", "order_msg");
  text.textContent = "We will contact you soon.";
  container.appendChild(text);

  wrapper.appendChild(container);

  modal.appendChild(wrapper);
}

// add ERROR class
const addErrorClass = (part, target, input) => {
  const preview = document.querySelector(".constructor__item.preview");
  const title = preview.querySelector(".constructor__title");
  title.classList.add("error");

  const previewBlock = preview.querySelector(`.constructor__data-block.${part}`);
  const previewField = previewBlock.querySelector(`.preview-chain[data-target="${target}"]`);
  previewField.classList.add("error");

  if (input.value === "def") {
    const val = previewField.querySelector(".preview-chain__value");
    val.textContent = "";
  }
};

// проверка, что все поля заполнены
const checkRequiredFilds = () => {
  let flag = true;
  const form = document.querySelector(".form-constructor");
  const allInput = form.querySelectorAll("input");
  allInput.forEach((input) => {
    if (input.required) {
      const part = input.className.split(" ")[1];
      const target = input.getAttribute("data-target");
      if (input.value === "NULL" || input.value === "" || input.value === "def") {
        addErrorClass(part, target, input);
        flag = false;
      } else if (part === "logo") {
        if (input.getAttribute("data-color") === null) {
          addErrorClass(part, target, input);
          flag = false;
        }
      } else if (target === "main_deployment_handle" || target === "reserve_handle" || target === "choose_color") {
        if (input.getAttribute("data-color") === null) {
          addErrorClass(part, target, input);
          flag = false;
        }
      }
    }
  });
  return flag;
};

// отправка заказа
const sendOrder = () => {
  const orderButton = document.querySelector(".navigation-buttons.order");
  orderButton.addEventListener("click", () => {
    if (checkRequiredFilds()) {
      console.log("send order");

      fetch("/send-order", {
        method: "POST",
        body: JSON.stringify(getFormConstructorData()),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(response => response.json())
        .then((body) => {
          if (body.result === "ok") {
            const modal = document.querySelector(".modal-window.modal-order");
            modal.classList.add("open");
          }
        });
    } else console.log("stop sending order");
  });
};

export { sendOrder, getModalOrder };
