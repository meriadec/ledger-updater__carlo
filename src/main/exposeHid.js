const TransportNodeHid = require("@ledgerhq/hw-transport-node-hid-noevents")
  .default;
const { serializeError } = require("@ledgerhq/errors");
const invariant = require("invariant");

let transport = null;

module.exports = app => {
  app.exposeFunction("ledgerHidTransport", async (cmd, ...args) => {
    try {
      switch (cmd) {
        case "open":
          if (transport) {
            console.warn("transport was already opened");
            await transport.close();
          }
          transport = await TransportNodeHid.open("");
          transport.on("disconnect", () => {
            transport = null;
          });
          return;

        case "close":
          invariant(transport, "HID was not opened");
          try {
            await transport.close();
          } finally {
            transport = null;
          }
          return true;

        case "exchange":
          invariant(transport, "HID was not opened");
          const [hex] = args;
          const response = await transport.exchange(Buffer.from(hex, "hex"));
          return response.toString("hex");
      }
    } catch (e) {
      throw serializeError(e);
    }
  });
};
