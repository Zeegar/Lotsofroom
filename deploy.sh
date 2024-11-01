#!/bin/bash

# Deployment script for Raspberry Pi Pico

# Step 1: Install necessary dependencies
echo "Installing necessary dependencies..."
sudo apt-get update
sudo apt-get install -y python3-pip
pip3 install --upgrade adafruit-ampy

# Step 2: Upload the code to the Raspberry Pi Pico
echo "Uploading the code to the Raspberry Pi Pico..."
# Replace /dev/ttyACM0 with the correct port if necessary
ampy --port /dev/ttyACM0 put src/main.py
ampy --port /dev/ttyACM0 put src/controlFlow.py

# Step 3: Configure the Pico to interface with sensors and relays
echo "Configuring the Pico to interface with sensors and relays..."
# Add any specific configuration steps if required

echo "Deployment completed successfully."
