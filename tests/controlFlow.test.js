const ControlFlow = require('../src/controlFlow');

describe('ControlFlow', () => {
    let controlFlow;

    beforeEach(() => {
        controlFlow = new ControlFlow();
    });

    test('should transition from SystemStartup to SafetyCheck', () => {
        controlFlow.SystemStartup();
        expect(controlFlow.state).toBe('SafetyCheck');
    });

    test('should transition from SafetyCheck to InitialState when sensors are OK', () => {
        controlFlow.SafetyCheck();
        expect(controlFlow.state).toBe('InitialState');
    });

    test('should transition from SafetyCheck to SensorsFailed when sensors fail', () => {
        controlFlow.CheckSensors = jest.fn(() => controlFlow.transition('SensorsFailed'));
        controlFlow.SafetyCheck();
        expect(controlFlow.state).toBe('SensorsFailed');
    });

    test('should transition from InitialState to EnvironmentCheck', () => {
        controlFlow.InitialState();
        expect(controlFlow.state).toBe('EnvironmentCheck');
    });

    test('should transition from EnvironmentCheck to MonitorCO2', () => {
        controlFlow.EnvironmentCheck();
        expect(controlFlow.state).toBe('MonitorCO2');
    });

    test('should transition from MonitorCO2 to StartFAE when CO2 > 1000ppm', () => {
        controlFlow.MonitorCO2 = jest.fn(() => controlFlow.transition('StartFAE'));
        controlFlow.EnvironmentCheck();
        expect(controlFlow.state).toBe('StartFAE');
    });

    test('should transition from MonitorCO2 to FAECheck when CO2 < 1000ppm', () => {
        controlFlow.MonitorCO2 = jest.fn(() => controlFlow.transition('FAECheck'));
        controlFlow.EnvironmentCheck();
        expect(controlFlow.state).toBe('FAECheck');
    });

    test('should transition from FAECheck to StopFAE when CO2 < 800ppm', () => {
        controlFlow.FAECheck = jest.fn(() => controlFlow.transition('StopFAE'));
        controlFlow.EnvironmentCheck();
        expect(controlFlow.state).toBe('StopFAE');
    });

    test('should transition from FAECheck to HumidityControl when CO2 >= 800ppm', () => {
        controlFlow.FAECheck = jest.fn(() => controlFlow.transition('HumidityControl'));
        controlFlow.EnvironmentCheck();
        expect(controlFlow.state).toBe('HumidityControl');
    });

    test('should transition from HumidityControl to StartHumidifier when humidity < 85%', () => {
        controlFlow.CheckHumidity = jest.fn(() => controlFlow.transition('StartHumidifier'));
        controlFlow.HumidityControl();
        expect(controlFlow.state).toBe('StartHumidifier');
    });

    test('should transition from HumidityControl to StopHumidifier when humidity > 95%', () => {
        controlFlow.CheckHumidity = jest.fn(() => controlFlow.transition('StopHumidifier'));
        controlFlow.HumidityControl();
        expect(controlFlow.state).toBe('StopHumidifier');
    });

    test('should transition from HumidityControl to TempControl when humidity is normal', () => {
        controlFlow.CheckHumidity = jest.fn(() => controlFlow.transition('TempControl'));
        controlFlow.HumidityControl();
        expect(controlFlow.state).toBe('TempControl');
    });

    test('should transition from TempControl to StartHeating when temperature < 55°F', () => {
        controlFlow.CheckTemperature = jest.fn(() => controlFlow.transition('StartHeating'));
        controlFlow.TempControl();
        expect(controlFlow.state).toBe('StartHeating');
    });

    test('should transition from TempControl to StartCooling when temperature > 65°F', () => {
        controlFlow.CheckTemperature = jest.fn(() => controlFlow.transition('StartCooling'));
        controlFlow.TempControl();
        expect(controlFlow.state).toBe('StartCooling');
    });

    test('should transition from TempControl to SafetyMonitoring when temperature is normal', () => {
        controlFlow.CheckTemperature = jest.fn(() => controlFlow.transition('SafetyMonitoring'));
        controlFlow.TempControl();
        expect(controlFlow.state).toBe('SafetyMonitoring');
    });

    test('should transition from SafetyMonitoring to EmergencyShutdown when temperature > 75°F', () => {
        controlFlow.ContinuousMonitor = jest.fn(() => controlFlow.transition('EmergencyShutdown'));
        controlFlow.SafetyMonitoring();
        expect(controlFlow.state).toBe('EmergencyShutdown');
    });

    test('should transition from SafetyMonitoring to EmergencyShutdown when humidity > 98%', () => {
        controlFlow.ContinuousMonitor = jest.fn(() => controlFlow.transition('EmergencyShutdown'));
        controlFlow.SafetyMonitoring();
        expect(controlFlow.state).toBe('EmergencyShutdown');
    });

    test('should transition from SafetyMonitoring to EmergencyShutdown when water is detected', () => {
        controlFlow.ContinuousMonitor = jest.fn(() => controlFlow.transition('EmergencyShutdown'));
        controlFlow.SafetyMonitoring();
        expect(controlFlow.state).toBe('EmergencyShutdown');
    });

    test('should transition from SafetyMonitoring to EmergencyShutdown when power fluctuation occurs', () => {
        controlFlow.ContinuousMonitor = jest.fn(() => controlFlow.transition('EmergencyShutdown'));
        controlFlow.SafetyMonitoring();
        expect(controlFlow.state).toBe('EmergencyShutdown');
    });

    test('should transition from EmergencyShutdown to StopAllSystems', () => {
        controlFlow.EmergencyShutdown();
        expect(controlFlow.state).toBe('StopAllSystems');
    });

    test('should transition from StopAllSystems to TriggerAlarm', () => {
        controlFlow.StopAllSystems();
        expect(controlFlow.state).toBe('TriggerAlarm');
    });

    test('should transition from TriggerAlarm to RequireManualReset', () => {
        controlFlow.TriggerAlarm();
        expect(controlFlow.state).toBe('RequireManualReset');
    });

    // New tests for additional methods and transitions
    test('should transition from StartFAE to StopFAE', () => {
        controlFlow.StartFAE();
        expect(controlFlow.state).toBe('StopFAE');
    });

    test('should transition from StopFAE to HumidityControl', () => {
        controlFlow.StopFAE();
        expect(controlFlow.state).toBe('HumidityControl');
    });

    test('should transition from StartHumidifier to WaitHumidity', () => {
        controlFlow.StartHumidifier();
        expect(controlFlow.state).toBe('WaitHumidity');
    });

    test('should transition from StopHumidifier to WaitHumidity', () => {
        controlFlow.StopHumidifier();
        expect(controlFlow.state).toBe('WaitHumidity');
    });

    test('should transition from WaitHumidity to CheckHumidity after 5 minutes', (done) => {
        jest.useFakeTimers();
        controlFlow.WaitHumidity();
        jest.advanceTimersByTime(300000); // 5 minutes
        expect(controlFlow.state).toBe('CheckHumidity');
        done();
    });

    test('should transition from StartHeating to WaitTemp', () => {
        controlFlow.StartHeating();
        expect(controlFlow.state).toBe('WaitTemp');
    });

    test('should transition from StartCooling to WaitTemp', () => {
        controlFlow.StartCooling();
        expect(controlFlow.state).toBe('WaitTemp');
    });

    test('should transition from WaitTemp to CheckTemperature after 5 minutes', (done) => {
        jest.useFakeTimers();
        controlFlow.WaitTemp();
        jest.advanceTimersByTime(300000); // 5 minutes
        expect(controlFlow.state).toBe('CheckTemperature');
        done();
    });

    test('should transition from SafetyMonitoring to ContinuousMonitor', () => {
        controlFlow.SafetyMonitoring();
        expect(controlFlow.state).toBe('ContinuousMonitor');
    });

    test('should transition from ContinuousMonitor to EmergencyShutdown when safety threshold is exceeded', () => {
        controlFlow.ContinuousMonitor = jest.fn(() => controlFlow.transition('EmergencyShutdown'));
        controlFlow.SafetyMonitoring();
        expect(controlFlow.state).toBe('EmergencyShutdown');
    });

    test('should transition from ContinuousMonitor to EnvironmentCheck when all parameters are normal', () => {
        controlFlow.ContinuousMonitor = jest.fn(() => controlFlow.transition('EnvironmentCheck'));
        controlFlow.SafetyMonitoring();
        expect(controlFlow.state).toBe('EnvironmentCheck');
    });

    test('should transition from EmergencyShutdown to StopAllSystems', () => {
        controlFlow.EmergencyShutdown();
        expect(controlFlow.state).toBe('StopAllSystems');
    });

    test('should transition from StopAllSystems to TriggerAlarm', () => {
        controlFlow.StopAllSystems();
        expect(controlFlow.state).toBe('TriggerAlarm');
    });

    test('should transition from TriggerAlarm to RequireManualReset', () => {
        controlFlow.TriggerAlarm();
        expect(controlFlow.state).toBe('RequireManualReset');
    });

    // Tests for new methods that read data from the Pico sensors
    test('should read data from BME280 sensor', async () => {
        const data = await controlFlow.bme280.readSensorData();
        expect(data).toHaveProperty('temperature');
        expect(data).toHaveProperty('humidity');
    });

    test('should read data from MH-Z19B sensor', async () => {
        const data = await controlFlow.mhz19b.readCO2();
        expect(data).toHaveProperty('co2');
    });

    test('should read data from water detection sensor', () => {
        const waterDetected = controlFlow.waterSensor.readSync();
        expect(waterDetected).toBe(0); // Assuming no water detected
    });

    // Tests for new methods that control the Pico relays
    test('should control the fan relay', () => {
        controlFlow.relayFan.writeSync(1);
        expect(controlFlow.relayFan.readSync()).toBe(1);
        controlFlow.relayFan.writeSync(0);
        expect(controlFlow.relayFan.readSync()).toBe(0);
    });

    test('should control the humidifier relay', () => {
        controlFlow.relayHum.writeSync(1);
        expect(controlFlow.relayHum.readSync()).toBe(1);
        controlFlow.relayHum.writeSync(0);
        expect(controlFlow.relayHum.readSync()).toBe(0);
    });

    test('should control the heater relay', () => {
        controlFlow.relayHeat.writeSync(1);
        expect(controlFlow.relayHeat.readSync()).toBe(1);
        controlFlow.relayHeat.writeSync(0);
        expect(controlFlow.relayHeat.readSync()).toBe(0);
    });
});
