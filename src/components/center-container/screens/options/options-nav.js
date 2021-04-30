import create from "../../../create";

function setActiveOptionsPage(nameTitle) {
  const blocks = document.querySelectorAll(".constructor__data-block");
  blocks.forEach((block) => {
    block.classList.remove("active");
    if (block.className.split(" ")[1] === nameTitle) block.classList.add("active");
  });
}

function getNavigationButtons(arr) {
  const divNavigationButtons = create("div", "options-nav__nav-buttons");
  const arrNavButtons = ["back", "next"];
  arrNavButtons.forEach((i) => {
    const button = create("button", `navigation-buttons__${i}`);
    button.setAttribute("data-lang", i);
    button.textContent = i;
    let newActiveElem;
    button.addEventListener("click", () => {
      arr.forEach((item, ind) => {
        if (item.classList.contains("active")) {
          item.classList.remove("active");
          item.classList.add("done");
          if (i === "next") {
            newActiveElem = ind < arr.length - 1 ? arr[ind + 1] : item;
          } else {
            newActiveElem = ind > 0 ? arr[ind - 1] : item;
          }
        }
      });
      newActiveElem.classList.add("active");
      // const newDataElem = newActiveElem.getAttribute("data-lang");
      setActiveOptionsPage(newActiveElem.getAttribute("data-lang"));
    });
    divNavigationButtons.appendChild(button);
  });
  return divNavigationButtons;
}

export default function getOptionsNav(options) {
  const optionsNav = create("div", "options-nav__container");

  const title = create("div", "options-nav__title");
  title.setAttribute("data-lang", "choose_options");
  title.textContent = "choose options";
  optionsNav.appendChild(title);

  const optList = create("div", "options-nav__list");
  options.forEach((opt, ind) => {
    const optTitle = create("div", "list__title");
    if (ind === 0) optTitle.classList.add("active");
    optTitle.textContent = opt.title;
    const nameTitle = opt.title.toLowerCase().replaceAll(" ", "_");
    optTitle.setAttribute("data-lang", nameTitle);

    optTitle.addEventListener("click", () => {
      // const blocks = document.querySelectorAll(".constructor__data-block");
      // blocks.forEach((block) => {
      //   block.classList.remove("active");
      //   if (block.className.split(" ")[1] === nameTitle) block.classList.add("active");
      // });
      setActiveOptionsPage(nameTitle);
      Array.from(optList.children).forEach((div) => {
        // ???????????????????????????
        // возможно, предусмотреть проверку форм-конструктор
        // и давать статус done только если заполнены все чекбоксы на этом под-разделе опций
        // ???????????????????????????
        if (div.classList.contains("active")) div.classList.add("done");
        div.classList.remove("active");
      });
      if (optTitle.classList.contains("done")) optTitle.classList.remove("done");
      optTitle.classList.add("active");
    });

    optList.appendChild(optTitle);
  });
  optionsNav.appendChild(optList);
  optionsNav.appendChild(getNavigationButtons(Array.from(optList.children)));

  return optionsNav;
}
