@echo off
REM WhatsApp Assistant Backend Startup Script for Windows

echo Starting WhatsApp Assistant Backend...
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Virtual environment not found. Creating one...
    python -m venv venv
    echo Virtual environment created.
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Check if .env file exists
if not exist ".env" (
    echo.
    echo ERROR: .env file not found!
    echo Please create a .env file with your ANTHROPIC_API_KEY
    echo You can copy .env.example and add your API key:
    echo   copy .env.example .env
    echo   # Then edit .env and add your API key
    echo.
    exit /b 1
)

REM Install/update dependencies
echo Checking dependencies...
pip install -q -r requirements.txt

REM Start the server
echo.
echo Starting FastAPI server on http://0.0.0.0:8000
echo Press Ctrl+C to stop
echo.
python main.py
