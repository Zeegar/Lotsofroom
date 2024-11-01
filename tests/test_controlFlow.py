import unittest
from controlFlow import ControlFlow

class TestControlFlow(unittest.TestCase):
    def setUp(self):
        self.control_flow = ControlFlow()

    def test_transition_from_SystemStartup_to_SafetyCheck(self):
        self.control_flow.SystemStartup()
        self.assertEqual(self.control_flow.state, 'SafetyCheck')

    def test_transition_from_SafetyCheck_to_InitialState_when_sensors_are_OK(self):
        self.control_flow.SafetyCheck()
        self.assertEqual(self.control_flow.state, 'InitialState')

    def test_transition_from_SafetyCheck_to_SensorsFailed_when_sensors_fail(self):
        self.control_flow.CheckSensors = lambda: self.control_flow.transition('SensorsFailed')
        self.control_flow.SafetyCheck()
        self.assertEqual(self.control_flow.state, 'SensorsFailed')

    def test_transition_from_InitialState_to_EnvironmentCheck(self):
        self.control_flow.InitialState()
        self.assertEqual(self.control_flow.state, 'EnvironmentCheck')

    def test_transition_from_EnvironmentCheck_to_MonitorCO2(self):
        self.control_flow.EnvironmentCheck()
        self.assertEqual(self.control_flow.state, 'MonitorCO2')

    def test_transition_from_MonitorCO2_to_StartFAE_when_CO2_greater_than_1000ppm(self):
        self.control_flow.MonitorCO2 = lambda: self.control_flow.transition('StartFAE')
        self.control_flow.EnvironmentCheck()
        self.assertEqual(self.control_flow.state, 'StartFAE')

    def test_transition_from_MonitorCO2_to_FAECheck_when_CO2_less_than_1000ppm(self):
        self.control_flow.MonitorCO2 = lambda: self.control_flow.transition('FAECheck')
        self.control_flow.EnvironmentCheck()
        self.assertEqual(self.control_flow.state, 'FAECheck')

    def test_transition_from_FAECheck_to_StopFAE_when_CO2_less_than_800ppm(self):
        self.control_flow.FAECheck = lambda: self.control_flow.transition('StopFAE')
        self.control_flow.EnvironmentCheck()
        self.assertEqual(self.control_flow.state, 'StopFAE')

    def test_transition_from_FAECheck_to_HumidityControl_when_CO2_greater_than_or_equal_to_800ppm(self):
        self.control_flow.FAECheck = lambda: self.control_flow.transition('HumidityControl')
        self.control_flow.EnvironmentCheck()
        self.assertEqual(self.control_flow.state, 'HumidityControl')

    def test_transition_from_HumidityControl_to_StartHumidifier_when_humidity_less_than_85_percent(self):
        self.control_flow.CheckHumidity = lambda: self.control_flow.transition('StartHumidifier')
        self.control_flow.HumidityControl()
        self.assertEqual(self.control_flow.state, 'StartHumidifier')

    def test_transition_from_HumidityControl_to_StopHumidifier_when_humidity_greater_than_95_percent(self):
        self.control_flow.CheckHumidity = lambda: self.control_flow.transition('StopHumidifier')
        self.control_flow.HumidityControl()
        self.assertEqual(self.control_flow.state, 'StopHumidifier')

    def test_transition_from_HumidityControl_to_TempControl_when_humidity_is_normal(self):
        self.control_flow.CheckHumidity = lambda: self.control_flow.transition('TempControl')
        self.control_flow.HumidityControl()
        self.assertEqual(self.control_flow.state, 'TempControl')

    def test_transition_from_TempControl_to_StartHeating_when_temperature_less_than_55F(self):
        self.control_flow.CheckTemperature = lambda: self.control_flow.transition('StartHeating')
        self.control_flow.TempControl()
        self.assertEqual(self.control_flow.state, 'StartHeating')

    def test_transition_from_TempControl_to_StartCooling_when_temperature_greater_than_65F(self):
        self.control_flow.CheckTemperature = lambda: self.control_flow.transition('StartCooling')
        self.control_flow.TempControl()
        self.assertEqual(self.control_flow.state, 'StartCooling')

    def test_transition_from_TempControl_to_SafetyMonitoring_when_temperature_is_normal(self):
        self.control_flow.CheckTemperature = lambda: self.control_flow.transition('SafetyMonitoring')
        self.control_flow.TempControl()
        self.assertEqual(self.control_flow.state, 'SafetyMonitoring')

    def test_transition_from_SafetyMonitoring_to_EmergencyShutdown_when_temperature_greater_than_75F(self):
        self.control_flow.ContinuousMonitor = lambda: self.control_flow.transition('EmergencyShutdown')
        self.control_flow.SafetyMonitoring()
        self.assertEqual(self.control_flow.state, 'EmergencyShutdown')

    def test_transition_from_SafetyMonitoring_to_EmergencyShutdown_when_humidity_greater_than_98_percent(self):
        self.control_flow.ContinuousMonitor = lambda: self.control_flow.transition('EmergencyShutdown')
        self.control_flow.SafetyMonitoring()
        self.assertEqual(self.control_flow.state, 'EmergencyShutdown')

    def test_transition_from_SafetyMonitoring_to_EmergencyShutdown_when_water_is_detected(self):
        self.control_flow.ContinuousMonitor = lambda: self.control_flow.transition('EmergencyShutdown')
        self.control_flow.SafetyMonitoring()
        self.assertEqual(self.control_flow.state, 'EmergencyShutdown')

    def test_transition_from_SafetyMonitoring_to_EmergencyShutdown_when_power_fluctuation_occurs(self):
        self.control_flow.ContinuousMonitor = lambda: self.control_flow.transition('EmergencyShutdown')
        self.control_flow.SafetyMonitoring()
        self.assertEqual(self.control_flow.state, 'EmergencyShutdown')

    def test_transition_from_EmergencyShutdown_to_StopAllSystems(self):
        self.control_flow.EmergencyShutdown()
        self.assertEqual(self.control_flow.state, 'StopAllSystems')

    def test_transition_from_StopAllSystems_to_TriggerAlarm(self):
        self.control_flow.StopAllSystems()
        self.assertEqual(self.control_flow.state, 'TriggerAlarm')

    def test_transition_from_TriggerAlarm_to_RequireManualReset(self):
        self.control_flow.TriggerAlarm()
        self.assertEqual(self.control_flow.state, 'RequireManualReset')

    def test_transition_from_StartFAE_to_StopFAE(self):
        self.control_flow.StartFAE()
        self.assertEqual(self.control_flow.state, 'StopFAE')

    def test_transition_from_StopFAE_to_HumidityControl(self):
        self.control_flow.StopFAE()
        self.assertEqual(self.control_flow.state, 'HumidityControl')

    def test_transition_from_StartHumidifier_to_WaitHumidity(self):
        self.control_flow.StartHumidifier()
        self.assertEqual(self.control_flow.state, 'WaitHumidity')

    def test_transition_from_StopHumidifier_to_WaitHumidity(self):
        self.control_flow.StopHumidifier()
        self.assertEqual(self.control_flow.state, 'WaitHumidity')

    def test_transition_from_WaitHumidity_to_CheckHumidity_after_5_minutes(self):
        self.control_flow.WaitHumidity()
        time.sleep(300)
        self.assertEqual(self.control_flow.state, 'CheckHumidity')

    def test_transition_from_StartHeating_to_WaitTemp(self):
        self.control_flow.StartHeating()
        self.assertEqual(self.control_flow.state, 'WaitTemp')

    def test_transition_from_StartCooling_to_WaitTemp(self):
        self.control_flow.StartCooling()
        self.assertEqual(self.control_flow.state, 'WaitTemp')

    def test_transition_from_WaitTemp_to_CheckTemperature_after_5_minutes(self):
        self.control_flow.WaitTemp()
        time.sleep(300)
        self.assertEqual(self.control_flow.state, 'CheckTemperature')

    def test_transition_from_SafetyMonitoring_to_ContinuousMonitor(self):
        self.control_flow.SafetyMonitoring()
        self.assertEqual(self.control_flow.state, 'ContinuousMonitor')

    def test_transition_from_ContinuousMonitor_to_EmergencyShutdown_when_safety_threshold_is_exceeded(self):
        self.control_flow.ContinuousMonitor = lambda: self.control_flow.transition('EmergencyShutdown')
        self.control_flow.SafetyMonitoring()
        self.assertEqual(self.control_flow.state, 'EmergencyShutdown')

    def test_transition_from_ContinuousMonitor_to_EnvironmentCheck_when_all_parameters_are_normal(self):
        self.control_flow.ContinuousMonitor = lambda: self.control_flow.transition('EnvironmentCheck')
        self.control_flow.SafetyMonitoring()
        self.assertEqual(self.control_flow.state, 'EnvironmentCheck')

    def test_read_data_from_BME280_sensor(self):
        data = self.control_flow.bme280.read_sensor_data()
        self.assertIn('temperature', data)
        self.assertIn('humidity', data)

    def test_read_data_from_MHZ19B_sensor(self):
        data = self.control_flow.mhz19b.read_co2()
        self.assertIn('co2', data)

    def test_read_data_from_water_detection_sensor(self):
        water_detected = self.control_flow.water_sensor.value()
        self.assertEqual(water_detected, 0)

    def test_control_fan_relay(self):
        self.control_flow.relay_fan.value(1)
        self.assertEqual(self.control_flow.relay_fan.value(), 1)
        self.control_flow.relay_fan.value(0)
        self.assertEqual(self.control_flow.relay_fan.value(), 0)

    def test_control_humidifier_relay(self):
        self.control_flow.relay_hum.value(1)
        self.assertEqual(self.control_flow.relay_hum.value(), 1)
        self.control_flow.relay_hum.value(0)
        self.assertEqual(self.control_flow.relay_hum.value(), 0)

    def test_control_heater_relay(self):
        self.control_flow.relay_heat.value(1)
        self.assertEqual(self.control_flow.relay_heat.value(), 1)
        self.control_flow.relay_heat.value(0)
        self.assertEqual(self.control_flow.relay_heat.value(), 0)

if __name__ == '__main__':
    unittest.main()
