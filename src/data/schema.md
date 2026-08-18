# GK Quest — Question Data Schema

Every day of the 90-day journey is one JSON file: `day-01.json` … `day-90.json`, stored in `/src/data`.
This document is the **contract** every day file must follow. Generators and the quiz engine both rely on it.

## Top-level shape

```jsonc
{
  "day": 1,                 // integer 1–90
  "world": 1,               // 1 = Bharat Basics (1–30), 2 = World Explorer (31–60), 3 = Champion's Arena (61–90)
  "theme": "Getting to know India — national symbols",  // the day's theme, exactly as in the curriculum
  "isBoss": false,          // true for BOSS quizzes and MONTH GRAND REVIEW / GRAND FINALE days
  "questions": [ /* array of Question objects, see below */ ]
}
```

### Rules for the top level
- **12 questions** on a normal day.
- **15 questions** when `isBoss` is `true` (Boss quizzes, Grand Reviews, Grand Finale).
- Boss/Review/Finale days set `"isBoss": true`.

## Question object

Every question has these fields. Fields not used by a given `type` are still present and set to `null`
(this keeps the shape uniform so the engine never has to guess).

```jsonc
{
  "id": "d1q1",             // unique within the file: "d" + day + "q" + questionNumber
  "type": "mcq",            // mcq | truefalse | image_mcq | match | fill_blank | odd_one_out | sequence
  "question": "What is the national animal of India?",
  "options": ["Tiger", "Lion", "Elephant", "Peacock"],  // see per-type rules
  "answer": "Tiger",        // see per-type rules; null for match/sequence
  "pairs": null,            // only for "match"; otherwise null
  "sequence": null,         // only for "sequence"; otherwise null
  "image": null,            // optional image filename/URL (mainly image_mcq); otherwise null
  "difficulty": "easy",     // easy | medium | hard
  "funFact": "The Royal Bengal Tiger became India's national animal in 1973.",  // REQUIRED, short, true
  "topic": "National Symbols"  // short topic tag for the Parent Dashboard's strengths/weaknesses
}
```

## Field rules by `type`

| type          | `options`                              | `answer`                                  | `pairs`                                   | `sequence`                        | `image`        |
|---------------|----------------------------------------|-------------------------------------------|-------------------------------------------|-----------------------------------|----------------|
| `mcq`         | 4 strings, exactly one correct         | the correct option string (must match one of `options`) | `null`                    | `null`                            | `null`         |
| `truefalse`   | `["True", "False"]`                    | `"True"` or `"False"`                      | `null`                                    | `null`                            | `null`         |
| `image_mcq`   | 4 strings, one correct                 | correct option string                      | `null`                                    | `null`                            | filename/URL (required) |
| `fill_blank`  | word bank (3–4 strings incl. answer)   | the correct word (must match one of `options`); the `question` contains `___` | `null`         | `null`                            | `null`         |
| `odd_one_out` | 4 strings, one that doesn't belong     | the odd-one-out string (must match one of `options`) | `null`                        | `null`                            | `null`         |
| `match`       | `null`                                 | `null`                                     | 3–4 objects `{"left": "...", "right": "..."}` (correct pairing) | `null`      | `null`         |
| `sequence`    | the items to arrange (in any order)    | `null`                                     | `null`                                    | the correct ordered array of strings | `null`      |

### Notes
- **`mcq`, `image_mcq`, `odd_one_out`** always have exactly **4 options**.
- **`fill_blank`**: the `question` string must contain `___` where the blank is. `options` is a small word bank containing the answer plus plausible distractors.
- **`match`**: `options` and `answer` are `null`. The engine shuffles the `right` values; the child taps to reconnect them to the correct `left`. Use 3–4 pairs.
- **`sequence`**: `answer` is `null`. `options` holds the items (order doesn't matter — the engine shuffles them); `sequence` holds the single correct order.
- **`image_mcq`**: `image` points to an asset in `/src/assets` (e.g. `"symbols/flag.png"`) or a URL. Until real art exists, a placeholder path is fine.

## Content rules (every question)
- **`funFact` is mandatory**, short (one sentence), and **factually true**.
- Language and difficulty suit a **bright ~10-year-old in India** (Class 5 and a little beyond).
- Answers must be **factually correct and unambiguous** — no trick wording, no two defensible answers.
- **India-first**: lean on India/Haryana context where natural.
- Mix **3–4 different `type`s** within each day so no two questions in a row feel identical.
- Difficulty spread within a day is fine (mostly `easy`/`medium` early in the journey, more `hard` later and on boss days).
- Distractors should be plausible but clearly wrong to someone who knows the fact.

## Difficulty guidance across the journey
- **World 1 (Days 1–30):** mostly `easy`, some `medium`.
- **World 2 (Days 31–60):** `easy`/`medium`, occasional `hard`.
- **World 3 (Days 61–90):** more `medium`/`hard`; boss & finale days lean harder.
- Topics **repeat at higher difficulty** later (e.g. capitals are `easy` in Week 2, `hard` in Week 11).

## Current-affairs files (Days 68–74, plus the "leaders now" Day 72)
These go stale. When generating them, add a top-level `lastUpdated` date field and keep facts dated:
```jsonc
{ "day": 68, "world": 3, "theme": "...", "isBoss": false,
  "lastUpdated": "2026-07-26",   // date the facts were verified; regenerate every couple of months
  "questions": [ ... ] }
```
`lastUpdated` (an ISO `YYYY-MM-DD` date) is **only** used on the current-affairs day files
(68–74) and the leaders Day 72; omit it on all other days. Before regenerating these, re-verify
current office-holders (President, Vice President, PM, Haryana CM, Chief Justice) and recent
sports/space/awards events against up-to-date sources. Questions that name a living office-holder
say "(as of YYYY)" in the text so a stale answer is obvious.
