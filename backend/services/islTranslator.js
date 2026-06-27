const AUXILIARY_WORDS = new Set([
  'is', 'am', 'are', 'was', 'were', 'has', 'have', 'had',
  'a', 'an', 'the',
  'on', 'in', 'at', 'to', 'for',
  'and', 'or', 'but'
])

const TENSE_MARKERS = {
  pastSimple: ['yesterday', 'past'],
  pastContinuous: ['yesterday', 'before'],
  presentContinuous: ['now'],
  futureSimple: ['tomorrow', 'future'],
  futureContinuous: ['tomorrow', 'later']
}

const PAST_INDICATORS = ['yesterday', 'ago', 'last', 'before', 'earlier', 'past']
const FUTURE_INDICATORS = ['tomorrow', 'will', 'shall', 'later', 'soon', 'future', 'next']
const CONTINUOUS_INDICATORS = ['ing', 'now', 'currently', 'right now']

const QUESTION_WORDS = ['who', 'what', 'where', 'when', 'why', 'how']
const NEGATION_WORDS = ['not', "don't", "doesn't", "didn't", "won't", "can't", "cannot", "never"]

const ISL_VOCABULARY = new Set([
  'hello', 'thank', 'you', 'please', 'yes', 'no', 'help',
  'water', 'food', 'home', 'school', 'doctor', 'good', 'bad',
  'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'eat', 'drink', 'go', 'come', 'see', 'look', 'walk',
  'run', 'stop', 'give', 'take', 'make', 'do', 'say',
  'like', 'want', 'need', 'know', 'think', 'feel', 'love',
  'book', 'pen', 'table', 'chair', 'door', 'window', 'car',
  'man', 'woman', 'child', 'friend', 'family', 'mother', 'father',
  'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'
])

function detectTense(tokens) {
  const lowerTokens = tokens.map(t => t.toLowerCase())

  for (const indicator of PAST_INDICATORS) {
    if (lowerTokens.includes(indicator)) {
      return 'pastSimple'
    }
  }

  for (const indicator of FUTURE_INDICATORS) {
    if (lowerTokens.includes(indicator)) {
      return 'futureSimple'
    }
  }

  for (const indicator of CONTINUOUS_INDICATORS) {
    if (lowerTokens.includes(indicator)) {
      return 'presentContinuous'
    }
  }

  if (lowerTokens.some(t => t.endsWith('ing'))) {
    return 'presentContinuous'
  }

  return null
}

function detectQuestionType(tokens) {
  const lowerTokens = tokens.map(t => t.toLowerCase())

  if (lowerTokens.some(t => QUESTION_WORDS.includes(t))) {
    return 'wh_question'
  }

  const lastToken = lowerTokens[lowerTokens.length - 1]
  if (lastToken === '?' || lowerTokens.includes('right')) {
    return 'yes_no_question'
  }

  return null
}

function detectNegation(tokens) {
  const lowerTokens = tokens.map(t => t.toLowerCase())
  return lowerTokens.some(t => NEGATION_WORDS.includes(t))
}

function stripAuxiliaryWords(tokens) {
  return tokens.filter(token => !AUXILIARY_WORDS.has(token.toLowerCase()))
}

function removeTenseIndicators(tokens) {
  return tokens.filter(token => {
    const lower = token.toLowerCase()
    return !PAST_INDICATORS.includes(lower) &&
           !FUTURE_INDICATORS.includes(lower) &&
           !CONTINUOUS_INDICATORS.includes(lower) &&
           !lower.endsWith('ing')
  })
}

function moveToSOV(tokens, subject, verb, objects) {
  const result = []
  if (subject) result.push(subject)
  result.push(...objects)
  if (verb) result.push(verb)
  return result
}

