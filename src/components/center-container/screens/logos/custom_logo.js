import create from "../../../create";

function getCustomLogo() {
  const pic = create("div", "logo__custom_logo");
  pic.textContent = "CUSTOM LOGO";
  return pic;
}

export { getCustomLogo };
