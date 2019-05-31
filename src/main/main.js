require("@babel/polyfill");
const carlo = require("carlo");

const exposeHid = require("./exposeHid");

(async () => {
  const app = await carlo.launch();
  app.on("exit", () => process.exit());
  app.serveFolder(__dirname);
  await app.load("http://localhost:1234");
  exposeHid(app);
})();
