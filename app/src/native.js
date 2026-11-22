// Körs bara i iOS-appen. Byggs till www/native.js av scripts/build.mjs.
// Webbversionen anropar window.ITNative om det finns, annars händer inget.
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { KeepAwake } from "@capacitor-community/keep-awake";

const MAX = 60; // iOS tillåter högst 64 väntande notiser per app
const SOUND = { run: "lopning.wav", rest: "vila.wav", done: "klart.wav" };

if (Capacitor.isNativePlatform()) {
  let queue = Promise.resolve();
  let latest = [];
  const run = (fn) => (queue = queue.then(fn).catch((e) => console.warn("ITNative", e)));

  async function cancelAll() {
    const { notifications } = await LocalNotifications.getPending();
    if (notifications.length) {
      await LocalNotifications.cancel({ notifications: notifications.map((n) => ({ id: n.id })) });
    }
  }

  async function scheduleAll() {
    await cancelAll();
    const now = Date.now();
    const list = latest
      .filter((x) => x.at > now + 300)
      .slice(0, MAX)
      .map((x, i) => ({
        id: i + 1,
        title: x.title,
        body: x.body,
        sound: SOUND[x.kind] || SOUND.run,
        // Visas inte när appen är öppen, där sköter appen själv pip och röst.
        silent: true,
        schedule: { at: new Date(x.at), allowWhileIdle: true },
      }));
    if (list.length) await LocalNotifications.schedule({ notifications: list });
  }

  window.ITNative = {
    // Anropas när ett pass startar: be om lov att visa notiser och håll skärmen tänd.
    start() {
      run(async () => {
        const p = await LocalNotifications.checkPermissions();
        if (p.display !== "granted") await LocalNotifications.requestPermissions();
      });
      KeepAwake.keepAwake().catch(() => {});
    },
    // Kommande byten: [{at: ms sedan 1970, kind: "run"|"rest"|"done", title, body}]
    update(list) {
      latest = list || [];
      run(latest.length ? scheduleAll : cancelAll);
    },
    stop() {
      latest = [];
      run(cancelAll);
      KeepAwake.allowSleep().catch(() => {});
    },
  };

  // Rensa notiser från ett pass som avbröts när appen stängdes.
  run(cancelAll);
}
