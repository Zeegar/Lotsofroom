# Lotsofroom
Lotsofroom is a mushroom cultivation tool that provides an ideal environment for growing your favourite fungus

## Control Flow Implementation

The control flow of the system is implemented based on the state diagram defined in `mushroom-control-flow.mermaid`. The control flow includes the following states:

- **SystemStartup**: Initial state where the system starts up.
- **SafetyCheck**: State where the system performs a safety check, including checking sensors and power systems.
  - **CheckSensors**: Sub-state where sensors are checked.
  - **SensorsFailed**: Sub-state triggered if any sensor fails, leading to an emergency shutdown.
  - **InitialState**: Sub-state indicating all sensors are OK.
- **EnvironmentCheck**: State where the system checks the environment, including CO2 levels, humidity, and temperature.
  - **MonitorCO2**: Sub-state where CO2 levels are monitored.
  - **FAECheck**: Sub-state where Fresh Air Exchange (FAE) is checked.
  - **StartFAE**: Sub-state where FAE is started if CO2 levels are high.
  - **StopFAE**: Sub-state where FAE is stopped if CO2 levels are low.
  - **HumidityControl**: Sub-state where humidity is controlled.
  - **TempControl**: Sub-state where temperature is controlled.
- **SafetyMonitoring**: State where the system continuously monitors safety parameters.
  - **ContinuousMonitor**: Sub-state where continuous monitoring occurs.
  - **EmergencyShutdown**: Sub-state triggered if any safety threshold is exceeded.
- **EmergencyShutdown**: State where the system performs an emergency shutdown.
  - **StopAllSystems**: Sub-state where all systems are stopped.
  - **TriggerAlarm**: Sub-state where an alarm is triggered.
  - **RequireManualReset**: Sub-state indicating manual reset is required.

The control flow is integrated into the codebase and ensures the system operates safely and efficiently.
