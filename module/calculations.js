const SIZE_MODIFIER =
{ "none": 0
, "fine": 8
, "diminutive": 4
, "tiny": 2
, "small": 1
, "medium": 0
, "large": -1
, "huge": -2
, "gargantuan": -4
, "colossal": -8
};

export async function calculateVehicleData(actor) {
  let data = duplicate(actor.data);
  data.data.vehicle.notes = setVehicleNotes(actor.data.data.vehicle);
  data.data.vehicle.base = setVehicleBase(actor.data.data.vehicle);

  let cargo = setVehicleCargo(actor.data.data.vehicle.cargo);
  
  let mods = setVehicleMods(actor.data.data.vehicle);
  data.data.vehicle.modifications = mods;
  data.data.vehicle.components = setVehicleComponents(actor.data.data.vehicle);
  data.data.vehicle.weight = setVehicleWeight(
    actor.data.data.vehicle, data.data.vehicle.components.body.stat.total
  );
  data.data.vehicle.hp = setVehicleHitPoints(
    actor.data.data.vehicle, data.data.vehicle.components.body.hp.total
  );
  
  let components = data.data.vehicle.components;
  let weight = data.data.vehicle.weight.curb;
  data.data.vehicle.stats = setVehicleDerivedStats(
    components, actor.data.data.vehicle.stats, weight
  );
  data.data.vehicle.ac = setVehicleArmorClass(
    actor.data.data.vehicle, components.suspension, data.data.vehicle.base.size
  );

  let stats = data.data.vehicle.stats;
  data.data.vehicle.speed.max = stats.topSpeed.total;
  data.data.vehicle.rammingDamage = setVehicleRammingDamage(
    actor.data.data.vehicle.rammingDamage.temp, stats, data.data.vehicle.base.size
  );
  data.data.vehicle.hoursOfOperation = setVehicleHoursOfOperation(
    actor.data.data.vehicle, stats.load.total
  );
  data.data.vehicle.fuelCapacity = setVehicleFuelCapacity(actor.data.data.vehicle);

  await actor.update(data);
}

export function reIndexMods(modsList) {
  for (let i = 0; i < modsList.length; i++) {
    modsList[i].index = i;
  };
  return modsList;
}

