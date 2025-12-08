// Shloka Data for Karaoke Practice
// All audio files should be placed in assets/audio/shlokas/ folder

export interface ShlokaWord {
  id: string;
  text: string;
  transliteration: string;
  startTime: number; // in milliseconds
  endTime: number;
}

export interface ShlokaLine {
  id: string;
  text: string;
  transliteration: string;
  translation: string;
  startTime: number;
  endTime: number;
  words: ShlokaWord[];
}

export interface ShlokaData {
  id: string;
  title: string;
  subtitle: string;
  source: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // in seconds
  audioFile: any; // require() for local audio
  thumbnailColor: string;
  description: string;
  meaning: string;
  lines: ShlokaLine[];
  tags: string[];
  practiceCount: number;
  rating: number;
}

// Gayatri Mantra - Most popular Vedic mantra
export const GAYATRI_MANTRA: ShlokaData = {
  
  "id": "gayatri-mantra",
  "title": "Gayatri Mantra",
  "subtitle": "गायत्री मंत्र",
  "source": "Rigveda 3.62.10",
  "category": "Vedic Mantras",
  "difficulty": "beginner",
  "duration": 45,
  "audioFile": null,
  "thumbnailColor": "#FF6B35",
  "description": "The Gayatri Mantra is a highly revered mantra from the Vedas, dedicated to Savitr, the Sun deity.",
  "meaning": "We meditate on the glory of the Creator who has created the Universe, who is worthy of worship, who is the embodiment of Knowledge and Light, who is the remover of all ignorance. May He enlighten our intellect.",
  "lines": [
    {
      "id": "line-1",
      "text": "ॐ भूर्भुवः स्वः",
      "transliteration": "Om Bhur Bhuvah Svah",
      "translation": "Om, Earth, Atmosphere, Heaven",
      "startTime": 0,
      "endTime": 5850,
      "words": [
        { "id": "w1", "text": "ॐ", "transliteration": "Om", "startTime": 0, "endTime": 585 },
        { "id": "w2", "text": "भूर्", "transliteration": "Bhur", "startTime": 585, "endTime": 1150 },
        { "id": "w3", "text": "भुवः", "transliteration": "Bhuvah", "startTime": 1150, "endTime": 2900 },
        { "id": "w4", "text": "स्वः", "transliteration": "Svah", "startTime": 2900, "endTime": 5850 }
      ]
    },
    {
      "id": "line-2",
      "text": "तत्सवितुर्वरेण्यं",
      "transliteration": "Tat Savitur Varenyam",
      "translation": "That Creator, most adorable",
      "startTime": 5850,
      "endTime": 10330,
      "words": [
        { "id": "w5", "text": "तत्", "transliteration": "Tat", "startTime": 5850, "endTime": 6800 },
        { "id": "w6", "text": "सवितुर्", "transliteration": "Savitur", "startTime": 6800, "endTime": 8200 },
        { "id": "w7", "text": "वरेण्यं", "transliteration": "Varenyam", "startTime": 8200, "endTime": 10330 }
      ]
    },
    {
      "id": "line-3",
      "text": "भर्गो देवस्य धीमहि",
      "transliteration": "Bhargo Devasya Dhimahi",
      "translation": "The divine light, we meditate upon",
      "startTime": 10330,
      "endTime": 15500,
      "words": [
        { "id": "w8", "text": "भर्गो", "transliteration": "Bhargo", "startTime": 10330, "endTime": 11500 },
        { "id": "w9", "text": "देवस्य", "transliteration": "Devasya", "startTime": 11500, "endTime": 13200 },
        { "id": "w10", "text": "धीमहि", "transliteration": "Dhimahi", "startTime": 13200, "endTime": 15500 }
      ]
    },
    {
      "id": "line-4",
      "text": "धियो यो नः प्रचोदयात्",
      "transliteration": "Dhiyo Yo Nah Prachodayat",
      "translation": "May He inspire our intellect",
      "startTime": 15500,
      "endTime": 20700,
      "words": [
        { "id": "w11", "text": "धियो", "transliteration": "Dhiyo", "startTime": 15500, "endTime": 16600 },
        { "id": "w12", "text": "यो", "transliteration": "Yo", "startTime": 16600, "endTime": 17300 },
        { "id": "w13", "text": "नः", "transliteration": "Nah", "startTime": 17300, "endTime": 18000 },
        { "id": "w14", "text": "प्रचोदयात्", "transliteration": "Prachodayat", "startTime": 18000, "endTime": 20700 }
      ]
    }
  ],
  "tags": ["Vedic", "Meditation", "Sun", "Wisdom"],
  "practiceCount": 15420,
  "rating": 4.9


};

// Mahamrityunjaya Mantra
export const MAHAMRITYUNJAYA_MANTRA: ShlokaData = {
  id: 'mahamrityunjaya-mantra',
  title: 'Mahamrityunjaya Mantra',
  subtitle: 'महामृत्युंजय मंत्र',
  source: 'Rigveda 7.59.12',
  category: 'Vedic Mantras',
  difficulty: 'intermediate',
  duration: 50,
  // audioFile: require('../../assets/audio/shlokas/mahamrityunjaya-mantra.mp3'),
  audioFile: null, // TODO: Add audio file
  thumbnailColor: '#6B5CE7',
  description: 'The Mahamrityunjaya Mantra is a verse of the Rigveda addressed to Tryambaka "the three-eyed one", an epithet of Rudra.',
  meaning: 'We worship the three-eyed One who is fragrant and who nourishes all beings. May He liberate us from death for the sake of immortality, just as the cucumber is severed from its bondage to the vine.',
  lines: [
    {
      id: 'line-1',
      text: 'ॐ त्र्यम्बकं यजामहे',
      transliteration: 'Om Tryambakam Yajamahe',
      translation: 'Om, We worship the three-eyed One',
      startTime: 0,
      endTime: 10000,
      words: [
        { id: 'w1', text: 'ॐ', transliteration: 'Om', startTime: 0, endTime: 2500 },
        { id: 'w2', text: 'त्र्यम्बकं', transliteration: 'Tryambakam', startTime: 2500, endTime: 6000 },
        { id: 'w3', text: 'यजामहे', transliteration: 'Yajamahe', startTime: 6000, endTime: 10000 },
      ],
    },
    {
      id: 'line-2',
      text: 'सुगन्धिं पुष्टिवर्धनम्',
      transliteration: 'Sugandhim Pushtivardhanam',
      translation: 'Who is fragrant and nourishes all',
      startTime: 10000,
      endTime: 18000,
      words: [
        { id: 'w4', text: 'सुगन्धिं', transliteration: 'Sugandhim', startTime: 10000, endTime: 14000 },
        { id: 'w5', text: 'पुष्टिवर्धनम्', transliteration: 'Pushtivardhanam', startTime: 14000, endTime: 18000 },
      ],
    },
    {
      id: 'line-3',
      text: 'उर्वारुकमिव बन्धनात्',
      transliteration: 'Urvarukamiva Bandhanat',
      translation: 'Like a cucumber from its bondage',
      startTime: 18000,
      endTime: 26000,
      words: [
        { id: 'w6', text: 'उर्वारुकमिव', transliteration: 'Urvarukamiva', startTime: 18000, endTime: 22000 },
        { id: 'w7', text: 'बन्धनात्', transliteration: 'Bandhanat', startTime: 22000, endTime: 26000 },
      ],
    },
    {
      id: 'line-4',
      text: 'मृत्योर्मुक्षीय मामृतात्',
      transliteration: 'Mrityor Mukshiya Maamritat',
      translation: 'Liberate us from death for immortality',
      startTime: 26000,
      endTime: 34000,
      words: [
        { id: 'w8', text: 'मृत्योर्', transliteration: 'Mrityor', startTime: 26000, endTime: 28500 },
        { id: 'w9', text: 'मुक्षीय', transliteration: 'Mukshiya', startTime: 28500, endTime: 31000 },
        { id: 'w10', text: 'मामृतात्', transliteration: 'Maamritat', startTime: 31000, endTime: 34000 },
      ],
    },
  ],
  tags: ['Vedic', 'Healing', 'Protection', 'Shiva'],
  practiceCount: 12350,
  rating: 4.8,
};

// Shanti Mantra
export const SHANTI_MANTRA: ShlokaData = {
  id: 'shanti-mantra',
  title: 'Shanti Mantra',
  subtitle: 'शान्ति मंत्र',
  source: 'Brihadaranyaka Upanishad',
  category: 'Upanishadic',
  difficulty: 'beginner',
  duration: 35,
  // audioFile: require('../../assets/audio/shlokas/shanti-mantra.mp3'),
  audioFile: null, // TODO: Add audio file
  thumbnailColor: '#00BFA5',
  description: 'The Shanti Mantra is a prayer for peace recited at the beginning and end of religious rituals and discourses.',
  meaning: 'Om, May all be happy. May all be free from illness. May all see what is auspicious. May no one suffer. Om Peace, Peace, Peace.',
  lines: [
    {
      id: 'line-1',
      text: 'ॐ सर्वे भवन्तु सुखिनः',
      transliteration: 'Om Sarve Bhavantu Sukhinah',
      translation: 'Om, May all be happy',
      startTime: 0,
      endTime: 8000,
      words: [
        { id: 'w1', text: 'ॐ', transliteration: 'Om', startTime: 0, endTime: 2000 },
        { id: 'w2', text: 'सर्वे', transliteration: 'Sarve', startTime: 2000, endTime: 4000 },
        { id: 'w3', text: 'भवन्तु', transliteration: 'Bhavantu', startTime: 4000, endTime: 6000 },
        { id: 'w4', text: 'सुखिनः', transliteration: 'Sukhinah', startTime: 6000, endTime: 8000 },
      ],
    },
    {
      id: 'line-2',
      text: 'सर्वे सन्तु निरामयाः',
      transliteration: 'Sarve Santu Niramayah',
      translation: 'May all be free from illness',
      startTime: 8000,
      endTime: 14000,
      words: [
        { id: 'w5', text: 'सर्वे', transliteration: 'Sarve', startTime: 8000, endTime: 9500 },
        { id: 'w6', text: 'सन्तु', transliteration: 'Santu', startTime: 9500, endTime: 11000 },
        { id: 'w7', text: 'निरामयाः', transliteration: 'Niramayah', startTime: 11000, endTime: 14000 },
      ],
    },
    {
      id: 'line-3',
      text: 'सर्वे भद्राणि पश्यन्तु',
      transliteration: 'Sarve Bhadrani Pashyantu',
      translation: 'May all see what is auspicious',
      startTime: 14000,
      endTime: 20000,
      words: [
        { id: 'w8', text: 'सर्वे', transliteration: 'Sarve', startTime: 14000, endTime: 15500 },
        { id: 'w9', text: 'भद्राणि', transliteration: 'Bhadrani', startTime: 15500, endTime: 17500 },
        { id: 'w10', text: 'पश्यन्तु', transliteration: 'Pashyantu', startTime: 17500, endTime: 20000 },
      ],
    },
    {
      id: 'line-4',
      text: 'मा कश्चिद्दुःखभाग्भवेत्',
      transliteration: 'Ma Kashchid Duhkha Bhag Bhavet',
      translation: 'May no one suffer',
      startTime: 20000,
      endTime: 26000,
      words: [
        { id: 'w11', text: 'मा', transliteration: 'Ma', startTime: 20000, endTime: 21000 },
        { id: 'w12', text: 'कश्चिद्', transliteration: 'Kashchid', startTime: 21000, endTime: 23000 },
        { id: 'w13', text: 'दुःखभाग्भवेत्', transliteration: 'Duhkha Bhag Bhavet', startTime: 23000, endTime: 26000 },
      ],
    },
    {
      id: 'line-5',
      text: 'ॐ शान्तिः शान्तिः शान्तिः',
      transliteration: 'Om Shantih Shantih Shantih',
      translation: 'Om Peace, Peace, Peace',
      startTime: 26000,
      endTime: 35000,
      words: [
        { id: 'w14', text: 'ॐ', transliteration: 'Om', startTime: 26000, endTime: 28000 },
        { id: 'w15', text: 'शान्तिः', transliteration: 'Shantih', startTime: 28000, endTime: 30000 },
        { id: 'w16', text: 'शान्तिः', transliteration: 'Shantih', startTime: 30000, endTime: 32500 },
        { id: 'w17', text: 'शान्तिः', transliteration: 'Shantih', startTime: 32500, endTime: 35000 },
      ],
    },
  ],
  tags: ['Peace', 'Upanishadic', 'Blessing', 'Universal'],
  practiceCount: 9870,
  rating: 4.7,
};

