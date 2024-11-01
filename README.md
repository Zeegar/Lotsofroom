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

## Pico Control System

The Pico control system is an integral part of the Lotsofroom project. It is responsible for interfacing with various sensors and controlling relays to maintain the optimal environment for mushroom cultivation.

### Components

- **Raspberry Pi Pico**: The main controller that interfaces with sensors and relays.
- **BME280**: Sensor for measuring temperature and humidity.
- **MH-Z19B**: CO2 sensor for monitoring air quality.
- **Water Detection Sensor**: Sensor for detecting water presence.
- **Relay Module**: Controls the fan, humidifier, and heater.

### Diagram

The Pico control system diagram is defined in `pico-control-system.mermaid`.

## Deployment

To deploy the code to the Raspberry Pi Pico, follow these steps:

1. Ensure you have the necessary dependencies installed. You can install them using the following commands:
   ```bash
   sudo apt-get update
   sudo apt-get install -y python3-pip
   pip3 install --upgrade adafruit-ampy
   ```

2. Run the deployment script to upload the code to the Raspberry Pi Pico:
   ```bash
   ./deploy.sh
   ```

The deployment script will upload the code to the Raspberry Pi Pico and configure the Pico to interface with the connected sensors and relays.
