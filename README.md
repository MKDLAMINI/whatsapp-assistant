# WhatsApp AI Assistant

An AI-powered mobile application that helps you craft perfect WhatsApp replies by understanding context and desired outcomes. Built with React Native and powered by Claude AI.

## Features

- **Context-Aware Suggestions**: Specify your relationship with the recipient (colleague, boss, client, friend, partner, family)
- **Outcome-Driven**: Define what you want to achieve with your response
- **Multiple Options**: Get 3 different suggestions with varying tones (professional, casual, friendly)
- **Review Before Sending**: You have final approval on all messages (important for liability)
- **Easy Copy-Paste**: Simple workflow - paste received message, get suggestions, copy to WhatsApp
- **AI Explanations**: Understand why each suggestion works with brief reasoning

## Architecture

- **Backend**: Python + FastAPI + Anthropic Claude API
- **Frontend**: React Native (Expo) for iOS and Android
- **Integration**: Manual copy-paste workflow (compliant with WhatsApp ToS)

## Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher
- npm or yarn
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- For mobile development:
  - iOS: macOS with Xcode
  - Android: Android Studio and Android SDK
  - Or use Expo Go app for quick testing

## Setup Instructions

### 1. Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=your_actual_api_key_here
```

### 2. Get Your Anthropic API Key

1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it in `backend/.env`

### 3. Start the Backend Server

```bash
cd backend
python main.py
```

The backend will start on `http://localhost:8000`

You can verify it's running by visiting:
- `http://localhost:8000` - should show a welcome message
- `http://localhost:8000/health` - should return `{"status": "healthy"}`

### 4. Configure Mobile App

```bash
cd mobile

# Find your computer's local IP address
# On macOS/Linux:
ifconfig | grep "inet "
# On Windows:
ipconfig

# Edit App.js and update the API_BASE_URL
# Change: const API_BASE_URL = 'http://YOUR_COMPUTER_IP:8000';
# To: const API_BASE_URL = 'http://192.168.1.XXX:8000';
# (replace with your actual IP address)
```

**Important**: Don't use `localhost` or `127.0.0.1` in the mobile app - use your computer's actual IP address on your local network.

### 5. Install Mobile Dependencies

```bash
cd mobile
npm install
```

### 6. Run the Mobile App

```bash
# Start Expo development server
npm start

# Then choose your platform:
# - Press 'a' for Android emulator
# - Press 'i' for iOS simulator
# - Scan QR code with Expo Go app on your physical device
```

## Usage Guide

### How to Use the App

1. **Copy Message from WhatsApp**
   - Open WhatsApp
   - Long-press on the message you received
   - Tap "Copy"

2. **Paste in WhatsApp Assistant**
   - Open the WhatsApp Assistant app
   - Tap the "Paste" button or paste directly into the text field

3. **Select Context**
   - Choose your relationship with the sender (colleague, boss, client, etc.)
   - Select your desired outcome (schedule meeting, decline politely, etc.)

4. **Generate Suggestions**
   - Tap "Generate Suggestions"
   - Wait for AI to generate 3 different options

5. **Review and Choose**
   - Read all 3 suggestions
   - Check the tone badge (professional/casual/friendly)
   - Read the reasoning to understand why each suggestion fits

6. **Copy and Send**
   - Tap "Copy" on your preferred suggestion
   - Go back to WhatsApp
   - Paste and send (you can still edit before sending!)

## Project Structure

```
WhatsApp_Assistant/
├── backend/
│   ├── main.py              # FastAPI server with Claude integration
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Environment variables template
│   └── .gitignore
│
├── mobile/
│   ├── App.js               # Main React Native app
│   ├── package.json         # Node dependencies
│   ├── app.json             # Expo configuration
│   ├── babel.config.js      # Babel configuration
│   └── .gitignore
│
└── README.md
```

## API Endpoints

### POST `/api/suggest-messages`

Generate message suggestions based on context.

