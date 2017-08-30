# texas-sensortag

Node.js lib for the [TI CC2650 SensorTag](http://www.ti.com/tool/cc2650stk)

Available sensors:
  - sensorTemp (float)
  - ambientTemp (float)
  - accelerometer (text)
  - humidity (float)
  - magnetometer (text)
  - pressure (float)
  - gyroscope (text)
  - luminosity (float)

## Prerequisites

 * [node-gyp install guide](https://github.com/nodejs/node-gyp#installation)
 * [noble prerequisites](https://github.com/sandeepmistry/noble#prerequisites)

## Install

```sh
npm install
```

## Usage

1. Configure the MQTT and the frequency of data collection in the config file (./publisher/config.json).

2. Execute the following script:
```sh
./texasCC2650.sh
```

3. Press and hold the device power button for 5 seconds to establish the bluetooth connection.
