export function calculateVehicleData(actor) {
  let data = duplicate(actor.data);
  data.data.vehicle.notes = setVehicleNotes(actor.data.data.vehicle);
  data.data.vehicle.base = setVehicleBase(actor.data.data.vehicle);
  data.data.vehicle.modifications = setVehicleMods(actor.data.data.vehicle);
  data.data.vehicle.components = setVehicleComponents(actor.data.data.vehicle);

  let todo =
  { "ac":
    { "base": 0
    , "mods": 0
    , "temp": 0
    , "total": 0
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
    
  , "rammingDamage":
    { "base": 0
    , "temp": 0
    , "total": 0
    }
  
  , "speed":
    { "max": 0
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
      , "mods": 0
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
  };
  actor.update(data);
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

function setComponentBody(component) {
  { "stat":
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

function setComponentTransmission() {
  { "stat":
    { "display": "0"
    , "base": 0
    , "fluid": 0
    }
  , "integrity":
    { "base": 0
    , "total": 0
    , "resist": 0
    }
  , "primary": ""
  , "secondary": ""
  }
  
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

function setVehicleBase(vehicle) {
  let base =
    { "size": vehicle.base || "none"
    , "type": vehicle.type || "none"
    , "class": vehicle.class || "none"
    , "pilot": vehicle.pilot || ""
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

function setVehicleMods(vehicle) {
  return vehicle.modifications || [];
}

function setVehicleNotes(vehicle) {
  let notes =
  { "cargo": vehicle.notes.cargo || ""
  , "character": vehicle.notes.character || ""
  , "components": vehicle.notes.components || ""
  , "modifications": vehicle.notes.modifications || ""
  };
  return notes;
}