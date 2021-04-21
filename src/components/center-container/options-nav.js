import create from "../create";

export default function getOptionsNav(options) {
  const optionsNav = create("div", "options-nav-container");

  const title = create("div", "options-nav__title");
  title.setAttribute("data-lang", "choose_options");
  title.textContent = "choose options";
  optionsNav.appendChild(title);

  const optList = create("div", "options-nav__list");
  options.forEach((opt) => {
    const optTitle = create("div", "list__title");
    optTitle.textContent = opt.title;
    optTitle.setAttribute("data-lang", opt.title.toLowerCase().replaceAll(" ", "_"));
    optList.appendChild(optTitle);
  });
  optionsNav.appendChild(optList);

  return optionsNav;
}
