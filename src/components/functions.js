import tabsClick from "./left-container/tabs-item";
import posClick from "./center-container/pos-item";
import getContainerElements from "./center-container/screens/container/container";
import splitButtonsClick from "./center-container/split-buttons";
import getHarnessElements from "./center-container/screens/harness/harness";
import getBindingPinstripesElements from "./center-container/screens/bind_pinstripes/bind_pinstripes";
import getLogosElements from "./center-container/screens/logos/logos";

export default function funcInit() {
  tabsClick();
  posClick();
  getContainerElements();
  splitButtonsClick();
  getHarnessElements();
  getBindingPinstripesElements();
  getLogosElements();
}

function onHoverElement(elem) {
  elem.classList.add("hover");
}

function outHoverElement(elem) {
  elem.classList.remove("hover");
}

function getAllDetailsByDataId(id) {
  return document.querySelectorAll(`.schema__element[data-id="${id}"]`);
}

export {
  onHoverElement,
  outHoverElement,
  getAllDetailsByDataId,
};
