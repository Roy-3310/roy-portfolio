import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/";
import "./styles/_global.scss";

createApp(App).use(router).mount("#app");
