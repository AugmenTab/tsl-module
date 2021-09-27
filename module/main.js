import * as Helpers from "./helpers.js";
import { TSLVehicleSheet } from "./sheet.js";

Hooks.once("init", () => {
h  const templates = [];
  loadTemplates(templates);
  console.log("The Sundered Lands | Loaded.");
});

Hooks.once("ready", () => {
  Actors.registerSheet("tsl", TSLVehicleSheet, {
    types: ["npc"],
    makeDefault: false,
    label: "TSL.VehicleSheet"
  });
  console.log("The Sundered Lands | Sheet registered.");
});
