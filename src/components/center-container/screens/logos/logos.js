export default function getLogosElements() {
  const bpScreen = document.querySelector(".constructor__item.logos");
  // добавляем в id камуфляжных текстур отличительный идентификатор logos,
  // чтобы id были уникальные на всех экаранах и к деталям применялся камуфляж,
  // прописанный в стилях
  const schemas = bpScreen.querySelectorAll(".constructor__schema--img");
  schemas.forEach((schema) => {
    const patterns = schema.querySelectorAll("pattern");
    patterns.forEach((pattern) => {
      pattern.setAttribute("id", `${pattern.getAttribute("id")}-logos`);
    });
  });
}