// Vakratunda Mahakaya - Ganesh Shloka
export const VAKRATUNDA_SHLOKA: ShlokaData = {
  id: 'vakratunda-shloka',
  title: 'Vakratunda Mahakaya',
  subtitle: 'वक्रतुण्ड महाकाय',
  source: 'Mudgala Purana',
  category: 'Devotional',
  difficulty: 'beginner',
  duration: 30,
  // audioFile: require('../../assets/audio/shlokas/vakratunda-shloka.mp3'),
  audioFile: null, // TODO: Add audio file
  thumbnailColor: '#FF9800',
  description: 'A popular shloka dedicated to Lord Ganesha, often recited before starting any new venture or worship.',
  meaning: 'O Lord with curved trunk, large body, whose brilliance equals that of a crore suns, please make all my work free of obstacles, always.',
  lines: [
    {
      id: 'line-1',
      text: 'वक्रतुण्ड महाकाय',
      transliteration: 'Vakratunda Mahakaya',
      translation: 'O curved trunk, large bodied one',
      startTime: 0,
      endTime: 7000,
      words: [
        { id: 'w1', text: 'वक्रतुण्ड', transliteration: 'Vakratunda', startTime: 0, endTime: 3500 },
        { id: 'w2', text: 'महाकाय', transliteration: 'Mahakaya', startTime: 3500, endTime: 7000 },
      ],
    },
    {
      id: 'line-2',
      text: 'सूर्यकोटि समप्रभ',
      transliteration: 'Suryakoti Samaprabha',
      translation: 'With brilliance of a crore suns',
      startTime: 7000,
      endTime: 14000,
      words: [
        { id: 'w3', text: 'सूर्यकोटि', transliteration: 'Suryakoti', startTime: 7000, endTime: 10500 },
        { id: 'w4', text: 'समप्रभ', transliteration: 'Samaprabha', startTime: 10500, endTime: 14000 },
      ],
    },
    {
      id: 'line-3',
      text: 'निर्विघ्नं कुरु मे देव',
      transliteration: 'Nirvighnam Kuru Me Deva',
      translation: 'Make my work obstacle-free, O Lord',
      startTime: 14000,
      endTime: 22000,
      words: [
        { id: 'w5', text: 'निर्विघ्नं', transliteration: 'Nirvighnam', startTime: 14000, endTime: 17000 },
        { id: 'w6', text: 'कुरु', transliteration: 'Kuru', startTime: 17000, endTime: 19000 },
        { id: 'w7', text: 'मे', transliteration: 'Me', startTime: 19000, endTime: 20000 },
        { id: 'w8', text: 'देव', transliteration: 'Deva', startTime: 20000, endTime: 22000 },
      ],
    },
    {
      id: 'line-4',
      text: 'सर्वकार्येषु सर्वदा',
      transliteration: 'Sarva Karyeshu Sarvada',
      translation: 'In all tasks, always',
      startTime: 22000,
      endTime: 30000,
      words: [
        { id: 'w9', text: 'सर्वकार्येषु', transliteration: 'Sarva Karyeshu', startTime: 22000, endTime: 26000 },
        { id: 'w10', text: 'सर्वदा', transliteration: 'Sarvada', startTime: 26000, endTime: 30000 },
      ],
    },
  ],
  tags: ['Ganesha', 'Devotional', 'Auspicious', 'Beginning'],
  practiceCount: 18540,
  rating: 4.9,
};

// Asato Ma Sadgamaya
export const ASATO_MA_MANTRA: ShlokaData = {
  id: 'asato-ma-mantra',
  title: 'Asato Ma Sadgamaya',
  subtitle: 'असतो मा सद्गमय',
  source: 'Brihadaranyaka Upanishad 1.3.28',
  category: 'Upanishadic',
  difficulty: 'beginner',
  duration: 40,
  // audioFile: require('../../assets/audio/shlokas/asato-ma-mantra.mp3'),
  audioFile: null, // TODO: Add audio file
  thumbnailColor: '#9C27B0',
  description: 'This ancient prayer from the Upanishads asks for guidance from untruth to truth, from darkness to light, and from death to immortality.',
  meaning: 'Lead me from the unreal to the real, from darkness to light, from death to immortality. Om Peace, Peace, Peace.',
  lines: [
    {
      id: 'line-1',
      text: 'ॐ असतो मा सद्गमय',
      transliteration: 'Om Asato Ma Sadgamaya',
      translation: 'Om, Lead me from unreal to real',
      startTime: 0,
      endTime: 10000,
      words: [
        { id: 'w1', text: 'ॐ', transliteration: 'Om', startTime: 0, endTime: 2000 },
        { id: 'w2', text: 'असतो', transliteration: 'Asato', startTime: 2000, endTime: 4500 },
        { id: 'w3', text: 'मा', transliteration: 'Ma', startTime: 4500, endTime: 6000 },
        { id: 'w4', text: 'सद्गमय', transliteration: 'Sadgamaya', startTime: 6000, endTime: 10000 },
      ],
    },
    {
      id: 'line-2',
      text: 'तमसो मा ज्योतिर्गमय',
      transliteration: 'Tamaso Ma Jyotirgamaya',
      translation: 'Lead me from darkness to light',
      startTime: 10000,
      endTime: 20000,
      words: [
        { id: 'w5', text: 'तमसो', transliteration: 'Tamaso', startTime: 10000, endTime: 13000 },
        { id: 'w6', text: 'मा', transliteration: 'Ma', startTime: 13000, endTime: 14500 },
        { id: 'w7', text: 'ज्योतिर्गमय', transliteration: 'Jyotirgamaya', startTime: 14500, endTime: 20000 },
      ],
    },
    {
      id: 'line-3',
      text: 'मृत्योर्मा अमृतं गमय',
      transliteration: 'Mrityorma Amritam Gamaya',
      translation: 'Lead me from death to immortality',
      startTime: 20000,
      endTime: 30000,
      words: [
        { id: 'w8', text: 'मृत्योर्मा', transliteration: 'Mrityorma', startTime: 20000, endTime: 24000 },
        { id: 'w9', text: 'अमृतं', transliteration: 'Amritam', startTime: 24000, endTime: 27000 },
        { id: 'w10', text: 'गमय', transliteration: 'Gamaya', startTime: 27000, endTime: 30000 },
      ],
    },
    {
      id: 'line-4',
      text: 'ॐ शान्तिः शान्तिः शान्तिः',
      transliteration: 'Om Shantih Shantih Shantih',
      translation: 'Om Peace, Peace, Peace',
      startTime: 30000,
      endTime: 40000,
      words: [
        { id: 'w11', text: 'ॐ', transliteration: 'Om', startTime: 30000, endTime: 32000 },
        { id: 'w12', text: 'शान्तिः', transliteration: 'Shantih', startTime: 32000, endTime: 35000 },
        { id: 'w13', text: 'शान्तिः', transliteration: 'Shantih', startTime: 35000, endTime: 37500 },
        { id: 'w14', text: 'शान्तिः', transliteration: 'Shantih', startTime: 37500, endTime: 40000 },
      ],
    },
  ],
  tags: ['Upanishadic', 'Truth', 'Light', 'Immortality'],
  practiceCount: 11230,
  rating: 4.8,
};

// Saraswati Vandana
export const SARASWATI_VANDANA: ShlokaData = {
  id: 'saraswati-vandana',
  title: 'Saraswati Vandana',
  subtitle: 'सरस्वती वंदना',
  source: 'Traditional',
  category: 'Devotional',
  difficulty: 'intermediate',
  duration: 35,
  // audioFile: require('../../assets/audio/shlokas/saraswati-vandana.mp3'),
  audioFile: null, // TODO: Add audio file
  thumbnailColor: '#2196F3',
  description: 'A prayer to Goddess Saraswati, the deity of knowledge, music, and arts.',
  meaning: 'O Goddess Saraswati, who is fair as the jasmine moon, who is adorned with pure white garments, whose hands are adorned with the divine veena, who is seated on a white lotus, who is always worshipped by Brahma, Vishnu, Shiva and other Gods, protect me. O Goddess, remove my mental dullness.',
  lines: [
    {
      id: 'line-1',
      text: 'या कुन्देन्दुतुषारहारधवला',
      transliteration: 'Ya Kundendu Tushara Hara Dhavala',
      translation: 'She who is white as jasmine and moon',
      startTime: 0,
      endTime: 8000,
      words: [
        { id: 'w1', text: 'या', transliteration: 'Ya', startTime: 0, endTime: 1500 },
        { id: 'w2', text: 'कुन्देन्दु', transliteration: 'Kundendu', startTime: 1500, endTime: 4000 },
        { id: 'w3', text: 'तुषारहारधवला', transliteration: 'Tushara Hara Dhavala', startTime: 4000, endTime: 8000 },
      ],
    },
    {
      id: 'line-2',
      text: 'या शुभ्रवस्त्रावृता',
      transliteration: 'Ya Shubhra Vastra Avrita',
      translation: 'Who is dressed in pure white',
      startTime: 8000,
      endTime: 14000,
      words: [
        { id: 'w4', text: 'या', transliteration: 'Ya', startTime: 8000, endTime: 9000 },
        { id: 'w5', text: 'शुभ्रवस्त्रावृता', transliteration: 'Shubhra Vastra Avrita', startTime: 9000, endTime: 14000 },
      ],
    },
    {
      id: 'line-3',
      text: 'या वीणावरदण्डमण्डितकरा',
      transliteration: 'Ya Veena Vara Danda Mandita Kara',
      translation: 'Whose hands hold the divine veena',
      startTime: 14000,
      endTime: 22000,
      words: [
        { id: 'w6', text: 'या', transliteration: 'Ya', startTime: 14000, endTime: 15000 },
        { id: 'w7', text: 'वीणावरदण्ड', transliteration: 'Veena Vara Danda', startTime: 15000, endTime: 18500 },
        { id: 'w8', text: 'मण्डितकरा', transliteration: 'Mandita Kara', startTime: 18500, endTime: 22000 },
      ],
    },
    {
      id: 'line-4',
      text: 'या श्वेतपद्मासना',
      transliteration: 'Ya Shveta Padma Asana',
      translation: 'Who is seated on white lotus',
      startTime: 22000,
      endTime: 28000,
      words: [
        { id: 'w9', text: 'या', transliteration: 'Ya', startTime: 22000, endTime: 23000 },
        { id: 'w10', text: 'श्वेतपद्मासना', transliteration: 'Shveta Padma Asana', startTime: 23000, endTime: 28000 },
      ],
    },
    {
      id: 'line-5',
      text: 'सा मां पातु सरस्वती',
      transliteration: 'Sa Mam Patu Saraswati',
      translation: 'May Saraswati protect me',
      startTime: 28000,
      endTime: 35000,
      words: [
        { id: 'w11', text: 'सा', transliteration: 'Sa', startTime: 28000, endTime: 29500 },
        { id: 'w12', text: 'मां', transliteration: 'Mam', startTime: 29500, endTime: 31000 },
        { id: 'w13', text: 'पातु', transliteration: 'Patu', startTime: 31000, endTime: 32500 },
        { id: 'w14', text: 'सरस्वती', transliteration: 'Saraswati', startTime: 32500, endTime: 35000 },
      ],
    },
  ],
  tags: ['Saraswati', 'Knowledge', 'Arts', 'Devotional'],
  practiceCount: 8920,
  rating: 4.7,
};

// 7. Om Namah Shivaya - Panchakshari Mantra
export const OM_NAMAH_SHIVAYA: ShlokaData = {
  id: 'om-namah-shivaya',
  title: 'Om Namah Shivaya',
  subtitle: 'ॐ नमः शिवाय',
  source: 'Shri Rudram (Yajurveda)',
  category: 'Devotional',
  difficulty: 'beginner',
  duration: 25,
  audioFile: null,
  thumbnailColor: '#607D8B',
  description: 'The Panchakshari Mantra, one of the most powerful mantras dedicated to Lord Shiva.',
  meaning: 'I bow to Lord Shiva, the auspicious one, the supreme consciousness.',
  lines: [
    {
      id: 'line-1',
      text: 'ॐ नमः शिवाय',
      transliteration: 'Om Namah Shivaya',
      translation: 'I bow to Lord Shiva',
      startTime: 0,
      endTime: 8000,
      words: [
        { id: 'w1', text: 'ॐ', transliteration: 'Om', startTime: 0, endTime: 2500 },
        { id: 'w2', text: 'नमः', transliteration: 'Namah', startTime: 2500, endTime: 5000 },
        { id: 'w3', text: 'शिवाय', transliteration: 'Shivaya', startTime: 5000, endTime: 8000 },
      ],
    },
    {
      id: 'line-2',
      text: 'शिवाय नमः ॐ',
      transliteration: 'Shivaya Namah Om',
      translation: 'To Shiva I bow, Om',
      startTime: 8000,
      endTime: 16000,
      words: [
        { id: 'w4', text: 'शिवाय', transliteration: 'Shivaya', startTime: 8000, endTime: 11000 },
        { id: 'w5', text: 'नमः', transliteration: 'Namah', startTime: 11000, endTime: 13500 },
        { id: 'w6', text: 'ॐ', transliteration: 'Om', startTime: 13500, endTime: 16000 },
      ],
    },
    {
      id: 'line-3',
      text: 'हर हर महादेव',
      transliteration: 'Hara Hara Mahadeva',
      translation: 'Hail the Great God',
      startTime: 16000,
      endTime: 25000,
      words: [
        { id: 'w7', text: 'हर', transliteration: 'Hara', startTime: 16000, endTime: 18500 },
        { id: 'w8', text: 'हर', transliteration: 'Hara', startTime: 18500, endTime: 21000 },
        { id: 'w9', text: 'महादेव', transliteration: 'Mahadeva', startTime: 21000, endTime: 25000 },
      ],
    },
  ],
  tags: ['Shiva', 'Devotional', 'Panchakshari', 'Meditation'],
  practiceCount: 22150,
  rating: 4.9,
};

