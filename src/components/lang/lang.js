/* eslint-disable no-param-reassign */
import ENG from "./eng.json";
import RU from "./ru.json";
import UA from "./ua.json";

const dict = {
  eng: ENG[0],
  ru: RU[0],
  ua: UA[0],
};

const changeLang = (lang) => {
  localStorage.setItem("fire1_lang", lang);
  const allElemTranslate = document.querySelectorAll("[data-lang]");
  allElemTranslate.forEach((elem) => {
    const dataLang = elem.getAttribute("data-lang");
    if (dict[lang][dataLang]) {
      if (dataLang.includes("placeholder")) {
        elem.setAttribute("placeholder", dict[lang][dataLang]);
      } else elem.innerHTML = dict[lang][dataLang];
    }
  });
};

const selectLang = () => {
  const langsContainer = document.querySelector(".left-container__langs");
  langsContainer.addEventListener("click", (e) => {
    const prevLang = localStorage.getItem("fire1_lang");
    const lang = e.target.getAttribute("data-flag");
    changeLang(lang);
    const wrapper = document.querySelector(".wrapper");
    wrapper.setAttribute("data-flag", lang);

    // изменение ссылки на печатные информационные доки в зависимости от выбранного языка
    const infoBlock = document.querySelector(".main-buttons__info-block");
    const allLInfoBlockLinks = infoBlock.querySelectorAll("a");
    allLInfoBlockLinks.forEach((link) => {
      let href = link.getAttribute("href");
      href = href.replace(prevLang, lang);
      link.setAttribute("href", href);
    });
  });
};

export { selectLang, dict };
