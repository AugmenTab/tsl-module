import { calculateVehicleData, seedVehicleData } from "./calculations.js";

export class TSLVehicleSheet extends game.pf1.applications.ActorSheetPFNPC {
  get template() {
    return "modules/tsl-module/templates/tsl-vehicle-sheet.hbs";
  }
  
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["tsl-vehicle"],
      height: 805,
      width: 700,
      tabs: [
        {
          navSelector: ".tslv-tabs",
          contentSelector: ".tslv-sheet-body",
          initial: "summary"
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

    html.find(".mod-create").click(this._onModCreate.bind(this));
  }

  async _onModCreate(event) {
    event.preventDefault();
    let data = duplicate(this.actor.data);
    let modsList = data.data.vehicle.modifications.list;

    for (let i = 0; i < modsList.length; i++) {
      modsList[i].index = i;
    }

    data.data.vehicle.modifications.list = modsList;
    const mod =
      { "name": ""
      , "mods": "none"
      , "val": 0
      , "weight": 0
      , "index": modsList.length
      };
    console.log(data.data.vehicle.modifications);
    data.data.vehicle.modifications.list.push(mod);
    await this.actor.update(data);
  }
}

Hooks.on("createActor", async (actor) => {
  await seedVehicleData(actor);
});

Hooks.on("updateActor", async (actor) => {
  await calculateVehicleData(actor);
});