// 8. Guru Brahma - Guru Shloka
export const GURU_BRAHMA: ShlokaData = {
  id: 'guru-brahma',
  title: 'Guru Brahma',
  subtitle: 'गुरु ब्रह्मा गुरु विष्णु',
  source: 'Guru Gita',
  category: 'Devotional',
  difficulty: 'beginner',
  duration: 35,
  audioFile: null,
  thumbnailColor: '#795548',
  description: 'A shloka in praise of the Guru, equating the teacher with the holy trinity.',
  meaning: 'Guru is Brahma, Guru is Vishnu, Guru is Shiva. Guru is the Supreme Brahman. Salutations to that Guru.',
  lines: [
    {
      id: 'line-1',
      text: 'गुरुर्ब्रह्मा गुरुर्विष्णुः',
      transliteration: 'Gurur Brahma Gurur Vishnu',
      translation: 'Guru is Brahma, Guru is Vishnu',
      startTime: 0,
      endTime: 9000,
      words: [
        { id: 'w1', text: 'गुरुर्ब्रह्मा', transliteration: 'Gurur Brahma', startTime: 0, endTime: 4500 },
        { id: 'w2', text: 'गुरुर्विष्णुः', transliteration: 'Gurur Vishnu', startTime: 4500, endTime: 9000 },
      ],
    },
    {
      id: 'line-2',
      text: 'गुरुर्देवो महेश्वरः',
      transliteration: 'Gurur Devo Maheshwarah',
      translation: 'Guru is the God Maheshwara (Shiva)',
      startTime: 9000,
      endTime: 18000,
      words: [
        { id: 'w3', text: 'गुरुर्देवो', transliteration: 'Gurur Devo', startTime: 9000, endTime: 13500 },
        { id: 'w4', text: 'महेश्वरः', transliteration: 'Maheshwarah', startTime: 13500, endTime: 18000 },
      ],
    },
    {
      id: 'line-3',
      text: 'गुरुः साक्षात् परं ब्रह्म',
      transliteration: 'Guruh Sakshat Param Brahma',
      translation: 'Guru is the Supreme Brahman itself',
      startTime: 18000,
      endTime: 27000,
      words: [
        { id: 'w5', text: 'गुरुः', transliteration: 'Guruh', startTime: 18000, endTime: 20500 },
        { id: 'w6', text: 'साक्षात्', transliteration: 'Sakshat', startTime: 20500, endTime: 23000 },
        { id: 'w7', text: 'परं', transliteration: 'Param', startTime: 23000, endTime: 25000 },
        { id: 'w8', text: 'ब्रह्म', transliteration: 'Brahma', startTime: 25000, endTime: 27000 },
      ],
    },
    {
      id: 'line-4',
      text: 'तस्मै श्री गुरवे नमः',
      transliteration: 'Tasmai Shri Gurave Namah',
      translation: 'Salutations to that Guru',
      startTime: 27000,
      endTime: 35000,
      words: [
        { id: 'w9', text: 'तस्मै', transliteration: 'Tasmai', startTime: 27000, endTime: 29000 },
        { id: 'w10', text: 'श्री', transliteration: 'Shri', startTime: 29000, endTime: 30500 },
        { id: 'w11', text: 'गुरवे', transliteration: 'Gurave', startTime: 30500, endTime: 32500 },
        { id: 'w12', text: 'नमः', transliteration: 'Namah', startTime: 32500, endTime: 35000 },
      ],
    },
  ],
  tags: ['Guru', 'Devotional', 'Teacher', 'Reverence'],
  practiceCount: 14320,
  rating: 4.8,
};

// 9. Hare Krishna Mahamantra
export const HARE_KRISHNA_MANTRA: ShlokaData = {
  id: 'hare-krishna-mantra',
  title: 'Hare Krishna Mahamantra',
  subtitle: 'हरे कृष्ण महामंत्र',
  source: 'Kali-Santarana Upanishad',
  category: 'Devotional',
  difficulty: 'beginner',
  duration: 40,
  audioFile: null,
  thumbnailColor: '#E91E63',
  description: 'The Hare Krishna Mahamantra is a 16-word Vaishnava mantra for achieving the highest state of consciousness.',
  meaning: 'O Lord Krishna, O Energy of the Lord, please engage me in Your devotional service.',
  lines: [
    {
      id: 'line-1',
      text: 'हरे कृष्ण हरे कृष्ण',
      transliteration: 'Hare Krishna Hare Krishna',
      translation: 'O Lord Krishna, O Lord Krishna',
      startTime: 0,
      endTime: 10000,
      words: [
        { id: 'w1', text: 'हरे', transliteration: 'Hare', startTime: 0, endTime: 2500 },
        { id: 'w2', text: 'कृष्ण', transliteration: 'Krishna', startTime: 2500, endTime: 5000 },
        { id: 'w3', text: 'हरे', transliteration: 'Hare', startTime: 5000, endTime: 7500 },
        { id: 'w4', text: 'कृष्ण', transliteration: 'Krishna', startTime: 7500, endTime: 10000 },
      ],
    },
    {
      id: 'line-2',
      text: 'कृष्ण कृष्ण हरे हरे',
      transliteration: 'Krishna Krishna Hare Hare',
      translation: 'Krishna Krishna, O Energy of Lord',
      startTime: 10000,
      endTime: 20000,
      words: [
        { id: 'w5', text: 'कृष्ण', transliteration: 'Krishna', startTime: 10000, endTime: 12500 },
        { id: 'w6', text: 'कृष्ण', transliteration: 'Krishna', startTime: 12500, endTime: 15000 },
        { id: 'w7', text: 'हरे', transliteration: 'Hare', startTime: 15000, endTime: 17500 },
        { id: 'w8', text: 'हरे', transliteration: 'Hare', startTime: 17500, endTime: 20000 },
      ],
    },
    {
      id: 'line-3',
      text: 'हरे राम हरे राम',
      transliteration: 'Hare Rama Hare Rama',
      translation: 'O Lord Rama, O Lord Rama',
      startTime: 20000,
      endTime: 30000,
      words: [
        { id: 'w9', text: 'हरे', transliteration: 'Hare', startTime: 20000, endTime: 22500 },
        { id: 'w10', text: 'राम', transliteration: 'Rama', startTime: 22500, endTime: 25000 },
        { id: 'w11', text: 'हरे', transliteration: 'Hare', startTime: 25000, endTime: 27500 },
        { id: 'w12', text: 'राम', transliteration: 'Rama', startTime: 27500, endTime: 30000 },
      ],
    },
    {
      id: 'line-4',
      text: 'राम राम हरे हरे',
      transliteration: 'Rama Rama Hare Hare',
      translation: 'Rama Rama, O Energy of Lord',
      startTime: 30000,
      endTime: 40000,
      words: [
        { id: 'w13', text: 'राम', transliteration: 'Rama', startTime: 30000, endTime: 32500 },
        { id: 'w14', text: 'राम', transliteration: 'Rama', startTime: 32500, endTime: 35000 },
        { id: 'w15', text: 'हरे', transliteration: 'Hare', startTime: 35000, endTime: 37500 },
        { id: 'w16', text: 'हरे', transliteration: 'Hare', startTime: 37500, endTime: 40000 },
      ],
    },
  ],
  tags: ['Krishna', 'Rama', 'Vaishnava', 'Bhakti'],
  practiceCount: 25680,
  rating: 4.9,
};

// 10. Hanuman Chalisa Opening
export const HANUMAN_CHALISA_OPENING: ShlokaData = {
  id: 'hanuman-chalisa-opening',
  title: 'Hanuman Chalisa (Opening)',
  subtitle: 'श्रीगुरु चरन सरोज रज',
  source: 'Hanuman Chalisa - Tulsidas',
  category: 'Devotional',
  difficulty: 'intermediate',
  duration: 45,
  audioFile: null,
  thumbnailColor: '#FF5722',
  description: 'The opening verses of Hanuman Chalisa, a devotional hymn dedicated to Lord Hanuman.',
  meaning: 'With the dust of Guru\'s lotus feet, I clean the mirror of my mind and then narrate the pure fame of Shri Ram, which bestows the four fruits of life.',
  lines: [
    {
      id: 'line-1',
      text: 'श्रीगुरु चरन सरोज रज',
      transliteration: 'Shri Guru Charan Saroj Raj',
      translation: 'With the dust of Guru\'s lotus feet',
      startTime: 0,
      endTime: 8000,
      words: [
        { id: 'w1', text: 'श्रीगुरु', transliteration: 'Shri Guru', startTime: 0, endTime: 2500 },
        { id: 'w2', text: 'चरन', transliteration: 'Charan', startTime: 2500, endTime: 4500 },
        { id: 'w3', text: 'सरोज', transliteration: 'Saroj', startTime: 4500, endTime: 6500 },
        { id: 'w4', text: 'रज', transliteration: 'Raj', startTime: 6500, endTime: 8000 },
      ],
    },
    {
      id: 'line-2',
      text: 'निज मनु मुकुरु सुधारि',
      transliteration: 'Nij Manu Mukuru Sudhari',
      translation: 'I clean the mirror of my mind',
      startTime: 8000,
      endTime: 15000,
      words: [
        { id: 'w5', text: 'निज', transliteration: 'Nij', startTime: 8000, endTime: 9500 },
        { id: 'w6', text: 'मनु', transliteration: 'Manu', startTime: 9500, endTime: 11000 },
        { id: 'w7', text: 'मुकुरु', transliteration: 'Mukuru', startTime: 11000, endTime: 13000 },
        { id: 'w8', text: 'सुधारि', transliteration: 'Sudhari', startTime: 13000, endTime: 15000 },
      ],
    },
    {
      id: 'line-3',
      text: 'बरनउँ रघुबर बिमल जसु',
      transliteration: 'Baranau Raghubar Bimal Jasu',
      translation: 'I describe the pure glory of Shri Ram',
      startTime: 15000,
      endTime: 23000,
      words: [
        { id: 'w9', text: 'बरनउँ', transliteration: 'Baranau', startTime: 15000, endTime: 17500 },
        { id: 'w10', text: 'रघुबर', transliteration: 'Raghubar', startTime: 17500, endTime: 20000 },
        { id: 'w11', text: 'बिमल', transliteration: 'Bimal', startTime: 20000, endTime: 21500 },
        { id: 'w12', text: 'जसु', transliteration: 'Jasu', startTime: 21500, endTime: 23000 },
      ],
    },
    {
      id: 'line-4',
      text: 'जो दायकु फल चारि',
      transliteration: 'Jo Dayaku Phal Chari',
      translation: 'Which bestows the four fruits of life',
      startTime: 23000,
      endTime: 30000,
      words: [
        { id: 'w13', text: 'जो', transliteration: 'Jo', startTime: 23000, endTime: 24500 },
        { id: 'w14', text: 'दायकु', transliteration: 'Dayaku', startTime: 24500, endTime: 26500 },
        { id: 'w15', text: 'फल', transliteration: 'Phal', startTime: 26500, endTime: 28000 },
        { id: 'w16', text: 'चारि', transliteration: 'Chari', startTime: 28000, endTime: 30000 },
      ],
    },
    {
      id: 'line-5',
      text: 'जय हनुमान ज्ञान गुन सागर',
      transliteration: 'Jai Hanuman Gyan Gun Sagar',
      translation: 'Victory to Hanuman, ocean of wisdom and virtues',
      startTime: 30000,
      endTime: 38000,
      words: [
        { id: 'w17', text: 'जय', transliteration: 'Jai', startTime: 30000, endTime: 31500 },
        { id: 'w18', text: 'हनुमान', transliteration: 'Hanuman', startTime: 31500, endTime: 34000 },
        { id: 'w19', text: 'ज्ञान', transliteration: 'Gyan', startTime: 34000, endTime: 35500 },
        { id: 'w20', text: 'गुन', transliteration: 'Gun', startTime: 35500, endTime: 36500 },
        { id: 'w21', text: 'सागर', transliteration: 'Sagar', startTime: 36500, endTime: 38000 },
      ],
    },
    {
      id: 'line-6',
      text: 'जय कपीस तिहुँ लोक उजागर',
      transliteration: 'Jai Kapees Tihu Lok Ujagar',
      translation: 'Victory to the Monkey Lord, illuminator of three worlds',
      startTime: 38000,
      endTime: 45000,
      words: [
        { id: 'w22', text: 'जय', transliteration: 'Jai', startTime: 38000, endTime: 39000 },
        { id: 'w23', text: 'कपीस', transliteration: 'Kapees', startTime: 39000, endTime: 41000 },
        { id: 'w24', text: 'तिहुँ', transliteration: 'Tihu', startTime: 41000, endTime: 42000 },
        { id: 'w25', text: 'लोक', transliteration: 'Lok', startTime: 42000, endTime: 43500 },
        { id: 'w26', text: 'उजागर', transliteration: 'Ujagar', startTime: 43500, endTime: 45000 },
      ],
    },
  ],
  tags: ['Hanuman', 'Devotional', 'Tulsidas', 'Strength'],
  practiceCount: 31450,
  rating: 4.9,
};

