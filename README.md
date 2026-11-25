# Ear Trainer

A scale-degree ear-training app that runs in the browser, built for one learner (Steve) and used mainly as an
iPhone home-screen web app. Live at https://autodax.github.io/ear/.

This page is for anyone, human or AI, who is taking over the project. Read it first, then `CLAUDE.md` (working
rules) and `notes/ear.md` (every decision, lesson learned and pending idea, in detail).

## The goal

Steve wants to **hear a melody and play it on a keyboard in any key**, all the way to melodic dictation. The route
there is not interval drills or absolute pitch. It is hearing every note by its **function in the key**: its scale
degree, 1 to 7.

The method follows Alain Benbassat's *Functional Ear Trainer*:

1. A **cadence** (a short chord progression) establishes the key.
2. A note or phrase plays.
3. You name it as scale degrees (numbers, never solfège).
4. After the answer it **resolves** stepwise to the nearest home note, so you feel where it wants to go.

Everything is heard in the context of a key. There are no isolated two-note interval drills.

## Philosophy (why it behaves the way it does)

- **Gradual, not fast.** Steve repeatedly found that the jumps (single notes to phrases, phrases to melodies) were
  too steep. The ladder has many small steps, and mastery needs plenty of answers on two separate days. When in
  doubt, add a smaller step rather than a harder level.
- **No stress.** There is no response-time feedback and no speed test. Speed is only graded in rhythm levels,
  where timing is the lesson. Wrong answers get a calm replay (cadence, then the right answer), not a penalty.
- **Narrow first, then widen.** Start with 1 3 5 in one key, then pentatonic, then the full scale; add keys and
  octaves in small steps so the ear never leans on C. Major comes first; other modes are a Settings choice that
  repeats the whole ladder with its own progress.
- **Number pad for every lesson, for now.** Answers are scale degrees on a pad. A piano keyboard and learning to
  find notes on it are planned as their own lessons later (the drawing code is still in the app).
- **No singing, no isolated intervals.** Steve tried the idea and removed it: it did not help him name degrees.
- **Steve stays in control.** No level is locked; any level can be practiced at any time. Mastering a level only
  offers to go on. One cadence style, chosen in Settings, applies on every level.
- **Calm, readable look.** Blue palette (sky blue to periwinkle on dark blue), no green anywhere. Correct is pale
  ice blue, wrong is a subdued orange.
- **Evidence-aware but modest.** `notes/ear.md` summarizes what the research says (thin) and which parts are
  Steve's decisions and which are guesses. Only Steve's stated decisions are recorded as decisions.

## How practice works

- **Training** (Train tab): rounds of questions in one key, with a cadence first. About 30% of questions drill the
  most-confused degree pair, about 20% review mastered levels. A level in its first five days gets a gentler start
  (notes about 20% slower, more review of the level before).
- **Phrase stepping stones:** the phrase plays in full and some notes are shown on screen; you press every note in
  order, and shown notes light up as you press them. This works from two notes up to the whole phrase.
- **After an answer:** single notes resolve to the home note. Phrases, chords and melodies replay once and do not
  resolve. After a miss the cadence plays again, then the answer.
- **Mastery:** the last 40 answers (30 for multi-note levels) at the target accuracy, with every degree strong,
  confirmed again on a later day.
- **Car mode:** hands-free listening with the cadence repeating, mixing in confused pairs.
- **Progress:** per-level bars, trouble spots, history, export/import, and optional private GitHub gist sync.

## The ladder (42 levels, in teaching order)

1. Single notes: 1 3 5
2. Phrases: two notes, first one shown
3. Phrases: two notes, last one shown
4. Phrases: two notes, 1 3 5
5. Phrases: three notes, first two shown
6. Phrases: three notes, last two shown
7. Phrases: three notes, first and last shown
8. Phrases: three notes, first one shown
9. Phrases: three notes, last one shown
10. Phrases: three notes, 1 3 5
11. Rhythm phrases: two notes, 1 3 5
12. Rhythm phrases: three notes, 1 3 5
13. Phrases over a chord: 1 3 5
14. Single notes: add 2 and 6
15. Single notes: add 4
16. Single notes: add 7, full scale
17. Single notes: new key every round
18. Single notes: three octaves
19. Phrases: two notes, 1 3 5, any key
20. Phrases: three notes, 1 3 5, any key
21. Phrases: two notes
22. Phrases: three notes
23. Phrases: four notes
24. Phrases: five notes
25. Phrases: six notes
26. Chromatic: one outside note
27. Chromatic: two outside notes
28. Chromatic: four outside notes
29. Chromatic: all twelve notes
30. Chromatic: three-note phrases
31. Chord roots: 1 and 5
32. Chord roots: 1, 4, 5
33. Chord roots: all seven
34. Chord roots: inversions
35. Chord tones: one at a time
36. Chord tones: together, 1 4 5 chords
37. Chord tones: together, any chord
38. Tap the rhythm: quarter and eighth notes
39. Tap the rhythm: off-beats
40. Melody with rhythm: two notes
41. Melody with rhythm: three notes
42. Melody with rhythm: five notes

Every level has a permanent `id`; progress is saved by id, so levels can be added, moved or retired without losing
anyone's progress. Never reuse an id for a different level.

## How it is built

- One self-contained file, `index.html` (HTML, CSS and JavaScript together). No build step, no server, no
  framework. Pushing to `main` publishes through GitHub Pages within a minute or two.
- Piano sound: Salamander Grand Piano samples in `piano/` (CC BY 3.0, credited in the app). A service worker
  (`ear-sw.js`) caches everything so the home-screen app works offline.
- Progress is saved on the device (`localStorage`) in a versioned file format that can grow while old files still
  load; see "The progress file" in `notes/ear.md`.
- Voice answers (speaking the number) are an optional experiment that uses Safari's speech recognition.
- **Every release bumps `APP_VERSION`** in `index.html`, or installed copies will not update. The version number is
  always reported to Steve when something is pushed.

## Working with Steve

- Steve does not read code. Explain changes in plain language: what he will see and do, never code.
- For simple choice questions, use clickable choice buttons rather than plain-text questions. When a choice is visual, show a few options side by side.
- Do the work, test it, push it, then say briefly what changed and what he must do (usually: swipe the app away and
  reopen it).
- He uses an iPhone (mobile first, 402 × 874 viewport; the home-screen app reports 402 × 812). iPhone behaviours
  that cost real time are recorded in `notes/ear.md` ("iPhone lessons"); read them before touching layout or audio.
- Keep these notes current in the same commit as the change. This repo is public: no personal details, accounts or
  tokens.

## Open questions and ideas

- Rhythm levels and the "Melody with rhythm" levels have not been tried on a phone; expect tuning.
- Cadences and chord sounds in the less common modes were checked by looking at the notes, not by ear.
- A later landscape piano keyboard and lessons on finding notes on it; artwork is in `assets/`.
- Possible: easier steps for the later phrase levels (over a chord, any key, longer phrases), familiar-tune anchors
  for the hard degrees (4 and 7), more time on pentatonic in new keys.
