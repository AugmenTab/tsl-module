export async function makeRamAttack(name, vehicle) {
  const ramOptions = await getRamOptions();
  if (!ramOptions.cancelled) {
    const nums = [ramOptions.speedDiff, ramOptions.loadDiff, ramOptions.sizeDiff];
    if (nums.some(x => isNaN(x))) {
      const error = game.i18n.localize("tsl.chat.error.isNaNError");
      return ui.notifications.error(error);
    }

    let damages = calculateRammingDamage(
      vehicle.speed.value, vehicle.stats.load.total, ramOptions
    );
    let data =
    { "template": "ram"
    , "vehicle": name
    , "pilot": vehicle.base.pilot
    , "userDamage": Math.max(damages.userDamage, 1)
    , "targetDamage": Math.max(damages.targetDamage, 1)
    , "userPassengerDamage": Math.max(damages.userPassengerDamage, 1)
    , "targetPassengerDamage": Math.max(damages.targetPassengerDamage, 1)
    };
    await postChatMessage(data);
  }
}

export async function rollPushCheck(component, integrity, pilot, vehicle) {
  const pushOptions = await getPushOptions(component);
  if (!pushOptions.cancelled) {
    const pilotIR = parseInt(pushOptions.pilotIR);
    const target = integrity + (isNaN(pilotIR) ? 0 : pilotIR);
    const roll = await new Roll(`d10cf=10cs<${target}`).roll({ async: true });

    let data =
    { "render": await roll.render()
    , "target": target >= 10 ? 10 : target
    , "component": component
    , "pilot": pilot
    , "vehicle": vehicle
    , "template": "push"
    };
    console.log(data.render);
    await postChatMessage(data);
  }
}

async function buildChatMessageContent(data) {
  const template = `modules/tsl-module/templates/chat/${data.template}-chat.hbs`;
  return await renderTemplate(template, data);
}

function calculateRammingDamage(speed, load, ramOptions) {
  let base = speed;
  if (ramOptions.collision === "swipe") {
    base = Math.abs(speed - ramOptions.speedDiff);
  } else if (ramOptions.collision === "headOn") {
    base = speed + ramOptions.speedDiff;
  } else if (ramOptions.collision === "tbone") {
    const halfTarget = Math.floor(ramOptions.speedDiff / 2);
    base = speed + halfTarget >= 0 ? halfTarget : 0;
  }

  let userDamage = base;
  let targetDamage = base;
  let loadDamage = Math.abs(load - ramOptions.loadDiff);
  let lighter = load > ramOptions.loadDiff ? "target" : "user";
  if (lighter === "user") {
    userDamage += loadDamage;
  } else {
    targetDamage += loadDamage;
  }
  if (Math.abs(ramOptions.sizeDiff) >= 3) ramOptions.immovable = true;
  if (ramOptions.immovable) {
    let immovableDamage = Math.floor(load / 10);
    userDamage += immovableDamage;
    targetDamage += immovableDamage;
  }
  if (ramOptions.sizeDiff > 0) {
    userDamage = Math.floor(userDamage / (2 * Math.abs(ramOptions.sizeDiff)));
    targetDamage = Math.floor(targetDamage * (1 + (0.25 * Math.abs(ramOptions.sizeDiff))));
  } else if (ramOptions.sizeDiff < 0) {
    targetDamage = Math.floor(targetDamage / (2 * Math.abs(ramOptions.sizeDiff)));
    userDamage = Math.floor(userDamage * (1 + (0.25 * Math.abs(ramOptions.sizeDiff))));
  }

  let userPassengerDamage = 0;
  let targetPassengerDamage = 0;

  let damages =
  { "userDamage": userDamage
  , "targetDamage": targetDamage
  , "userPassengerDamage": userPassengerDamage
  , "targetPassengerDamage": targetPassengerDamage
  };
  return damages;
}

async function getRamOptions() {
  const template = "modules/tsl-module/templates/chat/ram-dialog.hbs";
  const html = await renderTemplate(template, {});
  return new Promise(resolve => {
    const data = {
      title: game.i18n.localize("tsl.chat.ram"),
      content: html,
      buttons: {
        roll: {
          label: game.i18n.localize("tsl.chat.roll"),
          callback: html => resolve(_processRamOptions(html[0].querySelector("form")))
        },
        cancel: {
          label: game.i18n.localize("tsl.chat.cancel"),
          callback: html => resolve({cancelled: true})
        }
      },
      default: "roll",
      close: () => resolve({cancelled: true})
    };
    new Dialog(data, null).render(true);
  });
}

async function getPushOptions(component) {
  const template = "modules/tsl-module/templates/chat/push-dialog.hbs";
  const html = await renderTemplate(template, {});
  const titleLink = `tsl.components.${component}.label`;
  return new Promise(resolve => {
    const data = {
      title: `${game.i18n.localize(titleLink)} ${game.i18n.localize("tsl.chat.push")}`,
      content: html,
      buttons: {
        roll: {
          label: game.i18n.localize("tsl.chat.roll"),
          callback: html => resolve(_processPushOptions(html[0].querySelector("form")))
        },
        cancel: {
          label: game.i18n.localize("tsl.chat.cancel"),
          callback: html => resolve({cancelled: true})
        }
      },
      default: "roll",
      close: () => resolve({cancelled: true})
    };
    new Dialog(data, null).render(true);
  });
}

async function postChatMessage(data) {
  const titleLink = `tsl.components.${data.component}.label`;
  const pushLink = "tsl.chat.push";
  let flavor = data.template === "push"
    ? `${game.i18n.localize(titleLink)} ${game.i18n.localize(pushLink)}`
    : game.i18n.localize("tsl.chat.ram");
  await AudioHelper.play(
  { src: data.template === "push" ? "sounds/dice.wav" : "modules/tsl-module/sounds/ram.mp3"
  , volume: 0.8
  , autoplay: true
  , loop: false
  }, true);
  await ChatMessage.create(
  { user: game.user.id
  , flavor: flavor
  , content: await buildChatMessageContent(data)
  }, {});
}

function _processRamOptions(form) {
  const options =
  { collision: form.collision.value
  , speedDiff: parseInt(form.speedDiff.value)
  , loadDiff: parseInt(form.loadDiff.value)
  , immovable: form.immovable.checked
  , sizeDiff: parseInt(form.sizeDiff.value)
  };
  return options;
}

function _processPushOptions(form) {
  return { pilotIR: form.pilotIR.value };
}