// 11. Lakshmi Mantra
export const LAKSHMI_MANTRA: ShlokaData = {
  id: 'lakshmi-mantra',
  title: 'Lakshmi Mantra',
  subtitle: 'ॐ श्रीं महालक्ष्म्यै नमः',
  source: 'Lakshmi Tantra',
  category: 'Devotional',
  difficulty: 'beginner',
  duration: 30,
  audioFile: null,
  thumbnailColor: '#FFD700',
  description: 'A powerful mantra dedicated to Goddess Lakshmi for wealth, prosperity, and abundance.',
  meaning: 'Om, I bow to the great Goddess Lakshmi who bestows wealth and prosperity.',
  lines: [
    {
      id: 'line-1',
      text: 'ॐ श्रीं महालक्ष्म्यै नमः',
      transliteration: 'Om Shreem Mahalakshmyai Namah',
      translation: 'Om, I bow to Goddess Mahalakshmi',
      startTime: 0,
      endTime: 10000,
      words: [
        { id: 'w1', text: 'ॐ', transliteration: 'Om', startTime: 0, endTime: 2000 },
        { id: 'w2', text: 'श्रीं', transliteration: 'Shreem', startTime: 2000, endTime: 4000 },
        { id: 'w3', text: 'महालक्ष्म्यै', transliteration: 'Mahalakshmyai', startTime: 4000, endTime: 7500 },
        { id: 'w4', text: 'नमः', transliteration: 'Namah', startTime: 7500, endTime: 10000 },
      ],
    },
    {
      id: 'line-2',
      text: 'ॐ ह्रीं श्रीं लक्ष्मीभ्यो नमः',
      transliteration: 'Om Hreem Shreem Lakshmibhyo Namah',
      translation: 'Om, salutations to all forms of Lakshmi',
      startTime: 10000,
      endTime: 20000,
      words: [
        { id: 'w5', text: 'ॐ', transliteration: 'Om', startTime: 10000, endTime: 11500 },
        { id: 'w6', text: 'ह्रीं', transliteration: 'Hreem', startTime: 11500, endTime: 13500 },
        { id: 'w7', text: 'श्रीं', transliteration: 'Shreem', startTime: 13500, endTime: 15500 },
        { id: 'w8', text: 'लक्ष्मीभ्यो', transliteration: 'Lakshmibhyo', startTime: 15500, endTime: 18000 },
        { id: 'w9', text: 'नमः', transliteration: 'Namah', startTime: 18000, endTime: 20000 },
      ],
    },
    {
      id: 'line-3',
      text: 'महालक्ष्मी च विद्महे',
      transliteration: 'Mahalakshmi Cha Vidmahe',
      translation: 'We know the great Lakshmi',
      startTime: 20000,
      endTime: 30000,
      words: [
        { id: 'w10', text: 'महालक्ष्मी', transliteration: 'Mahalakshmi', startTime: 20000, endTime: 24000 },
        { id: 'w11', text: 'च', transliteration: 'Cha', startTime: 24000, endTime: 25500 },
        { id: 'w12', text: 'विद्महे', transliteration: 'Vidmahe', startTime: 25500, endTime: 30000 },
      ],
    },
  ],
  tags: ['Lakshmi', 'Wealth', 'Prosperity', 'Devotional'],
  practiceCount: 19870,
  rating: 4.8,
};

// 12. Durga Mantra
export const DURGA_MANTRA: ShlokaData = {
  id: 'durga-mantra',
  title: 'Durga Mantra',
  subtitle: 'सर्वमङ्गलमाङ्गल्ये',
  source: 'Durga Saptashati',
  category: 'Devotional',
  difficulty: 'intermediate',
  duration: 40,
  audioFile: null,
  thumbnailColor: '#C62828',
  description: 'A powerful shloka invoking Goddess Durga, the divine mother who destroys evil and protects devotees.',
  meaning: 'O auspicious one, who bestows auspiciousness, O one who fulfills all desires, O one who provides refuge, O three-eyed Goddess Gauri, salutations to you.',
  lines: [
    {
      id: 'line-1',
      text: 'सर्वमङ्गलमाङ्गल्ये',
      transliteration: 'Sarva Mangala Mangalye',
      translation: 'O auspicious one who bestows auspiciousness',
      startTime: 0,
      endTime: 8000,
      words: [
        { id: 'w1', text: 'सर्वमङ्गल', transliteration: 'Sarva Mangala', startTime: 0, endTime: 4000 },
        { id: 'w2', text: 'माङ्गल्ये', transliteration: 'Mangalye', startTime: 4000, endTime: 8000 },
      ],
    },
    {
      id: 'line-2',
      text: 'शिवे सर्वार्थसाधिके',
      transliteration: 'Shive Sarvartha Sadhike',
      translation: 'O Shiva who fulfills all desires',
      startTime: 8000,
      endTime: 16000,
      words: [
        { id: 'w3', text: 'शिवे', transliteration: 'Shive', startTime: 8000, endTime: 10500 },
        { id: 'w4', text: 'सर्वार्थ', transliteration: 'Sarvartha', startTime: 10500, endTime: 13000 },
        { id: 'w5', text: 'साधिके', transliteration: 'Sadhike', startTime: 13000, endTime: 16000 },
      ],
    },
    {
      id: 'line-3',
      text: 'शरण्ये त्र्यम्बके गौरि',
      transliteration: 'Sharanye Tryambake Gauri',
      translation: 'O refuge, three-eyed Gauri',
      startTime: 16000,
      endTime: 26000,
      words: [
        { id: 'w6', text: 'शरण्ये', transliteration: 'Sharanye', startTime: 16000, endTime: 19000 },
        { id: 'w7', text: 'त्र्यम्बके', transliteration: 'Tryambake', startTime: 19000, endTime: 22500 },
        { id: 'w8', text: 'गौरि', transliteration: 'Gauri', startTime: 22500, endTime: 26000 },
      ],
    },
    {
      id: 'line-4',
      text: 'नारायणि नमोऽस्तु ते',
      transliteration: 'Narayani Namostu Te',
      translation: 'O Narayani, salutations to you',
      startTime: 26000,
      endTime: 35000,
      words: [
        { id: 'w9', text: 'नारायणि', transliteration: 'Narayani', startTime: 26000, endTime: 30000 },
        { id: 'w10', text: 'नमोऽस्तु', transliteration: 'Namostu', startTime: 30000, endTime: 33000 },
        { id: 'w11', text: 'ते', transliteration: 'Te', startTime: 33000, endTime: 35000 },
      ],
    },
  ],
  tags: ['Durga', 'Shakti', 'Protection', 'Devotional'],
  practiceCount: 16540,
  rating: 4.8,
};

// 13. Vishnu Mantra
export const VISHNU_MANTRA: ShlokaData = {
  id: 'vishnu-mantra',
  title: 'Vishnu Mantra',
  subtitle: 'शान्ताकारं भुजगशयनं',
  source: 'Vishnu Sahasranama',
  category: 'Devotional',
  difficulty: 'intermediate',
  duration: 45,
  audioFile: null,
  thumbnailColor: '#1565C0',
  description: 'A beautiful dhyana shloka describing Lord Vishnu in his cosmic form.',
  meaning: 'He who has a peaceful form, who rests on a serpent, who has a lotus in his navel, who is the lord of gods, who supports the universe, who is like the sky, who has the color of clouds, who has beautiful limbs.',
  lines: [
    {
      id: 'line-1',
      text: 'शान्ताकारं भुजगशयनं',
      transliteration: 'Shantakaram Bhujagashayanam',
      translation: 'He who has a peaceful form, resting on serpent',
      startTime: 0,
      endTime: 10000,
      words: [
        { id: 'w1', text: 'शान्ताकारं', transliteration: 'Shantakaram', startTime: 0, endTime: 5000 },
        { id: 'w2', text: 'भुजगशयनं', transliteration: 'Bhujagashayanam', startTime: 5000, endTime: 10000 },
      ],
    },
    {
      id: 'line-2',
      text: 'पद्मनाभं सुरेशं',
      transliteration: 'Padmanabham Suresham',
      translation: 'With lotus navel, lord of gods',
      startTime: 10000,
      endTime: 18000,
      words: [
        { id: 'w3', text: 'पद्मनाभं', transliteration: 'Padmanabham', startTime: 10000, endTime: 14000 },
        { id: 'w4', text: 'सुरेशं', transliteration: 'Suresham', startTime: 14000, endTime: 18000 },
      ],
    },
    {
      id: 'line-3',
      text: 'विश्वाधारं गगनसदृशं',
      transliteration: 'Vishvadharam Gaganasadrisham',
      translation: 'Support of universe, like the sky',
      startTime: 18000,
      endTime: 28000,
      words: [
        { id: 'w5', text: 'विश्वाधारं', transliteration: 'Vishvadharam', startTime: 18000, endTime: 23000 },
        { id: 'w6', text: 'गगनसदृशं', transliteration: 'Gaganasadrisham', startTime: 23000, endTime: 28000 },
      ],
    },
    {
      id: 'line-4',
      text: 'मेघवर्णं शुभाङ्गं',
      transliteration: 'Meghavarnam Shubhangam',
      translation: 'Cloud-colored, with beautiful limbs',
      startTime: 28000,
      endTime: 36000,
      words: [
        { id: 'w7', text: 'मेघवर्णं', transliteration: 'Meghavarnam', startTime: 28000, endTime: 32000 },
        { id: 'w8', text: 'शुभाङ्गं', transliteration: 'Shubhangam', startTime: 32000, endTime: 36000 },
      ],
    },
    {
      id: 'line-5',
      text: 'विष्णुं वन्दे सर्वलोकैकनाथं',
      transliteration: 'Vishnum Vande Sarvalokaikanatham',
      translation: 'I worship Vishnu, the one lord of all worlds',
      startTime: 36000,
      endTime: 45000,
      words: [
        { id: 'w9', text: 'विष्णुं', transliteration: 'Vishnum', startTime: 36000, endTime: 38500 },
        { id: 'w10', text: 'वन्दे', transliteration: 'Vande', startTime: 38500, endTime: 40500 },
        { id: 'w11', text: 'सर्वलोकैकनाथं', transliteration: 'Sarvalokaikanatham', startTime: 40500, endTime: 45000 },
      ],
    },
  ],
  tags: ['Vishnu', 'Devotional', 'Dhyana', 'Preserver'],
  practiceCount: 13280,
  rating: 4.7,
};

// 14. Devi Prayer - Ya Devi Sarva Bhuteshu
export const YA_DEVI_MANTRA: ShlokaData = {
  id: 'ya-devi-mantra',
  title: 'Ya Devi Sarva Bhuteshu',
  subtitle: 'या देवी सर्वभूतेषु',
  source: 'Durga Saptashati',
  category: 'Devotional',
  difficulty: 'beginner',
  duration: 35,
  audioFile: null,
  thumbnailColor: '#AD1457',
  description: 'A beautiful hymn from Durga Saptashati, invoking the Goddess who resides in all beings.',
  meaning: 'To that Goddess who resides in all beings in the form of consciousness, salutations to her, salutations to her, salutations to her repeatedly.',
  lines: [
    {
      id: 'line-1',
      text: 'या देवी सर्वभूतेषु',
      transliteration: 'Ya Devi Sarva Bhuteshu',
      translation: 'To that Goddess in all beings',
      startTime: 0,
      endTime: 8000,
      words: [
        { id: 'w1', text: 'या', transliteration: 'Ya', startTime: 0, endTime: 1500 },
        { id: 'w2', text: 'देवी', transliteration: 'Devi', startTime: 1500, endTime: 3500 },
        { id: 'w3', text: 'सर्वभूतेषु', transliteration: 'Sarva Bhuteshu', startTime: 3500, endTime: 8000 },
      ],
    },
    {
      id: 'line-2',
      text: 'चेतनेत्यभिधीयते',
      transliteration: 'Chetanetyabhidhiyate',
      translation: 'Who is called consciousness',
      startTime: 8000,
      endTime: 15000,
      words: [
        { id: 'w4', text: 'चेतनेत्य', transliteration: 'Chetanetya', startTime: 8000, endTime: 11500 },
        { id: 'w5', text: 'अभिधीयते', transliteration: 'Abhidhiyate', startTime: 11500, endTime: 15000 },
      ],
    },
    {
      id: 'line-3',
      text: 'नमस्तस्यै नमस्तस्यै',
      transliteration: 'Namastasyai Namastasyai',
      translation: 'Salutations to her, salutations to her',
      startTime: 15000,
      endTime: 25000,
      words: [
        { id: 'w6', text: 'नमस्तस्यै', transliteration: 'Namastasyai', startTime: 15000, endTime: 20000 },
        { id: 'w7', text: 'नमस्तस्यै', transliteration: 'Namastasyai', startTime: 20000, endTime: 25000 },
      ],
    },
    {
      id: 'line-4',
      text: 'नमस्तस्यै नमो नमः',
      transliteration: 'Namastasyai Namo Namah',
      translation: 'Salutations to her, again and again',
      startTime: 25000,
      endTime: 35000,
      words: [
        { id: 'w8', text: 'नमस्तस्यै', transliteration: 'Namastasyai', startTime: 25000, endTime: 29000 },
        { id: 'w9', text: 'नमो', transliteration: 'Namo', startTime: 29000, endTime: 32000 },
        { id: 'w10', text: 'नमः', transliteration: 'Namah', startTime: 32000, endTime: 35000 },
      ],
    },
  ],
  tags: ['Devi', 'Shakti', 'Consciousness', 'Universal'],
  practiceCount: 17890,
  rating: 4.8,
};

