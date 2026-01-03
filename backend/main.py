from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv
from anthropic import Anthropic
from anthropic.types import TextBlock

load_dotenv()

app = FastAPI(title="WhatsApp AI Assistant API")

# Configure CORS for React Native app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your mobile app's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Anthropic client
anthropic_api_key = os.getenv("ANTHROPIC_API_KEY")
if not anthropic_api_key:
    raise ValueError("ANTHROPIC_API_KEY environment variable is required")

client = Anthropic(api_key=anthropic_api_key)


class MessageRequest(BaseModel):
    received_message: str
    relationship_type: str  # e.g., "colleague", "partner", "friend", "boss", "client"
    desired_outcome: str  # e.g., "schedule a meeting", "decline politely", "show enthusiasm"


class MessageSuggestion(BaseModel):
    text: str
    tone: str  # e.g., "professional", "casual", "friendly"
    reasoning: str  # Brief explanation of why this suggestion fits


class MessageResponse(BaseModel):
    suggestions: List[MessageSuggestion]


@app.get("/")
def read_root():
    return {"message": "WhatsApp AI Assistant API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/api/suggest-messages", response_model=MessageResponse)
async def suggest_messages(request: MessageRequest):
    """
    Generate AI-powered message suggestions based on the received message,
    relationship context, and desired outcome.
    """
    try:
        # Construct the prompt for Claude
        prompt = f"""You are a helpful assistant that suggests appropriate WhatsApp reply messages.

Received message: "{request.received_message}"

Context:
- Relationship with recipient: {request.relationship_type}
- Desired outcome: {request.desired_outcome}

Generate 3 different message suggestions that:
1. Are appropriate for the relationship type
2. Help achieve the desired outcome
3. Vary in tone (e.g., one more formal, one casual, one friendly)
4. Are natural and conversational
5. Are brief and suitable for WhatsApp (keep each suggestion to 1-3 sentences)

For each suggestion, provide:
- The message text
- The tone (one word: professional/casual/friendly/warm/direct)
- Brief reasoning (one sentence explaining why this works)

Format your response as a JSON array with this structure:
[
  {{
    "text": "the suggested message",
    "tone": "professional",
    "reasoning": "why this suggestion fits"
  }},
  ...
]

Return ONLY the JSON array, no other text."""

        # Call Claude API
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Parse the response
        # Get the first content block (which should be a TextBlock)
        content_block = message.content[0]
        if isinstance(content_block, TextBlock):
            response_text = content_block.text.strip()
        else:
            raise HTTPException(
                status_code=500,
                detail="Unexpected response type from AI"
            )

        # Remove markdown code blocks if present
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        response_text = response_text.strip()

        # Parse JSON
        import json
        suggestions_data = json.loads(response_text)

        # Convert to MessageSuggestion objects
        suggestions = [
            MessageSuggestion(
                text=s["text"],
                tone=s["tone"],
                reasoning=s["reasoning"]
            )
            for s in suggestions_data
        ]

        return MessageResponse(suggestions=suggestions)

    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse AI response: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating suggestions: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
