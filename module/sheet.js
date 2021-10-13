import { calculateVehicleData } from "./calculations.js";

export class TSLVehicleSheet extends game.pf1.applications.ActorSheetPFNPC {
  get template() {
    return "modules/tsl-module/templates/tsl-vehicle-sheet.hbs";
  }
  
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["tsl-vehicle"],
      height: 800,
      width: 700,
      tabs: [
        {
          navSelector: ".tslv-tabs",
          contentSelector: ".tslv-sheet-body",
          initial: "components"
        }
      ]
    });
  }

  getData() {
    const data = super.getData();
    return data;
  }

  getRollData() {
    const data = super.getRollData();
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
}

Hooks.on("updateActor", (actor) => {
  calculateVehicleData(actor);
});