// 15. Surya Mantra
export const SURYA_MANTRA: ShlokaData = {
  id: 'surya-mantra',
  title: 'Surya Namaskar Mantra',
  subtitle: 'ॐ मित्राय नमः',
  source: 'Surya Upasana',
  category: 'Vedic Mantras',
  difficulty: 'intermediate',
  duration: 50,
  audioFile: null,
  thumbnailColor: '#FF8F00',
  description: 'The twelve mantras chanted during Surya Namaskar, each dedicated to a different aspect of the Sun God.',
  meaning: 'Salutations to the friend of all, the radiant one, the cause of activity, the illuminator, the one who moves in the sky, the nourisher.',
  lines: [
    {
      id: 'line-1',
      text: 'ॐ मित्राय नमः',
      transliteration: 'Om Mitraya Namah',
      translation: 'Salutations to the friend of all',
      startTime: 0,
      endTime: 8000,
      words: [
        { id: 'w1', text: 'ॐ', transliteration: 'Om', startTime: 0, endTime: 2000 },
        { id: 'w2', text: 'मित्राय', transliteration: 'Mitraya', startTime: 2000, endTime: 5000 },
        { id: 'w3', text: 'नमः', transliteration: 'Namah', startTime: 5000, endTime: 8000 },
      ],
    },
    {
      id: 'line-2',
      text: 'ॐ रवये नमः',
      transliteration: 'Om Ravaye Namah',
      translation: 'Salutations to the radiant one',
      startTime: 8000,
      endTime: 16000,
      words: [
        { id: 'w4', text: 'ॐ', transliteration: 'Om', startTime: 8000, endTime: 10000 },
        { id: 'w5', text: 'रवये', transliteration: 'Ravaye', startTime: 10000, endTime: 13000 },
        { id: 'w6', text: 'नमः', transliteration: 'Namah', startTime: 13000, endTime: 16000 },
      ],
    },
    {
      id: 'line-3',
      text: 'ॐ सूर्याय नमः',
      transliteration: 'Om Suryaya Namah',
      translation: 'Salutations to the one who induces activity',
      startTime: 16000,
      endTime: 24000,
      words: [
        { id: 'w7', text: 'ॐ', transliteration: 'Om', startTime: 16000, endTime: 18000 },
        { id: 'w8', text: 'सूर्याय', transliteration: 'Suryaya', startTime: 18000, endTime: 21000 },
        { id: 'w9', text: 'नमः', transliteration: 'Namah', startTime: 21000, endTime: 24000 },
      ],
    },
    {
      id: 'line-4',
      text: 'ॐ भानवे नमः',
      transliteration: 'Om Bhanave Namah',
      translation: 'Salutations to the one who illuminates',
      startTime: 24000,
      endTime: 32000,
      words: [
        { id: 'w10', text: 'ॐ', transliteration: 'Om', startTime: 24000, endTime: 26000 },
        { id: 'w11', text: 'भानवे', transliteration: 'Bhanave', startTime: 26000, endTime: 29000 },
        { id: 'w12', text: 'नमः', transliteration: 'Namah', startTime: 29000, endTime: 32000 },
      ],
    },
    {
      id: 'line-5',
      text: 'ॐ खगाय नमः',
      transliteration: 'Om Khagaya Namah',
      translation: 'Salutations to the one who moves in the sky',
      startTime: 32000,
      endTime: 40000,
      words: [
        { id: 'w13', text: 'ॐ', transliteration: 'Om', startTime: 32000, endTime: 34000 },
        { id: 'w14', text: 'खगाय', transliteration: 'Khagaya', startTime: 34000, endTime: 37000 },
        { id: 'w15', text: 'नमः', transliteration: 'Namah', startTime: 37000, endTime: 40000 },
      ],
    },
    {
      id: 'line-6',
      text: 'ॐ पूष्णे नमः',
      transliteration: 'Om Pushne Namah',
      translation: 'Salutations to the nourisher',
      startTime: 40000,
      endTime: 50000,
      words: [
        { id: 'w16', text: 'ॐ', transliteration: 'Om', startTime: 40000, endTime: 42000 },
        { id: 'w17', text: 'पूष्णे', transliteration: 'Pushne', startTime: 42000, endTime: 46000 },
        { id: 'w18', text: 'नमः', transliteration: 'Namah', startTime: 46000, endTime: 50000 },
      ],
    },
  ],
  tags: ['Surya', 'Sun', 'Yoga', 'Health'],
  practiceCount: 21340,
  rating: 4.8,
};

// 16. Aum Mantra - Pranava
export const AUM_MANTRA: ShlokaData = {
  id: 'aum-mantra',
  title: 'Pranava Mantra (Aum)',
  subtitle: 'ॐ',
  source: 'Mandukya Upanishad',
  category: 'Vedic Mantras',
  difficulty: 'beginner',
  duration: 30,
  audioFile: null,
  thumbnailColor: '#311B92',
  description: 'The sacred syllable Aum (Om) is the primordial sound, representing the essence of the ultimate reality.',
  meaning: 'Om is the sound of the universe. It represents creation, preservation, and transformation. It is the past, present, and future unified.',
  lines: [
    {
      id: 'line-1',
      text: 'ॐ',
      transliteration: 'Aum',
      translation: 'The primordial sound',
      startTime: 0,
      endTime: 10000,
      words: [
        { id: 'w1', text: 'ॐ', transliteration: 'Aum', startTime: 0, endTime: 10000 },
      ],
    },
    {
      id: 'line-2',
      text: 'ॐ ॐ ॐ',
      transliteration: 'Aum Aum Aum',
      translation: 'Three-fold Om chanting',
      startTime: 10000,
      endTime: 30000,
      words: [
        { id: 'w2', text: 'ॐ', transliteration: 'Aum', startTime: 10000, endTime: 17000 },
        { id: 'w3', text: 'ॐ', transliteration: 'Aum', startTime: 17000, endTime: 24000 },
        { id: 'w4', text: 'ॐ', transliteration: 'Aum', startTime: 24000, endTime: 30000 },
      ],
    },
  ],
  tags: ['Om', 'Meditation', 'Universal', 'Sacred'],
  practiceCount: 28760,
  rating: 4.9,
};

// 17. Bhagavad Gita - Steady Mind (Chapter 2, Verse 56)
export const BG_STEADY_MIND: ShlokaData = {
  id: 'bg-steady-mind',
  title: 'Sthita Prajna - Steady Mind',
  subtitle: 'स्थितप्रज्ञ',
  source: 'Bhagavad Gita 2.56',
  category: 'Bhagavad Gita',
  difficulty: 'intermediate',
  duration: 45,
  audioFile: null,
  thumbnailColor: '#3F51B5',
  description: 'This verse describes the qualities of a person of steady wisdom who remains undisturbed in all circumstances.',
  meaning: 'One who is not disturbed in spite of the threefold miseries, who is not elated when there is happiness, and who is free from attachment, fear and anger, is called a sage of steady mind.',
  lines: [
    {
      id: 'line-1',
      text: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः',
      transliteration: 'Duhkheshv anudvigna-manah sukheshu vigata-sprihah',
      translation: 'Undisturbed in miseries, without desire in happiness',
      startTime: 0,
      endTime: 11000,
      words: [
        { id: 'w1', text: 'दुःखेषु', transliteration: 'Duhkheshu', startTime: 0, endTime: 2500 },
        { id: 'w2', text: 'अनुद्विग्नमनाः', transliteration: 'Anudvigna-manah', startTime: 2500, endTime: 5500 },
        { id: 'w3', text: 'सुखेषु', transliteration: 'Sukheshu', startTime: 5500, endTime: 7500 },
        { id: 'w4', text: 'विगतस्पृहः', transliteration: 'Vigata-sprihah', startTime: 7500, endTime: 11000 },
      ],
    },
    {
      id: 'line-2',
      text: 'वीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते',
      transliteration: 'Vita-raga-bhaya-krodhah sthita-dhir munir ucyate',
      translation: 'Free from attachment, fear and anger - such a sage is called steady in wisdom',
      startTime: 11000,
      endTime: 23000,
      words: [
        { id: 'w5', text: 'वीतरागभयक्रोधः', transliteration: 'Vita-raga-bhaya-krodhah', startTime: 11000, endTime: 16000 },
        { id: 'w6', text: 'स्थितधीः', transliteration: 'Sthita-dhih', startTime: 16000, endTime: 18500 },
        { id: 'w7', text: 'मुनिः', transliteration: 'Munih', startTime: 18500, endTime: 20500 },
        { id: 'w8', text: 'उच्यते', transliteration: 'Ucyate', startTime: 20500, endTime: 23000 },
      ],
    },
  ],
  tags: ['Bhagavad Gita', 'Wisdom', 'Equanimity', 'Mind Control'],
  practiceCount: 13240,
  rating: 4.9,
};

// 18. Bhagavad Gita - Liberation from Anger (Chapter 5, Verse 26)
export const BG_LIBERATION_ANGER: ShlokaData = {
  id: 'bg-liberation-anger',
  title: 'Freedom from Desire and Anger',
  subtitle: 'काम क्रोध विमुक्त',
  source: 'Bhagavad Gita 5.26',
  category: 'Bhagavad Gita',
  difficulty: 'intermediate',
  duration: 40,
  audioFile: null,
  thumbnailColor: '#673AB7',
  description: 'This verse promises liberation to those who are free from desire and anger, and who are self-realized.',
  meaning: 'Those who are free from anger and all material desires, who are self-realized, self-disciplined and constantly endeavoring for perfection, are assured of liberation in the Supreme in the very near future.',
  lines: [
    {
      id: 'line-1',
      text: 'कामक्रोधविमुक्तानां यतीनां यतचेतसाम्',
      transliteration: 'Kama-krodha-vimuktanam yatinam yata-cetasam',
      translation: 'Those free from desire and anger, self-controlled sages',
      startTime: 0,
      endTime: 10000,
      words: [
        { id: 'w1', text: 'कामक्रोधविमुक्तानां', transliteration: 'Kama-krodha-vimuktanam', startTime: 0, endTime: 5500 },
        { id: 'w2', text: 'यतीनां', transliteration: 'Yatinam', startTime: 5500, endTime: 7500 },
        { id: 'w3', text: 'यतचेतसाम्', transliteration: 'Yata-cetasam', startTime: 7500, endTime: 10000 },
      ],
    },
    {
      id: 'line-2',
      text: 'अभितो ब्रह्मनिर्वाणं वर्तते विदितात्मनाम्',
      transliteration: 'Abhito brahma-nirvanam vartate viditatmanam',
      translation: 'Liberation in Brahman is assured for the self-realized',
      startTime: 10000,
      endTime: 20000,
      words: [
        { id: 'w4', text: 'अभितः', transliteration: 'Abhitah', startTime: 10000, endTime: 12000 },
        { id: 'w5', text: 'ब्रह्मनिर्वाणं', transliteration: 'Brahma-nirvanam', startTime: 12000, endTime: 15500 },
        { id: 'w6', text: 'वर्तते', transliteration: 'Vartate', startTime: 15500, endTime: 17500 },
        { id: 'w7', text: 'विदितात्मनाम्', transliteration: 'Viditatmanam', startTime: 17500, endTime: 20000 },
      ],
    },
  ],
  tags: ['Bhagavad Gita', 'Liberation', 'Anger Management', 'Self-Control'],
  practiceCount: 9850,
  rating: 4.7,
};

// 19. Bhagavad Gita - Arjuna's Surrender (Chapter 2, Verse 7)
export const BG_ARJUNA_SURRENDER: ShlokaData = {
  id: 'bg-arjuna-surrender',
  title: "Arjuna's Surrender to Krishna",
  subtitle: 'शिष्यस्तेऽहं शाधि मां',
  source: 'Bhagavad Gita 2.7',
  category: 'Bhagavad Gita',
  difficulty: 'intermediate',
  duration: 55,
  audioFile: null,
  thumbnailColor: '#FF5722',
  description: 'Arjuna surrenders to Lord Krishna as his disciple, seeking guidance in his moment of confusion about dharma.',
  meaning: 'Now I am confused about my duty and have lost all composure because of weakness. In this condition I am asking You to tell me clearly what is best for me. Now I am Your disciple, and a soul surrendered unto You. Please instruct me.',
  lines: [
    {
      id: 'line-1',
      text: 'कार्पण्यदोषोपहतस्वभावः पृच्छामि त्वां धर्मसम्मूढचेताः',
      transliteration: 'Karpanya-doshopahata-svabhavah pricchami tvam dharma-sammudha-cetah',
      translation: 'Overcome by weakness, confused about dharma, I ask You',
      startTime: 0,
      endTime: 13000,
      words: [
        { id: 'w1', text: 'कार्पण्यदोषोपहतस्वभावः', transliteration: 'Karpanya-doshopahata-svabhavah', startTime: 0, endTime: 6500 },
        { id: 'w2', text: 'पृच्छामि', transliteration: 'Pricchami', startTime: 6500, endTime: 8500 },
        { id: 'w3', text: 'त्वां', transliteration: 'Tvam', startTime: 8500, endTime: 9500 },
        { id: 'w4', text: 'धर्मसम्मूढचेताः', transliteration: 'Dharma-sammudha-cetah', startTime: 9500, endTime: 13000 },
      ],
    },
    {
      id: 'line-2',
      text: 'यच्छ्रेयः स्यान्निश्चितं ब्रूहि तन्मे',
      transliteration: 'Yac chreyah syan niscitam bruhi tan me',
      translation: 'Tell me with certainty what is best for me',
      startTime: 13000,
      endTime: 22000,
      words: [
        { id: 'w5', text: 'यत्', transliteration: 'Yat', startTime: 13000, endTime: 14500 },
        { id: 'w6', text: 'श्रेयः', transliteration: 'Shreyah', startTime: 14500, endTime: 16500 },
        { id: 'w7', text: 'स्यात्', transliteration: 'Syat', startTime: 16500, endTime: 18000 },
        { id: 'w8', text: 'निश्चितं', transliteration: 'Niscitam', startTime: 18000, endTime: 19500 },
        { id: 'w9', text: 'ब्रूहि', transliteration: 'Bruhi', startTime: 19500, endTime: 20500 },
        { id: 'w10', text: 'तत्', transliteration: 'Tat', startTime: 20500, endTime: 21000 },
        { id: 'w11', text: 'मे', transliteration: 'Me', startTime: 21000, endTime: 22000 },
      ],
    },
    {
      id: 'line-3',
      text: 'शिष्यस्तेऽहं शाधि मां त्वां प्रपन्नम्',
      transliteration: 'Shishyas te aham shadhi mam tvam prapannam',
      translation: 'I am Your disciple, a soul surrendered unto You. Please instruct me.',
      startTime: 22000,
      endTime: 33000,
      words: [
        { id: 'w12', text: 'शिष्यः', transliteration: 'Shishyah', startTime: 22000, endTime: 24000 },
        { id: 'w13', text: 'ते', transliteration: 'Te', startTime: 24000, endTime: 25000 },
        { id: 'w14', text: 'अहं', transliteration: 'Aham', startTime: 25000, endTime: 26500 },
        { id: 'w15', text: 'शाधि', transliteration: 'Shadhi', startTime: 26500, endTime: 28000 },
        { id: 'w16', text: 'मां', transliteration: 'Mam', startTime: 28000, endTime: 29500 },
        { id: 'w17', text: 'त्वां', transliteration: 'Tvam', startTime: 29500, endTime: 30500 },
        { id: 'w18', text: 'प्रपन्नम्', transliteration: 'Prapannam', startTime: 30500, endTime: 33000 },
      ],
    },
  ],
  tags: ['Bhagavad Gita', 'Surrender', 'Guidance', 'Discipleship'],
  practiceCount: 11670,
  rating: 4.8,
};

