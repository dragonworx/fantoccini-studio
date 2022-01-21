import { process, dialog, fs } from "@tauri-apps/api";
import { EventEmitter } from "eventemitter3";
import { Project } from "../core/project";
import { Action } from "../gui/action";
import { MenuBarItem, MenuItem, separator } from "../gui/menu";
import { events, AppEvent } from "./events";
import WaveformData from "waveform-data";

export class Application extends EventEmitter {
  project: Project;

  constructor() {
    super();
    events.on(AppEvent.CreateNewProject, (opts) => {
      this.project = new Project(opts);
    });
  }

  open(file: string) {
    console.log(file);
  }

  get screenWidth() {
    return document.documentElement.clientWidth;
  }

  get screenHeight() {
    return document.documentElement.clientHeight;
  }

  async showOpenDialog() {
    return dialog.open({});
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
      events.emit(AppEvent.ShowNewDialog);
    }, "Ctrl+N,Command+N"),
  }),
  separator,
  new MenuItem({
    label: "Open Project",
    action: new Action(() => {
      app.showOpenDialog().then((result: string) => {
        app.open(result);
      });
    }, "Ctrl+O,Command+O"),
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
