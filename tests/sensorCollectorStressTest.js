/*
	sensorTag IR Temperature sensor example

	This example uses Sandeep Mistry's sensortag library for node.js to
	read data from a TI sensorTag.

	Although the sensortag library functions are all asynchronous,
	there is a sequence you need to follow in order to successfully
	read a tag:
		1) discover the tag
		2) connect to and set up the tag
		3) turn on the sensor you want to use (in this case, IR temp)
		4) turn on notifications for the sensor
		5) listen for changes from the sensortag
*/

var SensorTag = require('./index');
const publisher = require('./publisher/mqtt');

// listen for tags:
SensorTag.discover(function(tag) {
	// when you disconnect from a tag, exit the program:
	tag.on('disconnect', function() {
		console.log('disconnected!');
		process.exit(0);
	});

	function connectAndSetUpMe() {			// attempt to connect to the tag
     console.log('=====================================================');
		 console.log('Starting device ... (function: connectAndSetUpMe)');
		 console.log('=====================================================');
     tag.connectAndSetUp(enableSensors);		// when you connect, call enableSensors
   }

   function enableSensors() {		// attempt to enable the IR Temperature sensor
		 console.log('=======================================================================');
		 console.log('Reading device information ... (function: readSensorInformations)');
		 console.log('=======================================================================');
		 readSensorInformations();
     // when you enable any of sensors, start notifications:

		 console.log('=================================');
		 console.log('Starting IrTemperature ...');
		 console.log('Starting Accelerometer ...');
		 console.log('Starting Humidity ...');
		 console.log('Starting Magnetometer ...');
		 console.log('Starting Barometric Pressure ...');
		 console.log('Starting Gyroscope ...');
		 console.log('=================================');

     tag.enableIrTemperature(notifyMe);
		 tag.enableAccelerometer(notifyMe);
		 tag.enableHumidity(notifyMe);
		 tag.enableMagnetometer(notifyMe);
		 tag.enableBarometricPressure(notifyMe);
		 tag.enableGyroscope(notifyMe);
		 tag.enableLuxometer(notifyMe);
   }

	 function readSensorInformations() {
		 tag.readDeviceName(function(error, deviceName) {
			 console.log('\tdevice name = ' + deviceName);
		 });

		 tag.readSystemId(function(error, systemId) {
			 console.log('\tsystem id = ' + systemId);
		 });

		 tag.readSerialNumber(function(error, serialNumber) {
			 console.log('\tserial number = ' + serialNumber);
		 });

		 tag.readHardwareRevision(function(error, hardwareRevision) {
			 console.log('\thardware revision = ' + hardwareRevision);
		 });

		 tag.readFirmwareRevision(function(error, firmwareRevision) {
			 console.log('\tfirmware revision = ' + firmwareRevision);
		 });

		 tag.readHardwareRevision(function(error, softwareRevision) {
			 console.log('\tsoftware revision = ' + softwareRevision);
		 });

		 tag.readManufacturerName(function(error, manufacturerName) {
			 console.log('\tmanufacturer name = ' + manufacturerName);
		 });
	 }

	function notifyMe() {
   	//tag.notifyIrTemperature(listenForIrTemperaturepReading);   	// start the IrTemperature listener
		//tag.notifyAccelerometer(listenForAccelerometerReading);   	// start the accelerometer listener
		//tag.notifyHumidity(listenForHumidityReading);   	// start the humidity listener
		//tag.notifyMagnetometer(listenForMagnetometerReading);   	// start the Magnetometer listener
		//tag.notifyBarometricPressure(listenForBarometricPressureReading);   	// start the BarometricPressure listener
		//tag.notifyGyroscope(listenForGyroscopeReading);   	// start the Gyroscope listener
		tag.setLuxometerPeriod(2550, function(error) {
			tag.notifyLuxometer(listenForLuxometerReading);   	// start the Gyroscope listener
		});

		tag.notifySimpleKey(listenForButton);		// start the button listener
   }

   // When you get an IrTemperature change, print it out:
	function listenForIrTemperaturepReading() {
		tag.on('irTemperatureChange', function(objectTemp, ambientTemp) {
			 publisher('{"sensorTemp": ' + objectTemp.toFixed(1) + ',"ambientTemp": ' + ambientTemp.toFixed(1) + '}');
	     console.log('\tTemperature - Object Temp = %d deg. C', objectTemp.toFixed(1));
	     console.log('\tTemperature - Ambient Temp = %d deg. C', ambientTemp.toFixed(1));
	   });
	}

	// When you get an Accelerometer change, print it out:
 function listenForAccelerometerReading() {
		tag.on('accelerometerChange', function(x, y, z) {
			publisher('{"accelerometer": "x: ' +  x.toFixed(1) + 'G, y: ' + y.toFixed(1) + 'G, z: ' + z.toFixed(1) + 'G"}');
			console.log('\tAccelerometer - x = %d G', x.toFixed(1));
			console.log('\tAccelerometer - y = %d G', y.toFixed(1));
			console.log('\tAccelerometer - z = %d G', z.toFixed(1));
		});
 }

 // When you get an Humidity change, print it out:
 function listenForHumidityReading() {
	 tag.on('humidityChange', function(temperature, humidity) {
		 publisher('{"humidity": ' + humidity.toFixed(1) + '}');
		 console.log('\tHumidity - humidity = %d %', humidity.toFixed(1));
	 });
 }

 // When you get an Magnetometer change, print it out:
 function listenForMagnetometerReading() {
	 tag.on('magnetometerChange', function(x, y, z) {
		 publisher('{"magnetometer": "x: ' +  x.toFixed(1) + 'G, y: ' + y.toFixed(1) + 'G, z: ' + z.toFixed(1) + 'G"}');
		 console.log('\tMagnetometer - x = %d G', x.toFixed(1));
		 console.log('\tMagnetometer - y = %d G', y.toFixed(1));
		 console.log('\tMagnetometer - z = %d G', z.toFixed(1));
	 });
 }

 // When you get an barometricPressure change, print it out:
 function listenForBarometricPressureReading() {
	tag.on('barometricPressureChange', function(pressure) {
		publisher('{"pressure": ' + pressure.toFixed(1) + '}');
		console.log('\tpressure = %d mBar', pressure.toFixed(1));
	});
 }

 // When you get an Gyroscope change, print it out:
 function listenForGyroscopeReading() {
	tag.on('gyroscopeChange', function(x, y, z) {
		publisher('{"gyroscope": "x: ' +  x.toFixed(1) + '°/s, y: ' + y.toFixed(1) + '°/s, z: ' + z.toFixed(1) + '°/s"}');
		console.log('\tGyroscope - x = %d °/s', x.toFixed(1));
		console.log('\tGyroscope - y = %d °/s', y.toFixed(1));
		console.log('\tGyroscope - z = %d °/s', z.toFixed(1));
	});
 }

 // When you get an barometricPressure change, print it out:
 function listenForLuxometerReading() {
	 tag.on('luxometerChange', function(lux) {
		 publisher('{"luminosity": ' + lux.toFixed(1) + '}');
		 console.log('\tluminosity = %d', lux.toFixed(1));
	 });
 }

	// when you get a button change, print it out:
	function listenForButton() {
		tag.on('simpleKeyChange', function(left, right) {
			if (left) {
				console.log('left: ' + left);
			}
			if (right) {
				console.log('right: ' + right);
			}
			// if both buttons are pressed, disconnect:
			if (left && right) {
				tag.disconnect();
			}
	   });
	}

	// Now that you've defined all the functions, start the process:
	connectAndSetUpMe();
});