// 20. Bhagavad Gita - Mind Control (Chapter 6, Verse 5)
export const BG_MIND_CONTROL: ShlokaData = {
  id: 'bg-mind-control',
  title: 'The Mind as Friend and Enemy',
  subtitle: 'आत्मैव ह्यात्मनो बन्धुः',
  source: 'Bhagavad Gita 6.5',
  category: 'Bhagavad Gita',
  difficulty: 'intermediate',
  duration: 42,
  audioFile: null,
  thumbnailColor: '#00BCD4',
  description: 'This verse teaches that one must elevate oneself through the mind, as the mind can be both friend and enemy.',
  meaning: 'A man must elevate himself by his own mind, not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.',
  lines: [
    {
      id: 'line-1',
      text: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्',
      transliteration: 'Uddhared atmanatmanam natmanam avasadayet',
      translation: 'Elevate yourself by your own mind, do not degrade yourself',
      startTime: 0,
      endTime: 11000,
      words: [
        { id: 'w1', text: 'उद्धरेत्', transliteration: 'Uddharet', startTime: 0, endTime: 2500 },
        { id: 'w2', text: 'आत्मना', transliteration: 'Atmana', startTime: 2500, endTime: 4500 },
        { id: 'w3', text: 'आत्मानं', transliteration: 'Atmanam', startTime: 4500, endTime: 6500 },
        { id: 'w4', text: 'न', transliteration: 'Na', startTime: 6500, endTime: 7500 },
        { id: 'w5', text: 'आत्मानम्', transliteration: 'Atmanam', startTime: 7500, endTime: 9000 },
        { id: 'w6', text: 'अवसादयेत्', transliteration: 'Avasadayet', startTime: 9000, endTime: 11000 },
      ],
    },
    {
      id: 'line-2',
      text: 'आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः',
      transliteration: 'Atmaiva hy atmano bandhur atmaiva ripur atmanah',
      translation: 'The mind is indeed the friend and also the enemy of oneself',
      startTime: 11000,
      endTime: 22000,
      words: [
        { id: 'w7', text: 'आत्मा', transliteration: 'Atma', startTime: 11000, endTime: 12500 },
        { id: 'w8', text: 'एव', transliteration: 'Eva', startTime: 12500, endTime: 13500 },
        { id: 'w9', text: 'हि', transliteration: 'Hi', startTime: 13500, endTime: 14500 },
        { id: 'w10', text: 'आत्मनः', transliteration: 'Atmanah', startTime: 14500, endTime: 16000 },
        { id: 'w11', text: 'बन्धुः', transliteration: 'Bandhuh', startTime: 16000, endTime: 17500 },
        { id: 'w12', text: 'आत्मा', transliteration: 'Atma', startTime: 17500, endTime: 18500 },
        { id: 'w13', text: 'एव', transliteration: 'Eva', startTime: 18500, endTime: 19500 },
        { id: 'w14', text: 'रिपुः', transliteration: 'Ripuh', startTime: 19500, endTime: 20500 },
        { id: 'w15', text: 'आत्मनः', transliteration: 'Atmanah', startTime: 20500, endTime: 22000 },
      ],
    },
  ],
  tags: ['Bhagavad Gita', 'Mind Control', 'Self-Mastery', 'Meditation'],
  practiceCount: 12450,
  rating: 4.8,
};

// 21. Bhagavad Gita - Freedom from Sin (Chapter 5, Verse 10)
export const BG_FREEDOM_SIN: ShlokaData = {
  id: 'bg-freedom-sin',
  title: 'Lotus Leaf - Untouched by Water',
  subtitle: 'पद्मपत्रमिवाम्भसा',
  source: 'Bhagavad Gita 5.10',
  category: 'Bhagavad Gita',
  difficulty: 'intermediate',
  duration: 38,
  audioFile: null,
  thumbnailColor: '#4CAF50',
  description: 'This verse describes how one who acts without attachment, surrendering results to God, remains untouched by sin like a lotus leaf by water.',
  meaning: 'One who performs his duty without attachment, surrendering the results unto the Supreme God, is not affected by sinful action, as the lotus leaf is untouched by water.',
  lines: [
    {
      id: 'line-1',
      text: 'ब्रह्मण्याधाय कर्माणि सङ्गं त्यक्त्वा करोति यः',
      transliteration: 'Brahmany adhaya karmani sangam tyaktva karoti yah',
      translation: 'One who acts without attachment, dedicating actions to Brahman',
      startTime: 0,
      endTime: 10000,
      words: [
        { id: 'w1', text: 'ब्रह्मणि', transliteration: 'Brahmani', startTime: 0, endTime: 2500 },
        { id: 'w2', text: 'आधाय', transliteration: 'Adhaya', startTime: 2500, endTime: 4000 },
        { id: 'w3', text: 'कर्माणि', transliteration: 'Karmani', startTime: 4000, endTime: 5500 },
        { id: 'w4', text: 'सङ्गं', transliteration: 'Sangam', startTime: 5500, endTime: 7000 },
        { id: 'w5', text: 'त्यक्त्वा', transliteration: 'Tyaktva', startTime: 7000, endTime: 8500 },
        { id: 'w6', text: 'करोति', transliteration: 'Karoti', startTime: 8500, endTime: 9500 },
        { id: 'w7', text: 'यः', transliteration: 'Yah', startTime: 9500, endTime: 10000 },
      ],
    },
    {
      id: 'line-2',
      text: 'लिप्यते न स पापेन पद्मपत्रमिवाम्भसा',
      transliteration: 'Lipyate na sa papena padma-patram ivambhasa',
      translation: 'Is not touched by sin, like a lotus leaf by water',
      startTime: 10000,
      endTime: 19000,
      words: [
        { id: 'w8', text: 'लिप्यते', transliteration: 'Lipyate', startTime: 10000, endTime: 11500 },
        { id: 'w9', text: 'न', transliteration: 'Na', startTime: 11500, endTime: 12000 },
        { id: 'w10', text: 'स', transliteration: 'Sa', startTime: 12000, endTime: 12500 },
        { id: 'w11', text: 'पापेन', transliteration: 'Papena', startTime: 12500, endTime: 14000 },
        { id: 'w12', text: 'पद्मपत्रम्', transliteration: 'Padma-patram', startTime: 14000, endTime: 16000 },
        { id: 'w13', text: 'इव', transliteration: 'Iva', startTime: 16000, endTime: 17000 },
        { id: 'w14', text: 'अम्भसा', transliteration: 'Ambhasa', startTime: 17000, endTime: 19000 },
      ],
    },
  ],
  tags: ['Bhagavad Gita', 'Detachment', 'Karma Yoga', 'Purity'],
  practiceCount: 10320,
  rating: 4.7,
};

// 22. Bhagavad Gita - Non-Envy (Chapter 12, Verses 13-14)
export const BG_NON_ENVY: ShlokaData = {
  id: 'bg-non-envy',
  title: 'Qualities of a Dear Devotee',
  subtitle: 'अद्वेष्टा सर्वभूतानां',
  source: 'Bhagavad Gita 12.13-14',
  category: 'Bhagavad Gita',
  difficulty: 'advanced',
  duration: 60,
  audioFile: null,
  thumbnailColor: '#E91E63',
  description: 'These verses describe the divine qualities of a devotee who is very dear to Lord Krishna - free from envy, kind, equipoised, and always satisfied.',
  meaning: 'One who is not envious but who is a kind friend to all living entities, who does not think himself a proprietor, who is free from false ego and equal both in happiness and distress, who is always satisfied and engaged in devotional service with determination - he is very dear to Me.',
  lines: [
    {
      id: 'line-1',
      text: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च',
      transliteration: 'Adveshta sarva-bhutanam maitrah karuna eva ca',
      translation: 'Not envious, friendly and compassionate to all beings',
      startTime: 0,
      endTime: 11000,
      words: [
        { id: 'w1', text: 'अद्वेष्टा', transliteration: 'Adveshta', startTime: 0, endTime: 2500 },
        { id: 'w2', text: 'सर्वभूतानां', transliteration: 'Sarva-bhutanam', startTime: 2500, endTime: 5500 },
        { id: 'w3', text: 'मैत्रः', transliteration: 'Maitrah', startTime: 5500, endTime: 7500 },
        { id: 'w4', text: 'करुणः', transliteration: 'Karunah', startTime: 7500, endTime: 9000 },
        { id: 'w5', text: 'एव', transliteration: 'Eva', startTime: 9000, endTime: 10000 },
        { id: 'w6', text: 'च', transliteration: 'Ca', startTime: 10000, endTime: 11000 },
      ],
    },
    {
      id: 'line-2',
      text: 'निर्ममो निरहंकारः समदुःखसुखः क्षमी',
      transliteration: 'Nirmamo nirahankarah sama-duhkha-sukhah kshami',
      translation: 'Without possessiveness, egoless, equipoised in joy and sorrow, forgiving',
      startTime: 11000,
      endTime: 22000,
      words: [
        { id: 'w7', text: 'निर्ममः', transliteration: 'Nirmamah', startTime: 11000, endTime: 13000 },
        { id: 'w8', text: 'निरहंकारः', transliteration: 'Nirahankarah', startTime: 13000, endTime: 16000 },
        { id: 'w9', text: 'समदुःखसुखः', transliteration: 'Sama-duhkha-sukhah', startTime: 16000, endTime: 19500 },
        { id: 'w10', text: 'क्षमी', transliteration: 'Kshami', startTime: 19500, endTime: 22000 },
      ],
    },
    {
      id: 'line-3',
      text: 'सन्तुष्टः सततं योगी यतात्मा दृढनिश्चयः',
      transliteration: 'Santushtah satatam yogi yatatma dridha-nischayah',
      translation: 'Always satisfied, a yogi, self-controlled, of firm conviction',
      startTime: 22000,
      endTime: 33000,
      words: [
        { id: 'w11', text: 'सन्तुष्टः', transliteration: 'Santushtah', startTime: 22000, endTime: 24500 },
        { id: 'w12', text: 'सततं', transliteration: 'Satatam', startTime: 24500, endTime: 26500 },
        { id: 'w13', text: 'योगी', transliteration: 'Yogi', startTime: 26500, endTime: 28000 },
        { id: 'w14', text: 'यतात्मा', transliteration: 'Yatatma', startTime: 28000, endTime: 30000 },
        { id: 'w15', text: 'दृढनिश्चयः', transliteration: 'Dridha-nischayah', startTime: 30000, endTime: 33000 },
      ],
    },
    {
      id: 'line-4',
      text: 'मय्यर्पितमनोबुद्धिर्यो मद्भक्तः स मे प्रियः',
      transliteration: 'Mayy arpita-mano-buddhir yo mad-bhaktah sa me priyah',
      translation: 'With mind and intellect fixed on Me, such a devotee is dear to Me',
      startTime: 33000,
      endTime: 45000,
      words: [
        { id: 'w16', text: 'मयि', transliteration: 'Mayi', startTime: 33000, endTime: 34500 },
        { id: 'w17', text: 'अर्पितमनोबुद्धिः', transliteration: 'Arpita-mano-buddhih', startTime: 34500, endTime: 38500 },
        { id: 'w18', text: 'यः', transliteration: 'Yah', startTime: 38500, endTime: 39500 },
        { id: 'w19', text: 'मद्भक्तः', transliteration: 'Mad-bhaktah', startTime: 39500, endTime: 41500 },
        { id: 'w20', text: 'सः', transliteration: 'Sah', startTime: 41500, endTime: 42500 },
        { id: 'w21', text: 'मे', transliteration: 'Me', startTime: 42500, endTime: 43500 },
        { id: 'w22', text: 'प्रियः', transliteration: 'Priyah', startTime: 43500, endTime: 45000 },
      ],
    },
  ],
  tags: ['Bhagavad Gita', 'Devotion', 'Compassion', 'Divine Qualities'],
  practiceCount: 8920,
  rating: 4.9,
};

