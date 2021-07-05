/* eslint-disable no-param-reassign */
import create from "../create";
import { isValid } from "../functions";
import json from "../center-container/info.json";

const modal = document.querySelector(".modal-contact");

function getForm() {
  const form = create("div", "contact-form");

  const closeButton = create("button", "modal-close");
  closeButton.innerHTML = "<i class=\"fas fa-times\"></i>";
  closeButton.addEventListener("click", () => {
    modal.classList.toggle("open");
    form.classList.remove("sent");
    form.classList.remove("submited");
  });
  form.appendChild(closeButton);

  const title = create("div", "modal-title");
  title.textContent = "Contact Us";
  title.setAttribute("data-lang", "contact_us");
  form.appendChild(title);

  const container = create("form", "modal-container");
  container.setAttribute("action", "/contact");
  container.setAttribute("method", "POST");

  const arr = json[0].parts[1].inputs.slice(0, 3);
  arr.push("Message");
  arr.forEach((item, ind) => {
    let type = "input";
    if (ind === arr.length - 1) type = "textarea";
    const row = create("div", "constructor__data-row");

    const label = create("div", "data-row__label");
    const val = item.toLowerCase().replaceAll(" ", "_");
    label.setAttribute("data-lang", val);
    label.textContent = item;
    row.appendChild(label);

    const input = create(type, `data-row__${type}`);
    input.required = true;
    switch (val) {
      case "phone": input.setAttribute("type", "tel"); break;
      case "email": input.setAttribute("type", "email"); break;
      default: input.setAttribute("type", "text"); break;
    }
    input.setAttribute("name", val);
    row.appendChild(input);

    container.appendChild(row);
  });

  const button = create("button", "btn");
  button.setAttribute("type", "submit");
  button.setAttribute("data-lang", "contact_send");
  button.textContent = "send";

  button.addEventListener("click", (e) => {
    e.preventDefault();
    form.classList.add("submited");
    const inputs = document.querySelectorAll(".modal-container .data-row__input");
    const data = {};
    let flag = true;
    inputs.forEach((inp) => {
      if (!isValid(inp.getAttribute("type"), inp.value)) {
        flag = false;
        inp.classList.add("invalid");
      } else {
        inp.classList.remove("invalid");
        const name = inp.getAttribute("name");
        data[name] = inp.value;
      }
    });
    const txtarea = document.querySelector(".modal-container .data-row__textarea");
    if (!isValid(txtarea.getAttribute("type"), txtarea.value)) {
      flag = false;
      txtarea.classList.add("invalid");
    } else {
      data[txtarea.getAttribute("name")] = txtarea.value;
    }
    if (flag) {
      fetch("/contact", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        if (response.ok) {
          return response.json;
        }
        throw new Error("Request failed");
      });
      form.classList.toggle("sent");
      setTimeout(() => {
        modal.classList.toggle("open");
        form.classList.remove("sent");
        form.classList.remove("submited");
        inputs.forEach((inp) => {
          inp.value = "";
        });
        txtarea.value = "";
      }, 2000);
    }
  });

  container.appendChild(button);
  form.appendChild(container);

  const message = create("div", "modal-message");
  message.setAttribute("data-lang", "contact_form_msg");
  message.innerHTML = "SWS Company would like to thank you for using the feedback form.<br><br>Your message has been sent. The company manager will contact you shortly.";
  form.appendChild(message);

  return form;
}

export default function getContactForm() {
  const overlay = create("div", "modal-overlay");
  modal.appendChild(overlay);
  modal.appendChild(getForm());
}
