export async function rollPushCheck(component, integrity, pilot, vehicle) {
  const pushOptions = await getPushOptions(component);
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

function _processTestOptions(form) {
  return { pilotIR: form.pilotIR.value };
}