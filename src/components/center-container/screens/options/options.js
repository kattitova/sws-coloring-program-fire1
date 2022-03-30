/* eslint-disable no-param-reassign */
import RightContainer from "../../../right-container/right-container";
import create from "../../../create";
import { toCapitalizedCase } from "../../../functions";
import { removeBlock } from "../../../right-container/calculator";

let activeColorOpt;

function openTooltipColor(optionsColors, parent, txt) {
  optionsColors.className = "opitons__colors";
  const [title, subtitle] = parent.previousSibling.id.split("-");
  if (txt) optionsColors.classList.add("active", title, subtitle, txt);
  else optionsColors.classList.add("active", title, subtitle);
  optionsColors.style.top = `${parent.offsetTop}px`;
  optionsColors.style.left = `${parent.offsetLeft - 50}px`;
  activeColorOpt = title;
}

export default function getTooltipColor() {
  const options = document.querySelector(".options-wrapper");
  const optionsColors = create("div", "opitons__colors");
  optionsColors.append(RightContainer.getPickBlock());
  optionsColors.append(RightContainer.getPickBlockCamo());
  optionsColors.append(RightContainer.getPickBlockNeon());
  options.append(optionsColors);

  options.addEventListener("click", (e) => {
    const { id } = e.target;
    if (id === "cutaway_handle-red" && activeColorOpt === "cutaway_handle") {
      optionsColors.className = "opitons__colors";
    }
    if (id === "reserve_handle-d_ring" && activeColorOpt === "reserve_handle") {
      optionsColors.className = "opitons__colors";
    }
  });

  const cutawayHandle = document.querySelector("[for=\"cutaway_handle-choose_color\"]");
  cutawayHandle.addEventListener("click", () => {
    openTooltipColor(optionsColors, cutawayHandle);
  });

  const reserveHandle = document.querySelector("[for=\"reserve_handle-soft_handle\"]");
  reserveHandle.addEventListener("click", () => {
    openTooltipColor(optionsColors, reserveHandle);
  });

  const mainDeployment = document.querySelector("[for=\"main_deployment_handle-choose_color\"]");
  mainDeployment.addEventListener("click", () => {
    const checkParent = mainDeployment.parentElement;
    const items = checkParent.parentElement.querySelectorAll("input");
    let txt = "";
    items.forEach((item, ind) => {
      if (ind !== items.length - 1) {
        if (item.checked) {
          txt = item.getAttribute("data-text");
        }
      }
    });
    openTooltipColor(optionsColors, mainDeployment, txt);
  });

  const mainPC = document.querySelector("[for=\"main_pc-choose_color\"]");
  mainPC.addEventListener("click", () => {
    openTooltipColor(optionsColors, mainPC);
  });

  const buttons = optionsColors.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const [, , title, subtitle] = optionsColors.className.split(" ");
      const parent = document.querySelector(`[for="${title}-${subtitle}"]`);
      const color = button.getAttribute("data-color");
      const getColor = parent.querySelector("b");

      if (color !== "def") {
        if (getColor) getColor.textContent = toCapitalizedCase(color);
        else {
          const setColor = create("b");
          setColor.textContent = toCapitalizedCase(color);
          parent.append(setColor);
        }
        parent.previousSibling.checked = true;
      } else {
        parent.previousSibling.checked = false;
        if (getColor) getColor.textContent = "";
        removeBlock(title, subtitle);
      }
      optionsColors.classList.remove("active", title, subtitle);
      const form = document.querySelector(".form-constructor");
      const formInput = form.querySelector(`.preview-value.options[data-target="${title}"]`);
      formInput.setAttribute("data-color", color);
    });
  });
}
