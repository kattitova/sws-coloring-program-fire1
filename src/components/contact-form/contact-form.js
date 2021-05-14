import create from "../create";
import json from "../center-container/info.json";

const modal = document.querySelector(".modal-contact");

function getForm() {
  const form = create("div", "contact-form");

  const closeButton = create("button", "modal-close");
  closeButton.innerHTML = "<i class=\"fas fa-times\"></i>";
  closeButton.addEventListener("click", () => {
    modal.classList.toggle("open");
  });
  form.appendChild(closeButton);

  const title = create("div", "modal-title");
  title.textContent = "Contact Us";
  title.setAttribute("data-lang", "contact_us");
  form.appendChild(title);

  const container = create("div", "modal-container");

  const arr = json[0].parts[1].inputs.slice(0, 4);
  arr.push("Message");
  arr.forEach((item, ind) => {
    let type = "input";
    if (ind === arr.length - 1) type = "textarea";
    const row = create("div", "constructor__data-row");

    const label = create("div", "data-row__label");
    label.setAttribute("data-lang", item.toLowerCase().replaceAll(" ", "_"));
    label.textContent = item;
    row.appendChild(label);

    const input = create(type, `data-row__${type}`);
    input.required = true;
    input.setAttribute("type", "text");
    row.appendChild(input);

    container.appendChild(row);
  });

  const button = create("button", "btn");
  button.setAttribute("type", "submit");
  button.setAttribute("data-lang", "contact_send");
  button.textContent = "send";
  container.appendChild(button);
                                                             
  form.appendChild(container);
  return form;
}

export default function getContactForm() {
  const overlay = create("div", "modal-overlay");
  modal.appendChild(overlay);
  modal.appendChild(getForm());
}
