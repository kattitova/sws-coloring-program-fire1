import create from "../../../create";

function getCustomText() {
  const pic = create("div", "logo__custom_text");
  pic.textContent = "CUSTOM TEXT";
  return pic;
}

export { getCustomText };
