export const mockHistory = [
  {
    id: 1,
    date: '2026-06-15T14:30:00',
    preview: '"Hello, I need help with my prescription" — Translated to ISL signs for the pharmacist',
    phrase: 'Hello, I need help with my prescription',
  },
  {
    id: 2,
    date: '2026-06-14T10:15:00',
    preview: '"Good morning, class. Today we will learn about photosynthesis" — Classroom session',
    phrase: 'Good morning class',
  },
  {
    id: 3,
    date: '2026-06-13T16:45:00',
    preview: '"Thank you for your help. See you tomorrow" — Counter conversation at the post office',
    phrase: 'Thank you',
  },
  {
    id: 4,
    date: '2026-06-12T09:00:00',
    preview: '"My name is Aarav. I am here for the interview" — Job interview preparation',
    phrase: 'My name is Aarav',
  },
  {
    id: 5,
    date: '2026-06-11T13:20:00',
    preview: '"Can you please repeat that slowly?" — Practice session for common phrases',
    phrase: 'Please repeat',
  },
]

export const mockDictionary = [
  { id: 1, word: 'Hello', synonyms: ['Hi', 'Hey', 'Greetings'], animationFile: 'hello.glb', status: 'mapped' },
  { id: 2, word: 'Thank you', synonyms: ['Thanks', 'Grateful'], animationFile: 'thankyou.glb', status: 'mapped' },
  { id: 3, word: 'Please', synonyms: ['Kindly'], animationFile: 'please.glb', status: 'mapped' },
  { id: 4, word: 'Yes', synonyms: ['Okay', 'Sure', 'Agreed'], animationFile: 'yes.glb', status: 'mapped' },
  { id: 5, word: 'No', synonyms: ['Nope', 'Negative'], animationFile: 'no.glb', status: 'mapped' },
  { id: 6, word: 'Help', synonyms: ['Assist', 'Support'], animationFile: 'help.glb', status: 'mapped' },
  { id: 7, word: 'Sorry', synonyms: ['Apologies', 'Excuse me'], animationFile: 'sorry.glb', status: 'mapped' },
  { id: 8, word: 'Good morning', synonyms: ['Morning'], animationFile: 'goodmorning.glb', status: 'mapped' },
  { id: 9, word: 'Goodbye', synonyms: ['Bye', 'See you'], animationFile: null, status: 'missing' },
  { id: 10, word: 'Water', synonyms: ['Drink'], animationFile: null, status: 'missing' },
  { id: 11, word: 'Food', synonyms: ['Eat', 'Meal'], animationFile: 'food.glb', status: 'mapped' },
  { id: 12, word: 'Doctor', synonyms: ['Physician', 'Medical'], animationFile: null, status: 'missing' },
  { id: 13, word: 'School', synonyms: ['Class', 'Education'], animationFile: 'school.glb', status: 'mapped' },
  { id: 14, word: 'Family', synonyms: ['Home', 'Parents'], animationFile: 'family.glb', status: 'mapped' },
  { id: 15, word: 'Friend', synonyms: ['Buddy', 'Companion'], animationFile: null, status: 'missing' },
]

export const mockMetrics = {
  latency: {
    label: 'Translation Latency',
    current: '142ms',
    data: [180, 165, 155, 148, 142, 150, 138, 145, 142, 140, 135, 142],
  },
  yoloFps: {
    label: 'YOLO FPS',
    current: '28',
    data: [24, 26, 28, 27, 29, 28, 30, 28, 27, 28, 29, 28],
  },
  systemHealth: {
    label: 'System Health',
    status: 'healthy', // 'healthy' | 'warning' | 'error'
    uptime: '99.7%',
  },
  retraining: {
    label: 'Model Retraining',
    status: 'Training',
    epoch: 4,
    totalEpochs: 10,
    progress: 40,
  },
  translations: {
    label: 'Live Translations',
    current: '1,247',
    data: [80, 95, 110, 105, 120, 115, 130, 125, 140, 135, 128, 132],
  },
}

export const dialects = [
  { value: 'ISL', label: 'ISL — Indian Sign Language' },
  { value: 'ASL', label: 'ASL — American Sign Language' },
  { value: 'BSL', label: 'BSL — British Sign Language' },
  { value: 'Auslan', label: 'Auslan — Australian Sign Language' },
  { value: 'JSL', label: 'JSL — Japanese Sign Language' },
]

export const contextPresets = [
  {
    id: 'everyday',
    name: 'Everyday',
    description: 'General conversation for daily interactions and casual chat',
  },
  {
    id: 'medical',
    name: 'Medical',
    description: 'Optimizes for clinical terms and patient phrases',
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Classroom vocabulary and academic discussion terms',
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Legal terminology and formal procedural language',
  },
]

export const skinTones = ['#F5D0A9', '#E0B896', '#C69C7B', '#A67C5B', '#8B6340', '#5C3D2E']
export const outfitColors = ['#3FD6C0', '#7C8CFF', '#F87171', '#FBBF24']
