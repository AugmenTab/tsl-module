export function calculateVehicleData(actor) {
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
    , "class": "none"
    , "pilot": ""
    }

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
  
  , "modifications": []
  
  , "notes":
    { "cargo": ""
    , "character": ""
    , "components": ""
    , "modifications": ""
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