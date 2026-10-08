/* Prints the current/upcoming events (as the site's runtime would see them right now)
   as JSON, so tools/build_site.py can write truthful static fallbacks.
   Usage: node tools/events-snapshot.js [ISO-now] */
const fs = require('fs'), vm = require('vm'), path = require('path');
const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'events-data.js'), 'utf8');
const RealDate = Date, fixed = process.argv[2] ? new RealDate(process.argv[2]).getTime() : RealDate.now();
class D extends RealDate { constructor(...a) { if (a.length === 0) super(fixed); else super(...a); } static now() { return fixed; } }
const ctx = { window: {}, Date: D, Intl, Math, String, Number, Array, encodeURIComponent };
vm.createContext(ctx); vm.runInContext(src, ctx);
const U = ctx.window.MFM_EVT, now = new D();
const out = U.upcoming(ctx.window.MFM_EVENTS, now).map(e => Object.assign({}, e, {
  _start: U.start(e).toISOString(), _end: U.end(e).toISOString(), _live: U.isLive(e, now),
  _gcal: U.gcal(e, 'https://mfmmegaregion2usa.org'), _schema: U.schema(e), _ticket: U.ticketUrl(e)
}));
process.stdout.write(JSON.stringify(out, null, 1));
