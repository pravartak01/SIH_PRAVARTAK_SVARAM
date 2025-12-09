// Audio file mapping for Karaoke Shlokas
// Maps shloka IDs to their corresponding audio files in the ShlokaAudios folder

export interface AudioMapping {
  shlokaId: string;
  audioFileName: string;
  displayName: string;
}

// Audio assets loaded via require() for local files
// This ensures audio files are bundled with the app
// NOTE: First, copy ShlokaAudios to Mobile-App/assets/audio/ or create a junction:
// PowerShell: Copy-Item -Path ".\ShlokaAudios" -Destination ".\Mobile-App\assets\audio" -Recurse
// OR (as Admin): New-Item -ItemType Junction -Path ".\Mobile-App\assets\audio" -Target ".\ShlokaAudios"
const AUDIO_ASSETS: Record<string, any> = {
  'gayaytri mantra.mp3': require('../assets/audio/gayaytri mantra.mp3'),
  'mahamrityunjay_mantra.mp3': require('../assets/audio/mahamrityunjay_mantra.mp3'),
  'shanti mantra.mp3': require('../assets/audio/shanti mantra.mp3'),
  'vakratunda.mp3': require('../assets/audio/vakratunda.mp3'),
  'astoma.mp3': require('../assets/audio/astoma.mp3'),
  'Saraswati vandana.mp3': require('../assets/audio/Saraswati vandana.mp3'),
  'om namah shivaya.mp3': require('../assets/audio/om namah shivaya.mp3'),
  'Guru bramha.mp3': require('../assets/audio/Guru bramha.mp3'),
  'hare krishna.mp3': require('../assets/audio/hare krishna.mp3'),
  'hanuman chalisa.mp3': require('../assets/audio/hanuman chalisa.mp3'),
  'Mahalaxmi .mp3': require('../assets/audio/Mahalaxmi .mp3'),
  'durga mantra.mp3': require('../assets/audio/durga mantra.mp3'),
  'vishnu mantra.mp3': require('../assets/audio/vishnu mantra.mp3'),
  'vishnu shanti mantra.mp3': require('../assets/audio/vishnu shanti mantra.mp3'),
  'Ya devi.mp3': require('../assets/audio/Ya devi.mp3'),
  'Aum mantra.mp3': require('../assets/audio/Aum mantra.mp3'),
  'vishnu shloka.mp3': require('../assets/audio/vishnu shloka.mp3'),
  'dhanvantri mantra.mp3': require('../assets/audio/dhanvantri mantra.mp3'),
  'om namo narayanay.mp3': require('../assets/audio/om namo narayanay.mp3'),
  'loka samastha.mp3': require('../assets/audio/loka samastha.mp3'),
  'medha suktam.mp3': require('../assets/audio/medha suktam.mp3'),
  'ganesh mantra.mp3': require('../assets/audio/ganesh mantra.mp3'),
};

// Map shloka IDs to audio file names
export const SHLOKA_AUDIO_MAP: Record<string, string> = {
  'gayatri-mantra': 'gayaytri mantra.mp3',
  'mahamrityunjaya-mantra': 'mahamrityunjay_mantra.mp3',
  'shanti-mantra': 'shanti mantra.mp3',
  'vakratunda-shloka': 'vakratunda.mp3',
  'asato-ma-mantra': 'astoma.mp3',
  'saraswati-vandana': 'Saraswati vandana.mp3',
  'om-namah-shivaya': 'om namah shivaya.mp3',
  'guru-brahma': 'Guru bramha.mp3',
  'hare-krishna-mantra': 'hare krishna.mp3',
  'hanuman-chalisa-opening': 'hanuman chalisa.mp3',
  'lakshmi-mantra': 'Mahalaxmi .mp3',
  'durga-mantra': 'durga mantra.mp3',
  'vishnu-mantra': 'vishnu mantra.mp3',
  'ya-devi-mantra': 'Ya devi.mp3',
  'surya-mantra': 'gayaytri mantra.mp3', // Using gayatri as related
  'aum-mantra': 'Aum mantra.mp3',
};

// Get audio file name for a shloka
export const getAudioForShloka = (shlokaId: string): string | null => {
  return SHLOKA_AUDIO_MAP[shlokaId] || null;
};

// Get audio asset (require object) for a shloka - USE THIS for Audio.Sound.createAsync
export const getAudioAsset = (shlokaId: string): any => {
  const fileName = SHLOKA_AUDIO_MAP[shlokaId];
  if (!fileName) return null;
  return AUDIO_ASSETS[fileName] || null;
};

// Get audio asset from filename directly (for healing shlokas) - USE THIS for Audio.Sound.createAsync
export const getAudioAssetFromFilename = (audioFile: string): any => {
  // Remove any path prefix like ../../ShlokaAudios/
  const fileName = audioFile.replace(/^.*[\/\\]/, '');
  return AUDIO_ASSETS[fileName] || null;
};

// Legacy function - kept for backward compatibility but returns asset instead of URL
export const getAudioUrl = (shlokaId: string): any => {
  return getAudioAsset(shlokaId);
};

// Legacy function - kept for backward compatibility but returns asset instead of URL
export const getAudioUrlFromFilename = (audioFile: string): any => {
  return getAudioAssetFromFilename(audioFile);
};

// Check if audio is available for a shloka
export const hasAudio = (shlokaId: string): boolean => {
  return shlokaId in SHLOKA_AUDIO_MAP && !!AUDIO_ASSETS[SHLOKA_AUDIO_MAP[shlokaId]];
};

// All available audio files for reference
export const AVAILABLE_AUDIO_FILES = [
  'Annapurna shloka.mp3',
  'astoma.mp3',
  'Aum mantra.mp3',
  'dhanvantri mantra.mp3',
  'durga mantra.mp3',
  'ganesh mantra.mp3',
  'gayaytri mantra.mp3',
  'Guru bramha.mp3',
  'hanuman chalisa.mp3',
  'hare krishna.mp3',
  'karache charan.mp3',
  'loka samastha.mp3',
  'Mahalaxmi .mp3',
  'mahamrityunjay mantra.mp3',
  'medha suktam.mp3',
  'Narsimha Shanti path.mp3',
  'nirvana shaktam.mp3',
  'om namah shivaya.mp3',
  'om namo narayanay.mp3',
  'Saraswati vandana.mp3',
  'shanti mantra.mp3',
  'vakratunda.mp3',
  'vishnu mantra.mp3',
  'vishnu shanti mantra.mp3',
  'vishnu shloka.mp3',
  'Ya devi.mp3',
];
