# ISL Translation Specification

## Summary

This document defines the grammar mapping conventions, sentence translation rules, and Non-Manual Marker (NMM) specifications for translating English text into Indian Sign Language (ISL) within the SignBridge platform. The translation engine converts English S-V-O (Subject-Verb-Object) sentences into ISL S-O-V (Subject-Object-Verb) gloss sequences, strips auxiliary words, applies tense markers, and triggers appropriate facial expressions for grammatical accuracy.

---

## Findings

### 1. ISL Syntax Structure

ISL follows a **Subject-Object-Verb (SOV)** word order, unlike English S-V-O.

| Component | English Order | ISL Order |
|-----------|--------------|-----------|
| Subject | Position 1 | Position 1 |
| Verb | Position 2 | Position 3 |
| Object | Position 3 | Position 2 |

**Example**:
- English: "I eat rice"
- ISL Gloss: `I RICE EAT`

### 2. Auxiliary Word Omission

The following English words are stripped during translation:

| Category | Words to Strip |
|----------|---------------|
| Helping Verbs | is, am, are, was, were, has, have, had |
| Articles | a, an, the |
| Prepositions | on, in, at, to, for (context-dependent) |
| Conjunctions | and, or, but (context-dependent) |

**Example**:
- English: "The cat is sleeping on the table"
- ISL Gloss: `TABLE CAT SLEEP`

### 3. Tense Markers

Tense is expressed through time markers placed at the beginning or end of the sentence:

| English Tense | ISL Marker | Position |
|---------------|-----------|----------|
| Past Simple | YESTERDAY / PAST | Beginning |
| Past Continuous | YESTERDAY / BEFORE | Beginning |
| Present Simple | (none) | — |
| Present Continuous | NOW | Beginning |
| Future Simple | TOMORROW / FUTURE | Beginning |
| Future Continuous | TOMORROW / LATER | Beginning |

**Examples**:
- "I went to school" → `YESTERDAY I SCHOOL GO`
- "I will go to school" → `TOMORROW I SCHOOL GO`
- "I am eating" → `NOW I EAT`

### 4. Negation

Negation is placed at the **end** of the sentence using the sign `NOT`.

| English | ISL Gloss |
|---------|-----------|
| I don't like it | I LIKE NOT |
| She is not coming | SHE COME NOT |
| They cannot swim | THEY SWIM NOT |

### 5. Question Formation

| Question Type | ISL Structure | NMM Required |
|---------------|--------------|--------------|
| Yes/No Questions | Subject + Object + Verb + ? | Eyebrows Raised |
| WH-Questions (Who, What, Where, Why, When) | WH-word + Subject + Object + Verb | Eyebrows Furrowed |
| Tag Questions | Statement + RIGHT? | Head Tilt + Eyebrows Raised |

**Examples**:
- "Do you like coffee?" → `YOU COFFEE LIKE ?` (Eyebrows Raised)
- "Where is the book?" → `WHERE BOOK ?` (Eyebrows Furrowed)

### 6. Non-Manual Markers (NMMs)

Facial expressions and head movements are **grammatical requirements**, not optional enhancements.

| NMM | Trigger | Description |
|-----|---------|-------------|
| Eyebrows Raised | Yes/No questions | Raise eyebrows during entire question |
| Eyebrows Furrowed | WH-questions | Furrow brows during WH-word and question |
| Head Nod | Affirmation | Single nod at end of affirmative statement |
| Head Shake | Negation | Single shake at end of negative statement |
| Mouth Morpheme | Specific signs | Lip patterns accompanying certain signs |
| Eye Gaze | Referencing | Look toward referenced object/person |
| Head Tilt | Conditional clauses | Tilt head during "if" statements |

### 7. Finger-Spelling Rules

| Use Case | Method |
|----------|--------|
| Proper nouns (names, places) | Finger-spell each letter |
| Technical terms without ISL sign | Finger-spell or use initialization |
| Common concepts | Use dedicated ISL sign (gloss) |

**Finger-spelling alphabet**: 26 letters of the English alphabet, each with a distinct handshape.

### 8. Sign Vocabulary Glosses

Common ISL glosses for frequently used concepts:

| English | ISL Gloss | Notes |
|---------|-----------|-------|
| Hello | HELLO | Wave gesture |
| Thank you | THANK-YOU | Hand from chin forward |
| Please | PLEASE | Palm on chest, circular motion |
| Yes | YES | Fist nod motion |
| No | NO | Index + middle + thumb flick |
| Help | HELP | Fist on palm, lift motion |
| Water | WATER | W-hand from chin |
| Food | FOOD | Fingertips to mouth |
| Home | HOME | Touch cheek, then make roof shape |
| School | SCHOOL | Clap hands twice |
| Doctor | DOCTOR | Tap wrist (pulse) |
| Good | GOOD | Thumbs up from palm |
| Bad | BAD | Flick fingers from palm downward |

---

## Recommendations

### Translation Engine Architecture

1. **Tokenization Pipeline**: Split English input into word tokens
2. **Strip Auxiliary Words**: Remove articles, helping verbs, prepositions
3. **Identify Tense**: Detect time markers and prepend ISL tense gloss
4. **Rearrange to SOV**: Reorder tokens from S-V-O to S-O-V
5. **Apply NMMs**: Attach facial expression triggers based on sentence type
6. **Output Gloss Array**: Return ordered array of gloss tokens with metadata

### Gloss Output Format

```json
{
  "sentence": "I will go to school tomorrow",
  "glosses": [
    { "token": "TOMORROW", "type": "tense-marker", "nmm": null },
    { "token": "I", "type": "subject", "nmm": null },
    { "token": "SCHOOL", "type": "object", "nmm": null },
    { "token": "GO", "type": "verb", "nmm": null }
  ],
  "nmm": {
    "eyebrows": "neutral",
    "head": "neutral",
    "gaze": "forward"
  }
}
```

### Performance Considerations

- Pre-compute common phrase mappings for frequently used sentences
- Cache dictionary lookups for repeated gloss lookups
- Use token array output for direct AnimationMixer key mapping

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Ambiguous word meanings | Incorrect sign selection | Use context presets (medical, legal, education) to disambiguate |
| Missing glosses for new words | Finger-spelling fallback | Implement auto-finger-spell for unknown tokens |
| Regional ISL variations | Inconsistent signs | Support dialect selection in settings |
| Complex sentence structures | Parsing failures | Break compound sentences into simple clauses |
| Idiomatic expressions | Literal translation errors | Build idiom dictionary for common expressions |

---

## References

1. **Indian Sign Language Research and Training Centre (ISLRTC)** — Official ISL grammar documentation
2. **SignBSL.com** — British Sign Language reference (comparable SOV structure)
3. **Gallaudet University** — Sign language linguistics research
4. **Three.js Documentation** — SkinnedMesh and AnimationMixer API
5. **GLTF Specification** — Animation clip format for avatar gestures

---

## Deliverable Checklist

- [x] Research specification `docs/isl_translation_spec.md` completed and saved
- [x] Translation templates cover common S-V-O sentence conversions
- [x] Facial grammar triggers are documented
- [x] Output format defined for AnimationMixer integration
- [x] Risks identified with mitigations
