# Voice Recording & Audio Upload Features 🎤🎵

## New Features Added

### 1. **Functional Voice Recording** 🎙️
- **Live Recording**: Tap the microphone button to start recording your Sanskrit shloka
- **Visual Feedback**: Button changes to orange with "Stop" text while recording
- **High-Quality Audio**: Records at 44.1kHz sample rate with AAC encoding
- **Automatic Transcription**: Recorded audio is automatically transcribed to Sanskrit text

### 2. **Audio File Upload** 📁
- **Upload Audio Files**: Tap the cloud upload button to select audio files from your device
- **Multiple Formats**: Supports MP3, M4A, WAV, and other audio formats
- **Automatic Transcription**: Uploaded files are automatically transcribed to text

## How to Use

### Voice Recording
1. Tap the **microphone icon** 🎤
2. Grant microphone permission if prompted
3. Speak your Sanskrit shloka clearly
4. Tap the **"Stop"** button when finished
5. Wait for automatic transcription
6. The transcribed text will appear in the input box
7. Tap **"Analyze Chandas"** to proceed

### Audio File Upload
1. Tap the **cloud upload icon** ☁️
2. Select an audio file from your device
3. Wait for automatic transcription
4. The transcribed text will appear in the input box
5. Tap **"Analyze Chandas"** to proceed

## Installation Requirements

### Required Packages
Install the following packages in your Mobile App:

```bash
# Navigate to Mobile-App directory
cd Mobile-App

# Install document picker for file selection
npx expo install expo-document-picker

# Install file system for reading audio files
npx expo install expo-file-system
```

### Backend Requirements
The speech-to-text feature requires a backend API endpoint:

**Endpoint**: `POST /speech/transcribe`

**Request Body**:
```json
{
  "audio_data": "base64_encoded_audio_string",
  "language": "sa",
  "format": "m4a"
}
```

**Response**:
```json
{
  "text": "transcribed Sanskrit text",
  "confidence": 0.95
}
```

### Backend Implementation Options

#### Option 1: Google Cloud Speech-to-Text
```python
from google.cloud import speech

def transcribe_audio(audio_data: str, language: str = "sa-IN"):
    client = speech.SpeechClient()
    
    audio = speech.RecognitionAudio(content=base64.b64decode(audio_data))
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.MP3,
        sample_rate_hertz=44100,
        language_code=language,
    )
    
    response = client.recognize(config=config, audio=audio)
    
    for result in response.results:
        return {"text": result.alternatives[0].transcript}
    
    return {"text": ""}
```

#### Option 2: OpenAI Whisper
```python
import openai
import base64
import tempfile

def transcribe_audio(audio_data: str, language: str = "sa"):
    # Decode base64 audio
    audio_bytes = base64.b64decode(audio_data)
    
    # Save to temp file
    with tempfile.NamedTemporaryFile(suffix=".m4a", delete=False) as temp_audio:
        temp_audio.write(audio_bytes)
        temp_path = temp_audio.name
    
    # Transcribe with Whisper
    with open(temp_path, "rb") as audio_file:
        transcript = openai.Audio.transcribe(
            model="whisper-1",
            file=audio_file,
            language=language
        )
    
    return {"text": transcript["text"]}
```

## Testing

1. **Test Voice Recording**:
   - Open the Shloka Analysis Modal
   - Tap microphone button
   - Recite: "ॐ भूर्भुवः स्वः"
   - Check if text appears after transcription

2. **Test Audio Upload**:
   - Prepare an audio file with Sanskrit content
   - Tap upload button
   - Select the audio file
   - Check if text appears after transcription

## Troubleshooting

### Recording Not Working
- Ensure microphone permissions are granted
- Check if device has a working microphone
- Try restarting the app

### Upload Button Not Responding
- Ensure packages are installed: `expo-document-picker`, `expo-file-system`
- Check file permissions on device
- Try selecting different audio formats

### Transcription Fails
- Ensure backend API is running
- Check network connectivity
- Verify audio quality (clear speech, minimal background noise)
- Ensure backend has speech-to-text service configured

### No Text Appears
- Check backend logs for errors
- Verify audio encoding format matches backend expectations
- Test with simpler/shorter audio clips first

## Benefits

✅ **Hands-Free Input**: Speak shlokas instead of typing Sanskrit text  
✅ **Audio File Support**: Analyze pre-recorded shlokas  
✅ **High Accuracy**: Professional-grade audio recording (44.1kHz AAC)  
✅ **User-Friendly**: Clear visual feedback during recording  
✅ **Multiple Sources**: Voice recording OR file upload  

## Future Enhancements

- [ ] Offline transcription using local ML models
- [ ] Real-time transcription during recording
- [ ] Support for multiple Indian languages
- [ ] Audio playback before transcription
- [ ] Batch processing of multiple audio files
- [ ] Voice commands for app navigation

## Notes

- Sanskrit speech recognition accuracy depends on:
  - Clear pronunciation
  - Minimal background noise
  - Quality microphone
  - Backend ML model training

- For best results:
  - Speak slowly and clearly
  - Record in quiet environment
  - Use proper Sanskrit pronunciation
  - Keep recordings under 30 seconds
