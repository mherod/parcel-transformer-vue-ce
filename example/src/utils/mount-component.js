import { createApp } from "vue";

export function mountComponent(vueComponent) {
  const stylesheets = document.body.querySelectorAll("link[rel=stylesheet]");
  for (const style of Array.from(stylesheets)) {
    document.head.appendChild(style);
  }
  const styles = document.body.querySelectorAll("style");
  for (const style of Array.from(styles)) {
    document.head.appendChild(style);
  }

  const app = createApp(vueComponent);
  app.mount(document.body);
}
