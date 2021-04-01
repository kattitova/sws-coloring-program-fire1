export default function create(elem, ...cls) {
  const createdElement = document.createElement(elem);
  cls.forEach((i) => {
    createdElement.classList.add(i);
  });
  return createdElement;
}
