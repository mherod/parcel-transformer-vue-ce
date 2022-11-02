import { defineCustomElement } from "vue/dist/vue.esm-bundler.js";
import Example from "./Example.vue";
customElements.define("example-component", defineCustomElement(Example));
document.body.innerHTML = `<example-component></example-component>`;
