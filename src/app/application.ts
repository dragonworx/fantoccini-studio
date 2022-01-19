import { process, dialog } from "@tauri-apps/api";
import { EventEmitter } from "eventemitter3";
import { Action } from "../gui/action";
import { MenuBarItem, MenuItem, separator } from "../gui/menu";

export enum AppEvent {
  ShowNewDialog = "showNewDialog",
}

export class Application extends EventEmitter {
  get screenWidth() {
    return document.documentElement.clientWidth;
  }

  get screenHeight() {
    return document.documentElement.clientHeight;
  }

  showOpenDialog() {
    dialog.open({}).then((result) => {
      console.log(result);
    });
  }

  exit() {
    process.exit();
  }
}

const app = new Application();

export default app;

const fileMenu: MenuItem[] = [
  new MenuItem({
    label: "New Project",
    action: new Action(() => {
      app.emit(AppEvent.ShowNewDialog);
    }, "Ctrl+N"),
  }),
  separator,
  new MenuItem({
    label: "Open Project",
    action: new Action(() => {
      app.showOpenDialog();
    }, "Ctrl+O"),
  }),
  separator,
  new MenuItem({
    label: "Save",
    isEnabled: false,
    action: new Action(() => {}, "Ctrl+S"),
  }),
  new MenuItem({
    label: "Save As...",
    isEnabled: false,
    action: new Action(() => {}, "Ctrl+Shift+S"),
  }),
  separator,
  new MenuItem({
    label: "Exit",
    action: new Action(() => {
      app.exit();
    }, "Ctrl+Q"),
  }),
];

export const menuBar: MenuBarItem[] = [{ label: "File", items: fileMenu }];
