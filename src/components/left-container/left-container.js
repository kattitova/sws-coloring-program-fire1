import create from "../create";

// display left sidebar
// header - SWS logo + language icons
// tabsList - right menu
// linkList - Find a dealer + contacts us
export const arrTabs = ["container", "harness", "binding_pinstripes", "logos", "information", "sizes", "options"];

export default class LeftContainer {
  static init() {
    const leftContainer = document.querySelector(".main");
    leftContainer.appendChild(LeftContainer.getHeader());
    leftContainer.appendChild(LeftContainer.getTabsList());
    leftContainer.appendChild(LeftContainer.getLinkList());
  }

  static getHeader() {
    const header = create("div", "left-container__header");

    const logo = create("div", "left-container__logo");

    logo.appendChild(LeftContainer.getLogo());
    header.appendChild(logo);
    header.appendChild(LeftContainer.getLangs());
    return header;
  }

  static getLogo() {
    const logo = create("a", "logo__link");
    logo.setAttribute("href", "https://sws.aero");
    logo.setAttribute("target", "blank");

    const img = create("img", "logo__img");
    img.setAttribute("src", "./././images/logo.svg");

    logo.appendChild(img);
    return logo;
  }

  static getLangs() {
    const langs = create("div", "left-container__langs");

    const arrLangs = ["eng", "ru", "ua"];
    arrLangs.forEach((lang) => {
      const flag = create("a", ...["langs__lang", `langs__lang--${lang}`]);
      flag.setAttribute("href", "#");
      flag.textContent = lang;
      langs.appendChild(flag);
    });

    return langs;
  }

  static getTabsList() {
    const tabsList = create("div", "left-container__tabs-list");

    const arrTabsName = ["container", "harness", "binding & pinstripes", "logos", "information", "sizes", "options"];
    arrTabsName.forEach((tab, ind) => {
      const tabs = create("button", ...["tabs-list__tabs-item", `${arrTabs[ind]}`]);
      if (tab === "container") tabs.classList.add("active");
      tabs.setAttribute("data-lang", arrTabs[ind]);
      tabs.textContent = tab;
      tabsList.appendChild(tabs);
    });

    return tabsList;
  }

  static getLinkList() {
    const linkList = create("div", "left-container__link-list");

    const findDealer = create("div", "link-list__dealer");
    const findDealerLink = create("a", "dealer__dealer-link");
    findDealerLink.setAttribute("data-lang", "find_dealer");
    findDealerLink.setAttribute("href", "#");
    findDealerLink.textContent = "Find a Dealer";
    findDealerLink.addEventListener("click", () => {
      const modal = document.querySelector(".modal-dealer");
      modal.classList.toggle("open");
    });
    findDealer.appendChild(findDealerLink);
    linkList.appendChild(findDealer);

    const contactUs = create("div", "link-list__contact-us");
    const contactUsLink = create("a", "contact-us__contact-link");
    contactUsLink.setAttribute("data-lang", "contact_us");
    contactUsLink.setAttribute("href", "#");
    contactUsLink.textContent = "Contact Us";
    contactUsLink.addEventListener("click", () => {
      const modal = document.querySelector(".modal-contact");
      modal.classList.toggle("open");
    });
    contactUs.appendChild(contactUsLink);
    linkList.appendChild(contactUs);

    return linkList;
  }
}
