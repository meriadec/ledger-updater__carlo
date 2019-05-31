import React, { useState } from "react";
import genuineCheck from "@ledgerhq/live-common/lib/hw/genuineCheck";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";

import HidProxy from "../HidProxy";

export default () => {
  const [transport, setTransport] = useState(null);
  const [deviceInfos, setDeviceInfos] = useState(null);

  const onClick = async () => {
    try {
      const t = await HidProxy.open();
      setTransport(t);
      const infos = await getDeviceInfo(t);
      setDeviceInfos(infos);
    } catch (err) {
      console.log(err);
    }
  };

  console.log(deviceInfos);

  return (
    <>
      {!deviceInfos && (
        <div style={styles.container}>
          <button onClick={onClick}>detect device</button>
        </div>
      )}
      {deviceInfos && (
        <div style={styles.container}>
          <ul>
            <li>
              <b>version:</b> {deviceInfos.version}
            </li>
            <li>
              <b>mcuVersion:</b> {deviceInfos.mcuVersion}
            </li>
            <li>
              <b>targetId:</b> {deviceInfos.targetId}
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    padding: 20
  }
};
