import create from "../create";
import { getCloseButton } from "../close-button";

function getColorInfo() {
  const modal = document.querySelector(".modal-window.modal-info");
  const overlay = create("div", "modal-overlay");
  modal.appendChild(overlay);

  const wrapper = create("div", "color-info");
  wrapper.appendChild(getCloseButton(modal));

  const title = create("div", "modal-title");
  title.textContent = "color information";
  title.setAttribute("data-lang", "color_info_title");
  wrapper.appendChild(title);

  const container = create("div", "modal-container");

  const text = create("div", "color-info__text");
  text.innerHTML = "17 basic colors of cordura and binding are available for ordering + cordura has 4 camouflage options ( extra charge ), 7 colors for webbings and 3 neon shades for binding and pinstripes. Because of our very high demands to the materials used in production, we cannot always provide the color that suits you. In particular, the color \"evening sunset in the sakura garden\" is not in the list of possible colors. But, even for colors specified in the list, there is the following problem: the production of materials for parachute making are done by a large number of specialized companies. Some materials are certified (e.g. harness webbings), and some are commercial materials of different brands and manufacturers (eg , cordura ).<br><br>But, even for certified materials, due to the nature of the production process, there is a chance that the color (even the same code - classifier ) will be different in different batches , tone and saturation will differ. Also , for the same color code , materials from different manufacturers will be different - say harness webbing ( with a large weave ) will differ from riser webbing ( fine weave ) . On this basis, it is impossible to guarantee that all the used materials for the production of the rig will be of the same color (in tone, hue , saturation ).<br><br>If accurate color gamut compliance is critically important to you - we recommend that you choose another manufacturer.";
  text.setAttribute("data-lang", "color_info");
  container.appendChild(text);

  wrapper.appendChild(container);

  modal.appendChild(wrapper);
}

export { getColorInfo };