// 23. Bhagavad Gita - Dharma Kshetra (Chapter 1, Verse 1)
export const BG_DHARMA_KSHETRA: ShlokaData = {
  id: 'bg-dharma-kshetra',
  title: 'The Opening Verse',
  subtitle: 'धर्मक्षेत्रे कुरुक्षेत्रे',
  source: 'Bhagavad Gita 1.1',
  category: 'Bhagavad Gita',
  difficulty: 'beginner',
  duration: 35,
  audioFile: null,
  thumbnailColor: '#8BC34A',
  description: 'The very first verse of the Bhagavad Gita, where Dhritarashtra asks Sanjaya about the events on the battlefield.',
  meaning: 'Dhritarashtra said: O Sanjaya, after gathering on the holy field of Kurukshetra, and desiring to fight, what did my sons and the sons of Pandu do?',
  lines: [
    {
      id: 'line-1',
      text: 'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः',
      transliteration: 'Dharma-kshetre kuru-kshetre samaveta yuyutsavah',
      translation: 'On the holy field of Kurukshetra, assembled and eager to fight',
      startTime: 0,
      endTime: 11000,
      words: [
        { id: 'w1', text: 'धर्मक्षेत्रे', transliteration: 'Dharma-kshetre', startTime: 0, endTime: 3000 },
        { id: 'w2', text: 'कुरुक्षेत्रे', transliteration: 'Kuru-kshetre', startTime: 3000, endTime: 6000 },
        { id: 'w3', text: 'समवेताः', transliteration: 'Samavetah', startTime: 6000, endTime: 8500 },
        { id: 'w4', text: 'युयुत्सवः', transliteration: 'Yuyutsavah', startTime: 8500, endTime: 11000 },
      ],
    },
    {
      id: 'line-2',
      text: 'मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय',
      transliteration: 'Mamakah pandavas chaiva kim akurvata sanjaya',
      translation: 'What did my sons and the Pandavas do, O Sanjaya?',
      startTime: 11000,
      endTime: 22000,
      words: [
        { id: 'w5', text: 'मामकाः', transliteration: 'Mamakah', startTime: 11000, endTime: 13500 },
        { id: 'w6', text: 'पाण्डवाः', transliteration: 'Pandavah', startTime: 13500, endTime: 16000 },
        { id: 'w7', text: 'च', transliteration: 'Cha', startTime: 16000, endTime: 16500 },
        { id: 'w8', text: 'एव', transliteration: 'Eva', startTime: 16500, endTime: 17500 },
        { id: 'w9', text: 'किम्', transliteration: 'Kim', startTime: 17500, endTime: 18500 },
        { id: 'w10', text: 'अकुर्वत', transliteration: 'Akurvata', startTime: 18500, endTime: 20500 },
        { id: 'w11', text: 'सञ्जय', transliteration: 'Sanjaya', startTime: 20500, endTime: 22000 },
      ],
    },
  ],
  tags: ['Bhagavad Gita', 'Opening', 'Kurukshetra', 'Sacred Text'],
  practiceCount: 16540,
  rating: 4.9,
};

// 24. Bhagavad Gita - Karma Yoga (Chapter 3, Verse 19)
export const BG_KARMA_YOGA: ShlokaData = {
  id: 'bg-karma-yoga',
  title: 'Perform Your Duty',
  subtitle: 'कर्मण्येवाधिकारस्ते',
  source: 'Bhagavad Gita 2.47',
  category: 'Bhagavad Gita',
  difficulty: 'beginner',
  duration: 40,
  audioFile: null,
  thumbnailColor: '#FF6F00',
  description: 'One of the most famous verses from the Gita, teaching the principle of Karma Yoga - performing duty without attachment to results.',
  meaning: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself to be the cause of the results of your activities, and never be attached to not doing your duty.',
  lines: [
    {
      id: 'line-1',
      text: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      transliteration: 'Karmany evadhikaras te ma phaleshu kadachana',
      translation: 'Your right is to work only, never to the fruits thereof',
      startTime: 0,
      endTime: 11000,
      words: [
        { id: 'w1', text: 'कर्मणि', transliteration: 'Karmani', startTime: 0, endTime: 2500 },
        { id: 'w2', text: 'एव', transliteration: 'Eva', startTime: 2500, endTime: 3500 },
        { id: 'w3', text: 'अधिकारः', transliteration: 'Adhikarah', startTime: 3500, endTime: 5500 },
        { id: 'w4', text: 'ते', transliteration: 'Te', startTime: 5500, endTime: 6000 },
        { id: 'w5', text: 'मा', transliteration: 'Ma', startTime: 6000, endTime: 6500 },
        { id: 'w6', text: 'फलेषु', transliteration: 'Phaleshu', startTime: 6500, endTime: 8500 },
        { id: 'w7', text: 'कदाचन', transliteration: 'Kadachana', startTime: 8500, endTime: 11000 },
      ],
    },
    {
      id: 'line-2',
      text: 'मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि',
      transliteration: 'Ma karma-phala-hetur bhur ma te sango stv akarmani',
      translation: 'Never be the cause of results, nor be attached to inaction',
      startTime: 11000,
      endTime: 22000,
      words: [
        { id: 'w8', text: 'मा', transliteration: 'Ma', startTime: 11000, endTime: 11500 },
        { id: 'w9', text: 'कर्मफलहेतुः', transliteration: 'Karma-phala-hetuh', startTime: 11500, endTime: 15000 },
        { id: 'w10', text: 'भूः', transliteration: 'Bhuh', startTime: 15000, endTime: 16000 },
        { id: 'w11', text: 'मा', transliteration: 'Ma', startTime: 16000, endTime: 16500 },
        { id: 'w12', text: 'ते', transliteration: 'Te', startTime: 16500, endTime: 17000 },
        { id: 'w13', text: 'सङ्गः', transliteration: 'Sangah', startTime: 17000, endTime: 18500 },
        { id: 'w14', text: 'अस्तु', transliteration: 'Astu', startTime: 18500, endTime: 19500 },
        { id: 'w15', text: 'अकर्मणि', transliteration: 'Akarmani', startTime: 19500, endTime: 22000 },
      ],
    },
  ],
  tags: ['Bhagavad Gita', 'Karma Yoga', 'Duty', 'Detachment'],
  practiceCount: 19850,
  rating: 4.9,
};

// 25. Vishnu Shloka - Shantakaram
export const SHANTAKARAM_VISHNU: ShlokaData = {
  id: 'shantakaram-vishnu',
  title: 'Shantakaram Bhujagashayanam',
  subtitle: 'शान्ताकारं भुजगशयनम्',
  source: 'Traditional Vishnu Prayer',
  category: 'Devotional',
  difficulty: 'intermediate',
  duration: 45,
  audioFile: null,
  thumbnailColor: '#1976D2',
  description: 'A beautiful prayer to Lord Vishnu, describing His serene form resting on the serpent Adishesha.',
  meaning: 'I bow to Lord Vishnu who is peaceful in form, who reclines on the serpent, from whose navel the lotus springs, who is the Lord of all gods, the support of the universe, vast as the sky, dark as the clouds, with a beautiful body, the consort of Lakshmi, with lotus-like eyes, whom yogis contemplate in meditation.',
  lines: [
    {
      id: 'line-1',
      text: 'शान्ताकारं भुजगशयनं पद्मनाभं सुरेशम्',
      transliteration: 'Shantakaram bhujaga-shayanam padmanabham suresham',
      translation: 'Peaceful form, reclining on serpent, lotus-naveled, Lord of gods',
      startTime: 0,
      endTime: 11000,
      words: [
        { id: 'w1', text: 'शान्ताकारं', transliteration: 'Shantakaram', startTime: 0, endTime: 3000 },
        { id: 'w2', text: 'भुजगशयनं', transliteration: 'Bhujaga-shayanam', startTime: 3000, endTime: 6000 },
        { id: 'w3', text: 'पद्मनाभं', transliteration: 'Padmanabham', startTime: 6000, endTime: 8500 },
        { id: 'w4', text: 'सुरेशम्', transliteration: 'Suresham', startTime: 8500, endTime: 11000 },
      ],
    },
    {
      id: 'line-2',
      text: 'विश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्',
      transliteration: 'Vishvadharam gagana-sadrisham megha-varnam shubhangam',
      translation: 'Support of universe, vast as sky, cloud-colored, beautiful-bodied',
      startTime: 11000,
      endTime: 22000,
      words: [
        { id: 'w5', text: 'विश्वाधारं', transliteration: 'Vishvadharam', startTime: 11000, endTime: 13500 },
        { id: 'w6', text: 'गगनसदृशं', transliteration: 'Gagana-sadrisham', startTime: 13500, endTime: 16500 },
        { id: 'w7', text: 'मेघवर्णं', transliteration: 'Megha-varnam', startTime: 16500, endTime: 19000 },
        { id: 'w8', text: 'शुभाङ्गम्', transliteration: 'Shubhangam', startTime: 19000, endTime: 22000 },
      ],
    },
    {
      id: 'line-3',
      text: 'लक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यम्',
      transliteration: 'Lakshmi-kantam kamala-nayanam yogibhir dhyana-gamyam',
      translation: 'Consort of Lakshmi, lotus-eyed, attainable through yogic meditation',
      startTime: 22000,
      endTime: 33000,
      words: [
        { id: 'w9', text: 'लक्ष्मीकान्तं', transliteration: 'Lakshmi-kantam', startTime: 22000, endTime: 25000 },
        { id: 'w10', text: 'कमलनयनं', transliteration: 'Kamala-nayanam', startTime: 25000, endTime: 28000 },
        { id: 'w11', text: 'योगिभिः', transliteration: 'Yogibhih', startTime: 28000, endTime: 30000 },
        { id: 'w12', text: 'ध्यानगम्यम्', transliteration: 'Dhyana-gamyam', startTime: 30000, endTime: 33000 },
      ],
    },
    {
      id: 'line-4',
      text: 'वन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम्',
      transliteration: 'Vande Vishnum bhava-bhaya-haram sarva-lokaika-natham',
      translation: 'I bow to Vishnu, remover of worldly fears, Lord of all worlds',
      startTime: 33000,
      endTime: 45000,
      words: [
        { id: 'w13', text: 'वन्दे', transliteration: 'Vande', startTime: 33000, endTime: 35000 },
        { id: 'w14', text: 'विष्णुं', transliteration: 'Vishnum', startTime: 35000, endTime: 37000 },
        { id: 'w15', text: 'भवभयहरं', transliteration: 'Bhava-bhaya-haram', startTime: 37000, endTime: 40000 },
        { id: 'w16', text: 'सर्वलोकैकनाथम्', transliteration: 'Sarva-lokaika-natham', startTime: 40000, endTime: 45000 },
      ],
    },
  ],
  tags: ['Vishnu', 'Devotional', 'Peace', 'Meditation'],
  practiceCount: 11240,
  rating: 4.8,
};

// 26. Ganesha Shloka - Sukhlam Bharadharam
export const SUKLAM_BHARADHARAM: ShlokaData = {
  id: 'suklam-bharadharam',
  title: 'Suklam Bharadharam Vishnum',
  subtitle: 'शुक्लाम्बरधरं विष्णुम्',
  source: 'Traditional Ganesha Prayer',
  category: 'Devotional',
  difficulty: 'beginner',
  duration: 35,
  audioFile: null,
  thumbnailColor: '#FFA726',
  description: 'A popular prayer to Lord Ganesha, describing His divine attributes and seeking His blessings to remove all obstacles.',
  meaning: 'I bow to Lord Ganesha who wears white garments, who is all-pervading, who has a bright complexion like the moon, who has four arms, who has a pleasant countenance. May all obstacles be removed.',
  lines: [
    {
      id: 'line-1',
      text: 'शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम्',
      transliteration: 'Shuklambaradharam Vishnum shashi-varnam chatur-bhujam',
      translation: 'White-robed, all-pervading, moon-colored, four-armed',
      startTime: 0,
      endTime: 11000,
      words: [
        { id: 'w1', text: 'शुक्लाम्बरधरं', transliteration: 'Shuklambaradharam', startTime: 0, endTime: 3500 },
        { id: 'w2', text: 'विष्णुं', transliteration: 'Vishnum', startTime: 3500, endTime: 5500 },
        { id: 'w3', text: 'शशिवर्णं', transliteration: 'Shashi-varnam', startTime: 5500, endTime: 8000 },
        { id: 'w4', text: 'चतुर्भुजम्', transliteration: 'Chatur-bhujam', startTime: 8000, endTime: 11000 },
      ],
    },
    {
      id: 'line-2',
      text: 'प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये',
      transliteration: 'Prasanna-vadanam dhyayet sarva-vighnopaShantaye',
      translation: 'Pleasant-faced, I meditate upon for removal of all obstacles',
      startTime: 11000,
      endTime: 22000,
      words: [
        { id: 'w5', text: 'प्रसन्नवदनं', transliteration: 'Prasanna-vadanam', startTime: 11000, endTime: 14500 },
        { id: 'w6', text: 'ध्यायेत्', transliteration: 'Dhyayet', startTime: 14500, endTime: 16500 },
        { id: 'w7', text: 'सर्वविघ्नोपशान्तये', transliteration: 'Sarva-vighnopaShantaye', startTime: 16500, endTime: 22000 },
      ],
    },
  ],
  tags: ['Ganesha', 'Devotional', 'Obstacles', 'Beginning'],
  practiceCount: 17320,
  rating: 4.9,
};

// 27. Lakshmi Ashtakam - Opening Verse
export const LAKSHMI_NAMASTHESTHU: ShlokaData = {
  id: 'lakshmi-namasthesthu',
  title: 'Lakshmi Namasthesthu',
  subtitle: 'नमस्तेस्तु महामाये',
  source: 'Lakshmi Ashtakam',
  category: 'Devotional',
  difficulty: 'intermediate',
  duration: 40,
  audioFile: null,
  thumbnailColor: '#D84315',
  description: 'A powerful prayer to Goddess Lakshmi, the goddess of wealth, prosperity, and abundance.',
  meaning: 'Salutations to you O Mahamaya, the great illusory power, the source of wealth and prosperity, salutations to you O Lakshmi, the consort of Vishnu.',
  lines: [
    {
      id: 'line-1',
      text: 'नमस्तेस्तु महामाये श्रीपीठे सुरपूजिते',
      transliteration: 'Namastesthu mahamaye shri-pithe sura-pujite',
      translation: 'Salutations to you O great illusion, seated on lotus, worshipped by gods',
      startTime: 0,
      endTime: 10000,
      words: [
        { id: 'w1', text: 'नमस्तेस्तु', transliteration: 'Namastesthu', startTime: 0, endTime: 2500 },
        { id: 'w2', text: 'महामाये', transliteration: 'Mahamaye', startTime: 2500, endTime: 5000 },
        { id: 'w3', text: 'श्रीपीठे', transliteration: 'Shri-pithe', startTime: 5000, endTime: 7000 },
        { id: 'w4', text: 'सुरपूजिते', transliteration: 'Sura-pujite', startTime: 7000, endTime: 10000 },
      ],
    },
    {
      id: 'line-2',
      text: 'शङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते',
      transliteration: 'Shankha-chakra-gada-haste maha-lakshmi namostute',
      translation: 'Holding conch, discus and mace, O Mahalakshmi, salutations to you',
      startTime: 10000,
      endTime: 20000,
      words: [
        { id: 'w5', text: 'शङ्खचक्रगदाहस्ते', transliteration: 'Shankha-chakra-gada-haste', startTime: 10000, endTime: 14500 },
        { id: 'w6', text: 'महालक्ष्मि', transliteration: 'Maha-lakshmi', startTime: 14500, endTime: 17000 },
        { id: 'w7', text: 'नमोऽस्तु', transliteration: 'Namostute', startTime: 17000, endTime: 18500 },
        { id: 'w8', text: 'ते', transliteration: 'Te', startTime: 18500, endTime: 20000 },
      ],
    },
  ],
  tags: ['Lakshmi', 'Wealth', 'Prosperity', 'Devotional'],
  practiceCount: 10540,
  rating: 4.7,
};

