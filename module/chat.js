export async function rollPushCheck(component, integrity, pilot, vehicle) {
  const pushOptions = await getPushOptions(component);
  if (!pushOptions.cancelled) {
    const roll = await new Roll("d10").roll({ async: true });
    const pilotIR = parseInt(pushOptions.pilotIR);
    const target = integrity + (isNaN(pilotIR) ? 0 : pilotIR);

    let outcome = "";
    if (roll.total === 10) {
      outcome = "failure";
    } else if (roll.total >= target) {
      outcome = "failure";
    } else {
      outcome = "success";
    }

    let data =
    { "result": roll.total
    , "outcome": outcome
    , "render": await roll.render()
    , "target": target
    , "component": component
    , "pilot": pilot
    , "vehicle": vehicle
    , "template": "push"
    };
    await postChatMessage(data);
  }
}

async function buildChatMessageContent(data) {
  const template = `modules/tsl-module/templates/chat/${data.template}-chat.hbs`;
  return await renderTemplate(template, data);
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
          callback: html => resolve(_processTestOptions(html[0].querySelector("form")))
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
  await AudioHelper.play(
  { src: "sounds/dice.wav"
  , volume: 0.8
  , autoplay: true
  , loop: false
  }, true);
  await ChatMessage.create(
  { user: game.user.id
  // , speaker: data.pilot
  , flavor: `${game.i18n.localize(titleLink)} ${game.i18n.localize(pushLink)}`
  , content: await buildChatMessageContent(data)
  }, {});
}

function _processTestOptions(form) {
  return { pilotIR: form.pilotIR.value };
}