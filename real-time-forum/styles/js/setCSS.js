export function CSSHandler(arr) {
  Array.from(document.getElementsByName("css")).forEach((element) => {
    element.remove();
    console.log(element);
  });

  arr.forEach((element) => {
    const linkCSS = document.createElement("link");
    linkCSS.setAttribute("rel", "stylesheet");
    linkCSS.setAttribute("type", "text/css");
    linkCSS.setAttribute("name", "css");
    linkCSS.setAttribute("href", element);

    document.head.append(linkCSS);
  });
}
