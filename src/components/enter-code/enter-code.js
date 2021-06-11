import create from "../create";
import { getCloseButton } from "../close-button";
import { loadData } from "./load-data";

function getModalSuccess() {
  const modal = document.querySelector(".modal-window.modal-success");
  const overlay = create("div", "modal-overlay");
  modal.appendChild(overlay);

  const wrapper = create("div", "success-block");
  wrapper.appendChild(getCloseButton(modal));

  const title = create("div", "modal-title");
  title.setAttribute("data-lang", "success_title");
  title.textContent = "success";
  wrapper.appendChild(title);

  const container = create("div", "modal-container");
  const text = create("span", "success_msg");
  text.setAttribute("data-lang", "success_msg");
  text.textContent = "Your code has been uploaded!";
  container.appendChild(text);

  wrapper.appendChild(container);

  modal.appendChild(wrapper);
}

function enterCode() {
  const enterButton = document.querySelector(".enter-code__button");
  const input = document.querySelector(".enter-code__input");
  enterButton.addEventListener("click", (e) => {
    e.preventDefault();
    const code = { code: input.value };
    fetch("/enter-code", {
      method: "POST",
      body: JSON.stringify(code),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => response.json())
      .then((body) => {
        const modal = document.querySelector(".modal-window.modal-success");
        modal.classList.add("open");
        const title = modal.querySelector(".modal-title");
        const span = modal.querySelector("span");
        if (body.error) {
          title.textContent = "error code";
          title.setAttribute("data-lang", "error_title");
          span.textContent = "You have used the wrong code. Please try again";
          span.setAttribute("data-lang", "error_msg");
        } else {
          // TODO загрузка данных в саму программу, примененние ВСЕГО
          loadData(body);
          title.textContent = "success";
          title.setAttribute("data-lang", "success_title");
          span.textContent = "Your code has been uploaded!";
          span.setAttribute("data-lang", "success_msg");
        }
      });
  });
}

export { getModalSuccess, enterCode };
