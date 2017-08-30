const mqtt = require('mqtt');
const utils = require('../utils/utils');
var fs = require('fs');
var config = require('./config.json');

module.exports = (sensors) => {

    var options = {
        keepalive: 0,
        connectTimeout: 60 * 60 * 1000
    };

    const client = mqtt.connect('mqtt://' + config.protocol.mqtt.serverAddress + ':' + config.protocol.mqtt.port, options);

    client.on('connect', () => {
        _publish(sensors);
    });

    _publish = payload => {
        delete payload.__eventInterval;
        delete payload.__timestamp;
        client.publish(config.protocol.mqtt.topic, payload);
        utils.log("log", "Published ${payload}");
      }

    _afterPublish = () => {
        client.end();
        console.log('Done.');
    }
}
