import create from "../create";

export default class Footer {
  static init() {
    const footer = document.querySelector("footer");
    const footerText = create("div", "footer-text");

    const txt1 = create("div");
    txt1.setAttribute("data-lang", "footer_txt1");
    txt1.textContent = "Fabric and webbing shades may vary from dye lot to dye lot. Colors you see on your monitor may vary from actual fabrics and webbings.";
    footerText.appendChild(txt1);

    const txt2 = create("div");
    txt2.setAttribute("data-lang", "footer_txt2");
    txt2.textContent = "Neon colored Cordura and webbing will fade faster than other standard colors when exposed to the sun.";
    footerText.appendChild(txt2);

    const copyright = create("div", "copyright");
    const date = new Date();
    copyright.textContent = `Copyright © 2007-${date.getFullYear()} SkyWideSystems`;

    footer.appendChild(footerText);
    footer.appendChild(copyright);
  }
}
