import {
  deserializeError,
  DisconnectedDevice,
  DisconnectedDeviceDuringOperation
} from "@ledgerhq/errors";
import Transport from "@ledgerhq/hw-transport";


const cmd = async (...args) => {
  try {
    const res = await window.ledgerHidTransport(...args);
    return res;
  } catch (e) {
    throw deserializeError(e);
  }
};

class HIDProxy extends Transport {
  static isSupported = () => Promise.resolve(true);
  static list = () => Promise.resolve([null]);
  static listen = o => {
    let unsubscribed;
    setTimeout(() => {
      if (unsubscribed) return;
      o.next({ type: "add", descriptor: null });
      o.complete();
    }, 0);
    return {
      unsubscribe: () => {
        unsubscribed = true;
      }
    };
  };

  static open = async () => {
    await cmd("open");
    return new HIDProxy();
  };

  setScrambleKey() {}

  close() {
    return cmd("close");
  }

  async exchange(apdu) {
    const { debug } = this;
    const inputHex = apdu.toString("hex");
    if (debug) {
      debug("=> " + inputHex);
    }
    try {
      const outputHex = await cmd("exchange", inputHex);
      if (debug) {
        debug("<= " + outputHex);
      }
      return Buffer.from(outputHex, "hex");
    } catch (e) {
      if (
        e instanceof DisconnectedDeviceDuringOperation ||
        e instanceof DisconnectedDevice
      ) {
        this.emit("disconnect", e);
      }
      throw e;
    }
  }
}

export default HIDProxy
