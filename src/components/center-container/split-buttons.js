export const letters = ["a", "b", "c", "d", "e", "f"];

export default function splitButtonsClick() {
  const splitButtons = document.querySelectorAll(".split-switch__button");
  splitButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const num = parseInt(button.getAttribute("data-num"), 10);
      const allButtons = document.querySelectorAll(`.split-switch__button[data-num="${num}"]`);
      allButtons.forEach((but) => {
        but.classList.toggle("active");
      });

      const target = button.getAttribute("data-target");
      const cont = document.querySelector(".center-container__constructor");
      if (button.classList.contains("active")) cont.setAttribute(target, true);
      else cont.setAttribute(target, false);
      // ----------------

      // при клике на кнопку Split Design
      // отображаем / убираем соответствующие инфо деталей, если Схематикс тайтл активный
      const schematicsTitles = document.querySelectorAll(".schematics__title");
      schematicsTitles.forEach((title) => {
        if (title.classList.contains("active")) {
          const pos = title.className.split(" ")[1];
          const container = document.querySelector(".constructor__item.container");
          const schema = container.querySelector(`.constructor__schema.${pos}`);
          const infoContainer = schema.querySelector(".constructor__schema--info");
          const infoItem = infoContainer.querySelector(`.info-item[data-id="area-${num}"]`);
          infoItem.classList.toggle("hidden");
          const ind = num === 2 ? 0 : 3;
          for (let i = ind; i < ind + 3; i += 1) {
            const infoItemDop = infoContainer.querySelector(`.info-item[data-id="area-${num}${letters[i]}"]`);
            infoItemDop.classList.toggle("hidden");
          }
        }
      });
      // ----------------

      const form = document.querySelector(".form-constructor");
      const input = form.querySelector(`[data-target="${button.getAttribute("data-target")}"]`);
      if (button.classList.contains("active")) {
        input.setAttribute("value", "active");
        input.textContent = "active";
      } else {
        input.setAttribute("value", "NULL");
        input.textContent = "";
      }
    });
  });
}