export async function seedVehicleData(actor) {
  let data = duplicate(actor.data);
  data.data.vehicle =
  { "ac":
    { "base": 0
    , "mods": 0
    , "temp": 0
    , "total": 0
    }

  , "base":
    { "size": "none"
    , "type": "none"
    , "classification": "none"
    , "pilot": ""
    }
  
  , "cargo": []

  , "components":
    { "engine":
      { "stat":
        { "base": 0
        , "mods": 0
        , "total": 0
        }
      , "integrity":
        { "base": 0
        , "total": 0
        , "resist": 0
        }
      , "primary": ""
      , "secondary": ""
      }

    , "transmission":
      { "stat":
        { "base": 0
        , "fluid": 0
        , "display": "0"
        }
      , "integrity":
        { "base": 0
        , "total": 0
        , "resist": 0
        }
      , "primary": ""
      , "secondary": ""
      }

    , "chassis":
      { "stat":
        { "base": 0
        , "mods": 0
        , "total": 0
        }
      , "integrity":
        { "base": 0
        , "total": 0
        , "resist": 0
        }
      , "primary": ""
      , "secondary": ""
      }

    , "suspension":
      { "stat":
        { "base": 0
        , "mods": 0
        , "total": 0
        }
      , "integrity":
        { "base": 0
        , "total": 0
        , "resist": 0
        }
      , "primary": ""
      , "secondary": ""
      }

    , "body":
      { "weight":
        { "base": 0
        , "mods": 0
        , "total": 0
        }
      , "armor":
        { "base": 0
        , "mods": 0
        , "total": 0
        }
      , "hp":
        { "base": 0
        , "mods": 0
        , "total": 0
        }
      , "primary": ""
      , "secondary": ""
      }
    }

  , "fuelCapacity":
    { "value": 0
    , "max": 0
    , "mods": 0
    }

  , "hoursOfOperation":
    { "value": 0
    , "max": 0
    , "base": 0
    , "ldPen": 0
    , "temp": 0
    }

  , "hp":
    { "value": 0
    , "max": 0
    , "base": 0
    , "mods": 0
    }

  , "modifications":
    { "list": []
    , "values":
      { "engineIR": 0
      , "transmissionIR": 0
      , "chassisIR": 0
      , "suspensionIR": 0
      , "ho": 0
      , "re": 0
      , "br": 0
      , "topSpeed": 0
      , "torque": 0
      , "xlr8": 0
      , "stopping": 0
      , "turning": 0
      , "load": 0
      , "hitPoints": 0
      , "ac": 0
      , "armor": 0
      , "rammingDamage": 0
      , "hoursOfOperation": 0
      , "fuelCapacity": 0
      , "weight": 0
      }
    }

  , "notes":
    { "cargo": ""
    , "character": ""
    , "components": ""
    , "modifications": ""
    , "weapons": ""
    }

  , "rammingDamage":
    { "base": 0
    , "temp": 0
    , "total": 0
    }

  , "speed":
    { "value": 0
    , "max": 0
    }

  , "stats":
    { "topSpeed":
      { "base": 0
      , "temp": 0
      , "total": 0
      }
      
    , "torque":
      { "base": 0
      , "temp": 0
      , "total": 0
      }
      
    , "xlr8":
      { "base": 0
      , "temp": 0
      , "total": 0
      }
      
    , "turning":
      { "base": 0
      , "temp": 0
      , "total": 0
      }
      
    , "brakes":
      { "base": 0
      , "temp": 0
      , "total": 0
      }
      
    , "load":
      { "base": 0
      , "temp": 0
      , "total": 0
      }
    }

  , "weight":
    { "cargo": 0.0
    , "crew": 0.0
    , "curb": 0.0
    }
  }
  await actor.update(data);
}

function setCommonComponent(component) {
  let integrity = setComponentValueIntegrity(component.integrity);
  let stat = setComponentValueStat(component.stat, integrity.total);
  let newComponent =
  { "stat": stat
  , "integrity": integrity
  , "primary": component.primary || "none"
  , "secondary": component.secondary || ""
  };
  return newComponent;  
}

function setComponentBody(body) {
  let newBody =
  { "stat": setComponentValueStat(body.stat, 1)
  , "armor": setComponentValueStat(body.armor, 1)
  , "hp": setComponentValueStat(body.hp, 1)
  , "primary": body.primary || ""
  , "secondary": body.secondary || ""
  };
  return newBody;
}

function setComponentTransmission(trans) {
  let primary = trans.primary || "none";
  let integrity = setComponentValueIntegrity(trans.integrity);

  let base = trans.stat.base || 0;
  let fluid = trans.stat.fluid || 0;

  if (base < 0) {
    base = 0;
  } else if (base > 10) {
    base = 10;
  }

  if (!["spectrum", "torqueConverter"].includes(primary)) {
    fluid = 0;
  } else if (primary === "spectrum" && fluid > 3) {
    fluid = 3;
  } else if (primary === "torqueConverter" && fluid > 10) {
    fluid = 10;
  } else if (fluid < 0) {
    fluid = 0;
  }

  let display;
  if (primary === "spectrum") {
    display = `${base} &#8605; ${fluid}`;
  } else if (primary === "torqueConverter") {
    display = `${Math.min(base, fluid)} &rHar; ${Math.max(base, fluid)}`;
  } else {
    display = String(base);
  }

  let stat =
  { "base": base
  , "fluid": fluid
  , "display": display
  };

  let newTrans =
  { "stat": stat
  , "integrity": integrity
  , "primary": primary
  };
  return newTrans;
}