**Request Body:**
```json
{
  "received_message": "Hey, can we meet tomorrow?",
  "relationship_type": "colleague",
  "desired_outcome": "schedule a meeting"
}
```

**Response:**
```json
{
  "suggestions": [
    {
      "text": "Sure! What time works best for you?",
      "tone": "professional",
      "reasoning": "Direct and friendly, facilitates scheduling"
    },
    {
      "text": "Absolutely! I'm free after 2pm. Does that work?",
      "tone": "casual",
      "reasoning": "Shows availability while being approachable"
    },
    {
      "text": "I'd be happy to meet. Let me check my calendar and get back to you shortly.",
      "tone": "formal",
      "reasoning": "Professional and organized approach"
    }
  ]
}
```

## Customization

### Adding More Relationship Types

Edit `mobile/App.js` and add to the `relationshipTypes` array:

```javascript
const relationshipTypes = [
  // ... existing types
  { label: 'Mentor', value: 'mentor' },
  { label: 'Student', value: 'student' },
];
```

### Adding More Desired Outcomes

Edit `mobile/App.js` and add to the `desiredOutcomes` array:

```javascript
const desiredOutcomes = [
  // ... existing outcomes
  { label: 'Negotiate terms', value: 'negotiate terms' },
  { label: 'Provide feedback', value: 'provide feedback' },
];
```

### Changing AI Model

Edit `backend/main.py` and change the model in the `client.messages.create()` call:

```python
message = client.messages.create(
    model="claude-sonnet-4-20250514",  # Change this
    # ...
)
```

Available models:
- `claude-sonnet-4-20250514` - Best balance of speed and quality (recommended)
- `claude-opus-4-5-20251101` - Highest quality, slower and more expensive
- `claude-3-5-haiku-20241022` - Fastest and cheapest, good quality

## Security & Liability

**Important Notes:**

1. **User Approval Required**: The app is designed so users MUST review and approve messages before sending. This is crucial for liability purposes.

2. **API Key Security**: Never commit your `.env` file or share your Anthropic API key publicly.

3. **Data Privacy**: Messages are sent to Anthropic's API for processing. Do not use this app for highly sensitive or confidential communications.

4. **WhatsApp Compliance**: This app uses manual copy-paste, which is compliant with WhatsApp's Terms of Service. Automated integration may violate their policies.

## Troubleshooting

### Backend won't start
- Make sure you activated the virtual environment
- Check that all dependencies are installed: `pip install -r requirements.txt`
- Verify your API key is correctly set in `.env`

### Mobile app can't connect to backend
- Make sure backend is running
- Check that you're using your computer's IP address, not `localhost`
- Ensure your phone/emulator is on the same network as your computer
- Check if a firewall is blocking port 8000

### "Failed to generate suggestions" error
- Check backend logs for errors
- Verify your Anthropic API key is valid
- Ensure you have API credits available

### Expo app won't load
- Clear the cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Update Expo CLI: `npm install -g expo-cli`

## Development

### Running Backend Tests

```bash
cd backend
python -m pytest  # (after adding tests)
```

### Building for Production

**Backend:**
```bash
# Use a production WSGI server
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

**Mobile:**
```bash
cd mobile
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

## Cost Estimates

Anthropic Claude API pricing (as of 2025):
- Input: ~$3 per million tokens
- Output: ~$15 per million tokens

Estimated cost per message suggestion: ~$0.001 - $0.005 (less than a penny)

## License

This project is provided as-is for educational and personal use.

## Contributing

Feel free to fork this project and customize it for your needs. Some ideas for enhancements:

- Add message history/favorites
- Support for multiple languages
- Voice input for received messages
- Custom tone preferences
- Integration with other messaging platforms

## Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the Anthropic API documentation
3. Check React Native/Expo documentation

## Disclaimer

This tool provides AI-generated suggestions. Users are solely responsible for reviewing and approving all messages before sending. The creators assume no liability for any communications sent using suggestions from this application.

---

Built with Claude AI | Always review messages before sending
