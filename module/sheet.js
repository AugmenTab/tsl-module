import { calculateVehicleData, reIndexItems, seedVehicleData } from "./calculations.js";
import { rollPushCheck } from "./chat.js";

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

    html.find(".cargo-create").click(this._onCargoCreate.bind(this));
    html.find(".cargo-delete").click(this._onCargoDelete.bind(this));
    html.find(".cargo-update").click(this._onCargoUpdate.bind(this));
    html.find(".hours-change").click(this._onHoursOfOperationChange.bind(this));
    html.find(".make-push").click(this._onMakePush.bind(this));
    html.find(".mod-create").click(this._onModCreate.bind(this));
    html.find(".mod-delete").click(this._onModDelete.bind(this));
    html.find(".mod-update").click(this._onModUpdate.bind(this));
    html.find(".speed-change").click(this._onSpeedChange.bind(this));
  }

  async _onHoursOfOperationChange(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const operation = element.getAttribute("data-operation");
    let data = this.actor.data;
    let hours = data.data.vehicle.hoursOfOperation.value || 0;
    if (operation === "inc") {
      let max = data.data.vehicle.hoursOfOperation.max
      hours = (hours + 1) > max ? max : hours + 1;
    } else if (operation === "dec") {
      hours = (hours - 1) > 0 ? hours - 1 : 0;
    }
    await this.actor.update({ "data.vehicle.hoursOfOperation.value": hours });
  }

  async _onCargoCreate(event) {
    event.preventDefault();
    let data = duplicate(this.actor.data);
    let manifest = reIndexItems(data.data.vehicle.cargo);
    data.data.vehicle.cargo = manifest;

    const item =
      { "desc": ""
      , "weight": 0
      , "index": manifest.length
      };
    data.data.vehicle.cargo.push(item);
    await this.actor.update(data);
  }

  async _onCargoDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let data = duplicate(this.actor.data);
    const cargo = data.data.vehicle.cargo;
    const newCargo = cargo.filter(x => x.index !== parseInt(element.dataset.index));
    data.data.vehicle.cargo = reIndexItems(newCargo);
    await this.actor.update(data);
  }

  async _onCargoUpdate(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let data = duplicate(this.actor.data);
    let val = element.dataset.field === "weight"
      ? parseFloat(element.value) : element.value;
    if (element.dataset.field === "weight" && isNaN(val)) {
      val = 0;
    }
    data.data.vehicle.cargo[element.dataset.index][element.dataset.field] = val;
    await this.actor.update(data);
  }

  async _onMakePush(event) {
    event.preventDefault();
    const component = event.currentTarget.dataset.component;
    const integrity = this.actor.data.data.vehicle.components[component].integrity;
    await rollPushCheck(component, integrity);
  }

  async _onModCreate(event) {
    event.preventDefault();
    let data = duplicate(this.actor.data);
    let modsList = reIndexItems(data.data.vehicle.modifications.list);
    data.data.vehicle.modifications.list = modsList;

    const mod =
      { "name": ""
      , "mods": "none"
      , "val": 0
      , "weight": 0
      , "index": modsList.length
      };
    data.data.vehicle.modifications.list.push(mod);
    await this.actor.update(data);
  }

  async _onModDelete(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let data = duplicate(this.actor.data);
    const list = data.data.vehicle.modifications.list;
    const mods = list.filter(x => x.index !== parseInt(element.dataset.index));
    data.data.vehicle.modifications.list = reIndexItems(mods);
    await this.actor.update(data);
  }

  async _onModUpdate(event) {
    event.preventDefault();
    const element = event.currentTarget;
    let data = duplicate(this.actor.data);
    let val = ["val", "weight"].includes(element.dataset.field) 
      ? parseFloat(element.value) : element.value;
    if (["val", "weight"].includes(element.dataset.field) && isNaN(val)) {
      val = 0;
    }
    data.data.vehicle.modifications.list[element.dataset.index][element.dataset.field] = val;
    await this.actor.update(data);
  }

  async _onSpeedChange(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const operation = element.getAttribute("data-operation");
    let data = this.actor.data;
    let speed = data.data.vehicle.speed.value || 0;
    if (operation === "inc") {
      let max = data.data.vehicle.speed.max
      let calc = speed + data.data.vehicle.stats.xlr8.total;
      speed = calc > max ? max : calc;
    } else if (operation === "dec") {
      let calc = speed - data.data.vehicle.stats.stopping.total;
      speed = calc > 0 ? calc : 0;
    }
    await this.actor.update({ "data.vehicle.speed.value": speed });
  }
}

Hooks.on("createActor", async (actor) => {
  await seedVehicleData(actor);
});

Hooks.on("updateActor", async (actor) => {
  await calculateVehicleData(actor);
});
