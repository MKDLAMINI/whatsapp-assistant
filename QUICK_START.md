# Quick Start Guide

Get up and running in 5 minutes!

## Step 1: Get Your API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)

2. Sign up or log in
3. Create an API key
4. Copy it (you'll need it in Step 3)

## Step 2: Set Up Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env and paste your API key
```

## Step 3: Start Backend

**Option A: Using the startup script (easier)**

```bash
# macOS/Linux
./start.sh

# Windows
start.bat
```

**Option B: Manual start**

```bash
python main.py
```

The backend should now be running on http://localhost:8000

## Step 4: Set Up Mobile App

```bash
cd mobile

# Install dependencies
npm install
```

## Step 5: Configure API URL

1. Find your computer's IP address:

   ```bash
   # macOS/Linux
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```

2. Edit `mobile/App.js`:
   - Find: `const API_BASE_URL = 'http://YOUR_COMPUTER_IP:8000';`
   - Replace `YOUR_COMPUTER_IP` with your actual IP (e.g., `192.168.1.100`)

## Step 6: Run Mobile App

```bash
npm start

# Then:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app on your phone
```

## Step 7: Test It Out!

1. Copy a message from WhatsApp
2. Paste it in the app
3. Select relationship type (e.g., "Friend")
4. Select desired outcome (e.g., "Show enthusiasm")
5. Tap "Generate Suggestions"
6. Review the 3 AI-generated options
7. Copy your favorite and paste back in WhatsApp

## Troubleshooting

**Backend won't start?**

- Check that you activated the virtual environment
- Verify your API key in `.env` file

**Mobile app can't connect?**

- Make sure backend is running
- Use your computer's IP, not `localhost`
- Check that phone/emulator is on same WiFi network

**Still stuck?**

- See the full README.md for detailed troubleshooting
- Check that port 8000 isn't blocked by firewall

## What You Built

- ✅ Python FastAPI backend with Claude AI
- ✅ React Native mobile app with Expo
- ✅ Context-aware message suggestions
- ✅ User review and approval workflow
- ✅ Copy-to-clipboard functionality

Enjoy your new WhatsApp assistant!