function setComponentValueIntegrity(integrity) {
  let base = integrity.base || 0;
  let resist = integrity.resist || 0;
  let tally = base + resist;
  let total;

  if (base === 0) {
    total = 0;
  } else if (tally > 10) {
    total = 10;
  } else if (tally < 0) {
    total = 0;
  } else {
    total = tally;
  };

  let newIntegrity =
  { "base": base
  , "resist": resist
  , "total": total 
  };
  return newIntegrity;
}

function setComponentValueStat(stat, totalIntegrity) {
  let base = stat.base || 0;
  let mods = stat.mods || 0;
  let tally = base + mods;
  let total;

  if (totalIntegrity === 0) {
    total = 0;
  } else if (tally < 0) {
    total = 0;
  } else {
    total = tally;
  };

  let newStat =
  { "base": base
  , "mods": mods
  , "total": total
  }
  return newStat;
}

function setVehicleArmorClass(vehicle, suspension, size) {
  let acBase = 10 + SIZE_MODIFIER[size] + suspension.stat.total;
  let acMods = 0; // TODO: Figure out how to modify AC with this.
  let acTemp = 0; // TODO: Figure out how to modify AC with this.

  let newArmorClass =
  { "base": acBase
  , "mods": acMods
  , "temp": acTemp
  , "total": acBase + acMods + acTemp
  }
  return newArmorClass;
}

function setVehicleBase(vehicle) {
  let base =
    { "size": vehicle.base.size || "none"
    , "type": vehicle.base.type || "none"
    , "classification": vehicle.base.classification || "none"
    , "pilot": vehicle.base.pilot || ""
    };
  return base;
}

function setVehicleComponents(vehicle) {
  let components =
  { "engine": setCommonComponent(vehicle.components.engine)
  , "transmission": setComponentTransmission(vehicle.components.transmission)
  , "chassis": setCommonComponent(vehicle.components.chassis)
  , "suspension": setCommonComponent(vehicle.components.suspension)
  , "body": setComponentBody(vehicle.components.body)
  };
  return components;
}

function setVehicleDerivedStats(components, stats, weight) {
  let ho = components.engine.stat.total;
  let po = components.transmission.stat.base;
  let fl = components.transmission.stat.fluid;
  let br = components.chassis.stat.total;
  let re = components.suspension.stat.total;

  let transType = components.transmission.primary;
  let speedPo = transType === "torqueConverter" ? Math.min(po, fl) : po; 
  let torquePo = transType === "torqueConverter" ? Math.max(po, fl) : po;

  let temps =
  { "topSpeed": stats.topSpeed.temp || 0
  , "torque": stats.torque.temp || 0
  , "xlr8": stats.xlr8.temp || 0
  , "turning": stats.turning.temp || 0
  , "stopping": stats.stopping.temp || 0
  , "load": stats.load.temp || 0
  };

  let loadBase = Math.ceil(weight / 200);
  let newLoad =
  { "base": loadBase
  , "temp": temps.load
  , "total": loadBase + temps.load
  };

  let topSpeedBase = (11 - speedPo) * ho;
  let newTopSpeed =
  { "base": topSpeedBase
  , "temp": temps.topSpeed
  , "total": topSpeedBase + temps.topSpeed
  };
  
  let torqueBase = ho * torquePo * 10;
  let newTorque =
  { "base": torqueBase
  , "temp": temps.torque
  , "total": torqueBase + temps.torque
  };
  
  // TODO: Needs a new formula for calculating XLR8.
  let xlr8Base = 0;
  let newXlr8 =
  { "base": xlr8Base
  , "temp": temps.xlr8
  , "total": xlr8Base + temps.xlr8
  };
  
  let turningBase = Math.ceil((newTopSpeed.total + newLoad.total) / re);
  if (turningBase === Infinity || isNaN(turningBase)) {
    turningBase = 0;
  }
  let newTurning =
  { "base": turningBase
  , "temp": temps.turning
  , "total": turningBase + temps.turning
  };

  // TODO: Needs a new formula for calculating Stopping.
  let stoppingBase = 0;
  let newStopping =
  { "base": stoppingBase
  , "temp": temps.stopping
  , "total": stoppingBase + temps.stopping
  };

  let newDerivedStats =
  { "topSpeed": newTopSpeed
  , "torque": newTorque
  , "xlr8": newXlr8
  , "turning": newTurning
  , "stopping": newStopping
  , "load": newLoad
  };
  return newDerivedStats;
}