// 28. Rama Shloka - Manojavam
export const MANOJAVAM_HANUMAN: ShlokaData = {
  id: 'manojavam-hanuman',
  title: 'Manojavam Maruta Tulya Vegam',
  subtitle: 'मनोजवं मारुततुल्यवेगम्',
  source: 'Ramayana - Yuddha Kanda',
  category: 'Devotional',
  difficulty: 'advanced',
  duration: 50,
  audioFile: null,
  thumbnailColor: '#F44336',
  description: 'A powerful prayer to Lord Hanuman, describing His incredible qualities and seeking His blessings for success.',
  meaning: 'Swift as mind, fast as wind, master of senses, intelligent, son of the wind god, chief of the monkey army, messenger of Rama - to such Hanuman I bow.',
  lines: [
    {
      id: 'line-1',
      text: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्',
      transliteration: 'Manojavam maruta-tulya-vegam jitendriyam buddhi-matam varishtham',
      translation: 'Swift as mind, fast as wind, master of senses, best among the wise',
      startTime: 0,
      endTime: 13000,
      words: [
        { id: 'w1', text: 'मनोजवं', transliteration: 'Manojavam', startTime: 0, endTime: 2500 },
        { id: 'w2', text: 'मारुततुल्यवेगं', transliteration: 'Maruta-tulya-vegam', startTime: 2500, endTime: 6000 },
        { id: 'w3', text: 'जितेन्द्रियं', transliteration: 'Jitendriyam', startTime: 6000, endTime: 8500 },
        { id: 'w4', text: 'बुद्धिमतां', transliteration: 'Buddhi-matam', startTime: 8500, endTime: 10500 },
        { id: 'w5', text: 'वरिष्ठम्', transliteration: 'Varishtham', startTime: 10500, endTime: 13000 },
      ],
    },
    {
      id: 'line-2',
      text: 'वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये',
      transliteration: 'Vatatmajam vanara-yutha-mukhyam shri-rama-dutam sharanam prapadye',
      translation: 'Son of wind, chief of monkey army, messenger of Rama, I surrender to you',
      startTime: 13000,
      endTime: 26000,
      words: [
        { id: 'w6', text: 'वातात्मजं', transliteration: 'Vatatmajam', startTime: 13000, endTime: 16000 },
        { id: 'w7', text: 'वानरयूथमुख्यं', transliteration: 'Vanara-yutha-mukhyam', startTime: 16000, endTime: 20000 },
        { id: 'w8', text: 'श्रीरामदूतं', transliteration: 'Shri-rama-dutam', startTime: 20000, endTime: 22500 },
        { id: 'w9', text: 'शरणं', transliteration: 'Sharanam', startTime: 22500, endTime: 24000 },
        { id: 'w10', text: 'प्रपद्ये', transliteration: 'Prapadye', startTime: 24000, endTime: 26000 },
      ],
    },
  ],
  tags: ['Hanuman', 'Ramayana', 'Strength', 'Devotion'],
  practiceCount: 13890,
  rating: 4.8,
};

// 29. Krishna Shloka - Vasudeva Sutam
export const VASUDEVA_SUTAM: ShlokaData = {
  id: 'vasudeva-sutam',
  title: 'Vasudeva Sutam Devam',
  subtitle: 'वासुदेवसुतं देवम्',
  source: 'Vishnu Purana',
  category: 'Devotional',
  difficulty: 'intermediate',
  duration: 38,
  audioFile: null,
  thumbnailColor: '#512DA8',
  description: 'A beautiful prayer to Lord Krishna, describing Him as the divine son of Vasudeva and the destroyer of demons.',
  meaning: 'I bow to Lord Krishna, son of Vasudeva, the destroyer of Kamsa and Chanura, the supreme source of bliss for Devaki.',
  lines: [
    {
      id: 'line-1',
      text: 'वासुदेवसुतं देवं कंसचाणूरमर्दनम्',
      transliteration: 'Vasudeva-sutam devam kamsa-chanura-mardanam',
      translation: 'Divine son of Vasudeva, destroyer of Kamsa and Chanura',
      startTime: 0,
      endTime: 10000,
      words: [
        { id: 'w1', text: 'वासुदेवसुतं', transliteration: 'Vasudeva-sutam', startTime: 0, endTime: 3500 },
        { id: 'w2', text: 'देवं', transliteration: 'Devam', startTime: 3500, endTime: 5000 },
        { id: 'w3', text: 'कंसचाणूरमर्दनम्', transliteration: 'Kamsa-chanura-mardanam', startTime: 5000, endTime: 10000 },
      ],
    },
    {
      id: 'line-2',
      text: 'देवकीपरमानन्दं कृष्णं वन्दे जगद्गुरुम्',
      transliteration: 'Devaki-paramanandom krishnam vande jagad-gurum',
      translation: 'Supreme bliss of Devaki, Krishna, I bow to the world teacher',
      startTime: 10000,
      endTime: 19000,
      words: [
        { id: 'w4', text: 'देवकीपरमानन्दं', transliteration: 'Devaki-paramanandom', startTime: 10000, endTime: 14000 },
        { id: 'w5', text: 'कृष्णं', transliteration: 'Krishnam', startTime: 14000, endTime: 15500 },
        { id: 'w6', text: 'वन्दे', transliteration: 'Vande', startTime: 15500, endTime: 16500 },
        { id: 'w7', text: 'जगद्गुरुम्', transliteration: 'Jagad-gurum', startTime: 16500, endTime: 19000 },
      ],
    },
  ],
  tags: ['Krishna', 'Devotional', 'Divine', 'Vishnu Avatara'],
  practiceCount: 12110,
  rating: 4.8,
};

// 30. Shiva Shloka - Mrityunjaya
export const KARPUR_GAURAM: ShlokaData = {
  id: 'karpur-gauram',
  title: 'Karpur Gauram Karunavtaram',
  subtitle: 'कर्पूरगौरं करुणावतारम्',
  source: 'Shiva Mahapurana',
  category: 'Devotional',
  difficulty: 'intermediate',
  duration: 45,
  audioFile: null,
  thumbnailColor: '#616161',
  description: 'A beautiful prayer to Lord Shiva, describing His divine form and compassionate nature.',
  meaning: 'White as camphor, the incarnation of compassion, the essence of worldly existence, adorned with the king of serpents as a garland, ever present in the lotus of the heart - to that Shiva I bow.',
  lines: [
    {
      id: 'line-1',
      text: 'कर्पूरगौरं करुणावतारं संसारसारं भुजगेन्द्रहारम्',
      transliteration: 'Karpur-gauram karuna-vataram samsara-saram bhujagendra-haram',
      translation: 'White as camphor, incarnation of compassion, essence of existence, wearing serpent garland',
      startTime: 0,
      endTime: 12000,
      words: [
        { id: 'w1', text: 'कर्पूरगौरं', transliteration: 'Karpur-gauram', startTime: 0, endTime: 3000 },
        { id: 'w2', text: 'करुणावतारं', transliteration: 'Karuna-vataram', startTime: 3000, endTime: 6000 },
        { id: 'w3', text: 'संसारसारं', transliteration: 'Samsara-saram', startTime: 6000, endTime: 9000 },
        { id: 'w4', text: 'भुजगेन्द्रहारम्', transliteration: 'Bhujagendra-haram', startTime: 9000, endTime: 12000 },
      ],
    },
    {
      id: 'line-2',
      text: 'सदा वसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि',
      transliteration: 'Sada vasantam hridaya-ravinde bhavam bhavani-sahitam namami',
      translation: 'Ever dwelling in the lotus of the heart, with Parvati, I bow to Shiva',
      startTime: 12000,
      endTime: 24000,
      words: [
        { id: 'w5', text: 'सदा', transliteration: 'Sada', startTime: 12000, endTime: 13500 },
        { id: 'w6', text: 'वसन्तं', transliteration: 'Vasantam', startTime: 13500, endTime: 15500 },
        { id: 'w7', text: 'हृदयारविन्दे', transliteration: 'Hridaya-ravinde', startTime: 15500, endTime: 18500 },
        { id: 'w8', text: 'भवं', transliteration: 'Bhavam', startTime: 18500, endTime: 20000 },
        { id: 'w9', text: 'भवानीसहितं', transliteration: 'Bhavani-sahitam', startTime: 20000, endTime: 22500 },
        { id: 'w10', text: 'नमामि', transliteration: 'Namami', startTime: 22500, endTime: 24000 },
      ],
    },
  ],
  tags: ['Shiva', 'Devotional', 'Compassion', 'Meditation'],
  practiceCount: 10780,
  rating: 4.8,
};

// All Shlokas Collection
export const ALL_SHLOKAS: ShlokaData[] = [
  GAYATRI_MANTRA,
  MAHAMRITYUNJAYA_MANTRA,
  SHANTI_MANTRA,
  VAKRATUNDA_SHLOKA,
  ASATO_MA_MANTRA,
  SARASWATI_VANDANA,
  OM_NAMAH_SHIVAYA,
  GURU_BRAHMA,
  HARE_KRISHNA_MANTRA,
  HANUMAN_CHALISA_OPENING,
  LAKSHMI_MANTRA,
  DURGA_MANTRA,
  VISHNU_MANTRA,
  YA_DEVI_MANTRA,
  SURYA_MANTRA,
  AUM_MANTRA,
  BG_STEADY_MIND,
  BG_LIBERATION_ANGER,
  BG_ARJUNA_SURRENDER,
  BG_MIND_CONTROL,
  BG_FREEDOM_SIN,
  BG_NON_ENVY,
  BG_DHARMA_KSHETRA,
  BG_KARMA_YOGA,
  SHANTAKARAM_VISHNU,
  SUKLAM_BHARADHARAM,
  LAKSHMI_NAMASTHESTHU,
  MANOJAVAM_HANUMAN,
  VASUDEVA_SUTAM,
  KARPUR_GAURAM,
];

// Categories
export const SHLOKA_CATEGORIES = [
  { id: 'all', name: 'All', icon: 'view-grid', count: ALL_SHLOKAS.length },
  { id: 'vedic', name: 'Vedic Mantras', icon: 'book-open-variant', count: 4 },
  { id: 'upanishadic', name: 'Upanishadic', icon: 'lightbulb-on', count: 2 },
  { id: 'devotional', name: 'Devotional', icon: 'hands-pray', count: 18 },
  { id: 'bhagavad-gita', name: 'Bhagavad Gita', icon: 'book', count: 8 },
];

// Difficulty Filters
export const DIFFICULTY_LEVELS = [
  { id: 'all', name: 'All Levels', color: '#888' },
  { id: 'beginner', name: 'Beginner', color: '#4CAF50' },
  { id: 'intermediate', name: 'Intermediate', color: '#FF9800' },
  { id: 'advanced', name: 'Advanced', color: '#F44336' },
  { id: 'expert', name: 'Expert', color: '#9C27B0' },
];

// Get shlokas by category
export const getShlokasByCategory = (category: string): ShlokaData[] => {
  if (category === 'all') return ALL_SHLOKAS;
  return ALL_SHLOKAS.filter(
    (shloka) => shloka.category.toLowerCase().includes(category.toLowerCase())
  );
};

// Get shlokas by difficulty
export const getShlokasByDifficulty = (difficulty: string): ShlokaData[] => {
  if (difficulty === 'all') return ALL_SHLOKAS;
  return ALL_SHLOKAS.filter((shloka) => shloka.difficulty === difficulty);
};

// Search shlokas
export const searchShlokas = (query: string): ShlokaData[] => {
  const lowerQuery = query.toLowerCase();
  return ALL_SHLOKAS.filter(
    (shloka) =>
      shloka.title.toLowerCase().includes(lowerQuery) ||
      shloka.subtitle.includes(query) ||
      shloka.source.toLowerCase().includes(lowerQuery) ||
      shloka.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

// Featured Shlokas (for home carousel)
export const FEATURED_SHLOKAS = [
  GAYATRI_MANTRA,
  BG_KARMA_YOGA,
  MAHAMRITYUNJAYA_MANTRA,
  SHANTAKARAM_VISHNU,
  VAKRATUNDA_SHLOKA,
  MANOJAVAM_HANUMAN,
];

// Recently Added (mock)
export const RECENT_SHLOKAS = [
  BG_DHARMA_KSHETRA,
  BG_KARMA_YOGA,
  SHANTAKARAM_VISHNU,
  LAKSHMI_NAMASTHESTHU,
  VASUDEVA_SUTAM,
  KARPUR_GAURAM,
];

// Popular Shlokas (sorted by practice count)
export const POPULAR_SHLOKAS = [...ALL_SHLOKAS].sort((a, b) => b.practiceCount - a.practiceCount);
