import create from "../create";
import { getCloseButton } from "../close-button";
import json from "./dealers.json";

const modal = document.querySelector(".modal-dealer");
const dealerList = create("div", "dealer-list");

function getDealerItem(country) {
  dealerList.innerHTML = "";
  const obj = json.filter(el => el["data-target"] === country)[0];
  obj.dealers.forEach((dealer) => {
    const dealerItem = create("div", "dealer-item");
    const dealerInfo = create("div", "dealer-info");
    Object.keys(dealer).forEach((key) => {
      if (dealer[key] !== "") {
        switch (key) {
          case "tel1":
          case "tel2": {
            const tel = create("a");
            tel.setAttribute("href", `tel:${dealer[key]}`);
            tel.textContent = dealer[key];
            dealerInfo.appendChild(tel);
            break;
          }
          case "email": {
            const email = create("a");
            email.setAttribute("href", `mailto:${dealer[key]}`);
            email.setAttribute("target", "blank");
            email.textContent = dealer[key];
            dealerInfo.appendChild(email);
            break;
          }
          case "web": {
            const web = create("a");
            web.setAttribute("href", `${dealer[key]}`);
            web.setAttribute("target", "blank");
            web.textContent = dealer[key];
            dealerInfo.appendChild(web);
            break;
          }
          default: {
            const div = create("div", key);
            div.textContent = dealer[key];
            dealerInfo.appendChild(div);
            break;
          }
        }
      }
    });
    dealerItem.appendChild(dealerInfo);
    const button = create("button", "dealer-item-choose");
    button.textContent = "choose a dealer";
    button.setAttribute("data-lang", "choose_a_dealer");
    button.addEventListener(("click"), () => {
      const input = document.querySelector(".data-row__input[data-val=\"dealer\"]");
      input.textContent = dealer.name;
      input.value = dealer.name;
      modal.classList.remove("open");
      const formInput = document.querySelector(".preview-value[data-target=\"dealer\"]");
      formInput.textContent = dealer.name;
      formInput.value = dealer.name;
    });
    dealerItem.appendChild(button);
    dealerList.appendChild(dealerItem);
  });
}

function getDealerForm() {
  const form = create("div", "dealer-form");
  form.appendChild(getCloseButton(modal));

  const title = create("div", "modal-title");
  title.textContent = "Find a Dealer";
  title.setAttribute("data-lang", "find_dealer");
  form.appendChild(title);

  const container = create("div", "modal-container");
  const select = create("div", "dealer-select");
  const selectButton = create("button", "dealer-current");
  const countryList = create("div", "dealer-country-list");
  json.forEach((item, ind) => {
    const countryDiv = create("div", "dealer-country");
    if (ind === 0) {
      countryDiv.classList.add("active");
      selectButton.textContent = item.country;
    }
    countryDiv.setAttribute("data-target", item["data-target"]);
    countryDiv.textContent = item.country;

    countryDiv.addEventListener("click", () => {
      countryList.classList.remove("open");
      Array.from(countryList.children).forEach((div) => {
        div.classList.remove("active");
      });
      countryDiv.classList.add("active");
      selectButton.textContent = item.country;
      // TODO output dealers list from selected country
      getDealerItem(item["data-target"]);
    });

    countryList.appendChild(countryDiv);
  });

  selectButton.addEventListener("click", () => {
    countryList.classList.toggle("open");
  });

  select.appendChild(countryList);
  select.appendChild(selectButton);
  container.appendChild(select);

  getDealerItem("ua");
  container.appendChild(dealerList);
  form.appendChild(container);
  return form;
}

export default function getDealerList() {
  const overlay = create("div", "modal-overlay");
  modal.appendChild(overlay);
  modal.appendChild(getDealerForm());
}