function setVehicleFuelCapacity(vehicle) {
  const baseCap =
  { "none": 0
  , "steamhorse": 4
  , "auto": 12
  , "heavy": 200
  };

  let base = baseCap[vehicle.base.classification];
  base *= vehicle.base.type === "aerial" ? 4 : 1;
  let newFuelCap =
  { "value": vehicle.fuelCapacity.value || 0
  , "max": base
  , "mods": 0
  };
  return newFuelCap;
}

function setVehicleHitPoints(vehicle, hpTotal) {
  let base = hpTotal;
  let mods = vehicle.hp.mods || 0;

  let value = vehicle.hp.value || 0;
  let max = base + mods;

  if (max < 0) max = 0;
  if (value > max) value = max;

  let newHitPoints =
  { "value": value
  , "max": max
  , "base": base
  , "mods": mods
  }
  return newHitPoints;
}

function setVehicleHoursOfOperation(vehicle, load) {
  const baseHours =
  { "none": 0
  , "steamhorse": 4
  , "auto": 8
  , "heavy": 24
  };

  let type = vehicle.base.classification;
  let temp = vehicle.hoursOfOperation.temp || 0;
  let ldPen = Math.ceil(load / -100);
  let total = baseHours[type] + ldPen + temp;

  let newHoursOfOperation =
  { "value": vehicle.hoursOfOperation.value
  , "max": total > 0 ? total : 0
  , "base": baseHours[type]
  , "ldPen": ldPen
  , "temp": temp
  };
  return newHoursOfOperation;
}

function setVehicleMods(vehicle) {
  let list = vehicle.modifications.list || [];
  let values =
  { "engineIR": 0
  , "transmissionIR": 0
  , "chassisIR": 0
  , "suspensionIR": 0
  , "ho": 0
  , "re": 0
  , "br": 0
  , "topSpeed": 0
  , "torque": 0
  , "xlr8": 0
  , "stopping": 0
  , "turning": 0
  , "load": 0
  , "hitPoints": 0
  , "ac": 0
  , "armor": 0
  , "rammingDamage": 0
  , "hoursOfOperation": 0
  , "fuelCapacity": 0
  , "weight": 0
  };

  for (let item of list) {
    if (item.mods !== "none") {
      values[item.mods] += item.val ? item.val : 0;
    }
    values.weight += item.weight ? item.weight : 0;
  }

  let newMods =
  { "list": list
  , "values": values
  }
  return newMods;
}

function setVehicleNotes(vehicle) {
  let notes =
  { "cargo": vehicle.notes.cargo || ""
  , "character": vehicle.notes.character || ""
  , "components": vehicle.notes.components || ""
  , "modifications": vehicle.notes.modifications || ""
  , "weapons": vehicle.notes.weapons || ""
  };
  return notes;
}

// TODO
function setVehicleRammingDamage(temp, stats, size) {
  let rammingBase = (
    stats.topSpeed.total + Math.floor(stats.load.total / 10) /* + SIZE */
  );

  if (rammingBase < 0) rammingBase = 1;

  let newRammingDamage =
  { "base": rammingBase
  , "temp": temp
  , "total": rammingBase + temp
  }
  return newRammingDamage;
}

function setVehicleWeight(vehicle, bodyWeight) {
  let cargo = vehicle.weight.cargo || 0.0;
  let crew = vehicle.weight.crew || 0.0;

  if (cargo < 0) cargo = 0.0;
  if (crew < 0) crew = 0.0;

  let newWeight =
  { "cargo": cargo
  , "crew": crew
  , "curb": bodyWeight + cargo + crew
  };
  return newWeight;
}