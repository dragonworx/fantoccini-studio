import App from "./App.svelte";
import { dialog } from "@tauri-apps/api";

const app = new App({
  target: document.body,
  props: {
    name: "world",
  },
});

dialog.open({ multiple: true }).then((result) => console.log(result));

export default app;