function findSubjectVerbObject(tokens) {
  const pronouns = ['i', 'you', 'he', 'she', 'it', 'we', 'they']
  const lowerTokens = tokens.map(t => t.toLowerCase())

  let subject = null
  let verb = null
  const objects = []

  for (let i = 0; i < lowerTokens.length; i++) {
    if (pronouns.includes(lowerTokens[i]) && !subject) {
      subject = tokens[i]
    } else if (ISL_VOCABULARY.has(lowerTokens[i]) && !verb) {
      verb = tokens[i]
    } else if (ISL_VOCABULARY.has(lowerTokens[i])) {
      objects.push(tokens[i])
    }
  }

  return { subject, verb, objects }
}

function buildGlosses(tokens, tense, questionType, isNegation) {
  const glosses = []

  if (tense) {
    const markers = TENSE_MARKERS[tense]
    markers.forEach(marker => {
      glosses.push({
        token: marker.toUpperCase(),
        type: 'tense-marker',
        nmm: null
      })
    })
  }

  tokens.forEach(token => {
    const upper = token.toUpperCase()
    let type = 'content'
    let nmm = null

    if (['I', 'YOU', 'HE', 'SHE', 'IT', 'WE', 'THEY'].includes(upper)) {
      type = 'subject'
    } else if (['EAT', 'DRINK', 'GO', 'COME', 'SEE', 'WALK', 'RUN', 'STOP', 'GIVE', 'TAKE', 'MAKE', 'DO', 'SAY', 'LIKE', 'WANT', 'NEED', 'KNOW', 'THINK', 'FEEL', 'LOVE'].includes(upper)) {
      type = 'verb'
    } else {
      type = 'object'
    }

    glosses.push({ token: upper, type, nmm })
  })

  if (isNegation) {
    glosses.push({
      token: 'NOT',
      type: 'negation',
      nmm: null
    })
  }

  return glosses
}

function buildNMM(questionType, isNegation) {
  const nmm = {
    eyebrows: 'neutral',
    head: 'neutral',
    gaze: 'forward'
  }

  if (questionType === 'yes_no_question') {
    nmm.eyebrows = 'raised'
    nmm.head = 'tilted-forward'
  } else if (questionType === 'wh_question') {
    nmm.eyebrows = 'furrowed'
    nmm.head = 'tilted'
  }

  if (isNegation) {
    nmm.head = 'shaking'
    nmm.eyebrows = 'furrowed'
  }

  return nmm
}

export function translateToISL(sentence) {
  if (!sentence || typeof sentence !== 'string') {
    throw new Error('Input must be a non-empty string')
  }

  const cleaned = sentence.replace(/[!?]+$/g, '').trim()
  if (!cleaned) {
    throw new Error('Input sentence is empty after cleaning')
  }

  const rawTokens = cleaned.split(/\s+/)
  const lowerTokens = rawTokens.map(t => t.toLowerCase())

  const questionType = detectQuestionType(rawTokens)
  const isNegation = detectNegation(rawTokens)
  const tense = detectTense(rawTokens)

  let filteredTokens = stripAuxiliaryWords(rawTokens)
  filteredTokens = removeTenseIndicators(filteredTokens)

  if (isNegation) {
    filteredTokens = filteredTokens.filter(t => !NEGATION_WORDS.includes(t.toLowerCase()))
  }

  const { subject, verb, objects } = findSubjectVerbObject(filteredTokens)
  let reorderedTokens = moveToSOV(filteredTokens, subject, verb, objects)

  if (reorderedTokens.length === 0) {
    reorderedTokens = filteredTokens
  }

  const glosses = buildGlosses(reorderedTokens, tense, questionType, isNegation)
  const nmm = buildNMM(questionType, isNegation)

  return {
    sentence: sentence,
    glosses: glosses,
    nmm: nmm,
    metadata: {
      tense: tense,
      questionType: questionType,
      isNegation: isNegation,
      tokenCount: glosses.length
    }
  }
}

export function getAvailableGlosses() {
  return Array.from(ISL_VOCABULARY).sort()
}
