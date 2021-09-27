import * as Helpers from "./helpers.js";

Hooks.once("init", () => {
  const templates = [];
  loadTemplates(templates);
  console.log("The Sundered Lands | Loaded.");
});

Hooks.once("ready", async() => {
  const sheet = (await import("./sheet.js")).TSLVehicleSheet;
  Actors.registerSheet("tsl", sheet, {
    types: ["npc"],
    makeDefault: false,
    label: "TSL.VehicleSheet"
  });
  console.log("The Sundered Lands | Sheet registered.");
});
