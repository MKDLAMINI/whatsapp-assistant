#!/bin/bash

# WhatsApp Assistant Backend Startup Script

echo "Starting WhatsApp Assistant Backend..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv
    echo "Virtual environment created."
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo ""
    echo "ERROR: .env file not found!"
    echo "Please create a .env file with your ANTHROPIC_API_KEY"
    echo "You can copy .env.example and add your API key:"
    echo "  cp .env.example .env"
    echo "  # Then edit .env and add your API key"
    echo ""
    exit 1
fi

# Install/update dependencies
echo "Checking dependencies..."
pip install -q -r requirements.txt

# Start the server
echo ""
echo "Starting FastAPI server on http://0.0.0.0:8000"
echo "Press Ctrl+C to stop"
echo ""
python main.py
