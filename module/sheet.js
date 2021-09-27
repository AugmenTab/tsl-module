export class TSLVehicleSheet extends ActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["tsl-vehicle"],
      height: 700,
      width: 700,
      tabs: [
        {
          navSelector: ".tslv-tabs",
          contentSelector: ".tslv-sheet-body",
          initial: "summary"
        }
      ],
      template: "modules/tsl-module/templates/tsl-vehicle-sheet.hbs"
    });
  }

  getData() {
    const data = super.getData();
    data.config = CONFIG.tsl;
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