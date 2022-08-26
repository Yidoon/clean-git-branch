import { createApp } from "https://unpkg.com/petite-vue?module";
createApp({
  // exposed to all expressions
  count: 0,
  // getters
  get plusOne() {
    return this.count + 1;
  },
  // methods
  increment() {
    this.count++;
    this.plusOne();
  },
}).mount("#app");
