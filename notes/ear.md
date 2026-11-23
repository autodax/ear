# Ear Trainer (index.html)

Live at https://autodax.github.io/ear/ (own repo `autodax/ear`, moved here from `autodax.github.io` on Nov 22 2026). Steve uses it as a home-screen web app on his iPhone.

Scale-degree ear training in the style of Functional Ear Trainer (Alain Benbassat's method): a
cadence sets the key, a note plays, you name its scale degree, then the note resolves stepwise to
the nearest tonic. The goal is to hear a melody and play it on a keyboard in any key, all the way
to melodic dictation.

## Files

- `index.html`: the whole app.
- `ear-sw.js`: Service Worker that caches the page, icons, manifest, and all 30 piano samples so the iPhone home-screen app launches and plays offline (scope `/ear/`).
- `piano/`: Salamander Grand Piano samples (CC BY 3.0, Alexander Holm, velocity layer 8),
  AAC `.m4a` named by MIDI note number (21 = A0 … 108 = C8), one every 3 keys. Credit is in
  `piano/README.md` and in the app's Settings.
- `icon-180.png`, `icon-512.png`: blue eighth note (one flag) on pure black (was orange). Icon links carry `?v=5`; bump it when the icon changes.
- `manifest.json`: home-screen web app settings.

## Decisions (Steve's)

- Answers as numbers 1–7, never solfège. The number pad shows 1 2 3 4 / 5 6 7 1 (upper 1 counts as 1).
- Major keys until fully mastered, then minor and modes. Chords later; design for them.
- Resolution goes to the nearest tonic: 1–4 step down, 5–7 step up.
  The number pad lights up in step with the resolving notes: top row (1 2 3 4) right to left, bottom row (5 6 7 and the upper 1) left to right. On the keyboard the resolving keys light the same way (the keys shown always include 1 and the upper 1 and every note the question and resolution play, so the heard note is always tappable; `pianoWindow()`).
- The key stays fixed for a round of questions (no "new key every note"). Round length is
  adjustable, 10–30 (default 12; Steve wants at least 10). Key and, on one-octave levels, octave
  (below / middle / above) change together at the round boundary, and the cadence moves with them.
  Review questions from earlier levels use the round's key and octave (they used to jump to C or
  another octave in between, which felt chaotic). On three-octave and phrase levels review questions stay in the middle octave.
- New keys come before more octaves in the ladder.
- Every octave range is bracketed by the home note (1) at both ends: one octave is 1 to the upper 1, three octaves run from 1 an octave
  below the middle to 1 two octaves above it (two and four octaves likewise; Car mode too). Phrase and keyboard levels use a window around the tonic that is not bracketed.
- Start with number answers; later require playing the melody on the keyboard in the key heard.
- Keyboard input works on any level: a 123 Pad / Keys button at the top right of the training screen (and Settings → Keyboard → Answer with) overrides the level's own input method (`answerWith`: level, pad or piano). Any octave counts. Answers count toward the same mastery stats.
- Voice answers (experiment, Nov 2026): Settings → Voice has "Answer by voice" and a Test button. Uses Safari's speech recognition; spoken numbers (one/won, two/to/too, four/for…) press the number pad. Only for number-pad questions; a 🎤 marker shows while listening. The mic stays on from the first voice question until Stop / the Start screen / app backgrounded (Steve's choice: switching it on and off per question glitched the notes). Spoken results are ignored outside the answering phase. Uses interim results (acts on the first number word, faster than waiting for the final); only the top guess of each result counts, each result (utterance) can answer once, and an utterance that began before the question's tone is ignored (Steve saw 5 answered as 6 by itself, Nov 21 2026; cause unconfirmed, see Settings → Voice → Voice log), and the response time runs to when speech began (`onspeechstart`), not to when it was recognized. On the first question the mic is switched on before the cadence so iOS's audio-mode change doesn't swallow it. With voice on the audio session is `play-and-record` (`audioType()`) and the notes get a loudness boost (`voiceBoost`, default 1.5, a slider, `masterGain()`; a "Match volume" button plays a chord with the mic off then on so he can set it by ear. It cannot be automatic: the web can't measure the speaker level) because iOS plays quieter with the mic open. Untested on the phone. Unknown whether it works in the home-screen app (WebKit reports conflict); Steve asked to keep it only if it works. To remove: delete the `VOICE ANSWERS` block, the Voice card in `renderSettings`, the `masterGain`/`audioType` helpers and the `// VOICE` hook lines.
- Car mode: cadence, then note → pause → resolution, with the cadence repeating every N notes
  (adjustable), also mixing in top confused pairs from training (~30% of notes when active). No spoken numbers (removed at his request). Ranges: 1, 2, 3 or 4 octaves.
- Cadence styles (Settings → Training → Cadence style): `I-IV-V-I` (default), `V7-I`, `ii7-V7-I`, `I`, `IM7`, `several tonics`, and `tonic`. Applies to both Train and Car modes.
- Resolution styles (Settings → Training → Resolution style): `Nearest tonic, stepwise` (default), `Always down to 1`, `Always up to 1↑`, `Skip by thirds` (e.g. `6-4-2-1`), `Jump straight to tonic`, and `Tonic first, then walk`. Applies to both Train and Car modes.
- Response timing toggle (Settings → Training → Response timing): hides the response-time numbers and "aim for under X s" speed nudges while keeping the simple "Yes!" / "Nice" feedback and background speed tracking.
- Blue look instead of yellow/orange: accent #7eabff (gradient end #5a86ee), background #101321, panels #191f33 / #232a42 (picked from three options between sky blue and periwinkle). The "review" tag is violet, "drill" is blue. No green anywhere (Steve dislikes it): correct is pale ice blue #bfe3ff, wrong is a subdued orange #d9895a. Colors are the variables at the top of the stylesheet.
- Piano sound: Salamander full quality (chosen by ear over Splendid Grand and MusyngKite).
- Response time is counted from the START of the tone (the last note's start for phrases); the goal is 2 seconds, the default speed limit (setting "Speed for mastery"). Steve first asked for end-of-tone timing, then found it too short and set 2 s from the tone start as the goal (flag `timingV3` resets old settings to 2 once). Voice answers count to when speech began (`onspeechstart`); if Safari doesn't report it, a "voice delay allowance" (`voiceLag`, default 1.3 s, slider) is subtracted from the recognized time. (The on-screen timing readout was removed once it was calibrated; calibration stays in Settings → Voice. Steve's phone, Nov 21 2026: Safari in the home-screen app NEVER reports speech start, so the allowance always applies; raw recognized times were 2.0–2.8 s for instant answers, so the default is now 1.3 s. Settings → Voice → Measure the delay: tap and say "one" together, 3 rounds, sets the allowance from the average). Times saved earlier used a mix of the two methods.
- Wrong answer: a short low error tone (`A.error()`), a pause (~0.45 s), then the correct note (replayed phrase for phrases) and the resolution. Setting "Error sound" in Settings → Sound (default on).
- Skip ahead (Settings → Levels) marks earlier levels as skipped (counts as done); "Undo skipping" (`bUnskip`) turns skipped levels back to unmastered and relocks levels above the highest one actually earned. Stats are kept either way.
- Pentatonic first: levels 1–2 use only 1 2 3 5 6; 4 and 7 come after (levels 3–4).
- A break reminder after a set time of practice (setting, default 10 min; "Take a break" or "Keep going").
- No isolated interval drills (two notes with no key). Everything is heard in the context of a key.
- Stop, "Done for today" and "Take a break" release the iPhone's audio channel (so the app leaves the
  Dynamic Island and lock screen) and go back to the Start screen; tapping "Tap to begin" brings audio back.
  iOS apps can't quit themselves, so releasing the audio is the most the app can do.
- iPhone only for now. Sing-back mode is wanted later.
- Sync: a private GitHub gist, one user. Multi-user sign-in (Firebase) was discussed and put off.
- No redirect pages when renaming (he removed music.html rather than redirect it).

## Level ladder (LEVELS in index.html)

1. Home base: 1 3 5 · 2. Add 2 and 6 (pentatonic: 1 2 3 5 6) · 3. Add 4 · 4. Add 7, full major scale (all key of C, one octave)
5. New key every round (one octave) · 6. Three octaves, new key every round
7–9. Two-, three-, four-note phrases (numbers)
10–14. Keyboard ("Play it"): single notes, 2, 3, 4 notes, then 6-note melodic dictation
Shown as "coming later": minor & modes, chromatic notes, chord tones, sing-back, rhythm.

Mastery: last 20 answers (15 for phrases) at ≥90% (80% for phrases), every degree ≥75% recently,
typical correct answer under the speed limit (2 s from the start of the tone by default, adjustable). About 30% of questions
drill the most-confused pair (5→6 and 6→5 are pooled into one 5–6 pair, both for drilling in Train and Car modes and in the Progress → Trouble spots list; `topConfusionPairs()`); about 20% are review from mastered levels.

## Research summary (searched Nov 2026; thin evidence, treat as hints)

No head-to-head study of "best" scale-degree progressions exists. What is known:
- Variety in practice material helps strong listeners but can hurt weaker ones, so start narrow
  (one key, few notes) and widen as skill grows. This matches the ladder.
- Learning transfers partly, but some of it stays tied to the trained conditions, so vary key,
  octave and register.
- Short sessions spread out beat long ones (one lab study found sessions under about 8 minutes
  gave the best latent learning; spaced beat massed in a hearing-training study). Basis for the break reminder.
- Mixing plain listening with active practice helped musical-interval learning. Supports Car mode.
- Interval identification and working memory predict melodic dictation success, which is why phrases
  grow one note at a time. (Correlation, not proof that drilling intervals causes dictation skill.)
- Relative pitch and scale-degree hearing are the right target; researchers argue it gets too little
  emphasis next to absolute pitch.
- Teachers' practice (surveys, not tests): simple to complex, stay on pentatonic material a long time,
  teach scale-degree function, use familiar melodies, prepare by singing. Backs pentatonic-first and sing-back.
- Isolated intervals: no strong support. Researchers noted decades ago that ear training studied
  intervals outside context although context changes how they are heard (Shatzkin 1981; Wapnick et al. 1982;
  Telesco, "Contextual Ear Training", J. Music Theory Pedagogy). Interval learning is trainable and
  can generalize (practice plus exposure study), but there is little research on good regimens.
  Teachers argue the same interval sounds different at different places in a key.
- Ideas from this that are not built: familiar-tune anchors for hard degrees (4, 7), more time on
  pentatonic in new keys before adding 4 and 7.

## How index.html is organized

Sections are marked with `/* ===== … ===== */` banners, in this order: theory data (scale-step
positions `s`, `posMidi`, `resolution`, `cadence`), LEVELS, state and storage, audio engine `A`,
adaptive engine, Train mode, Car mode, UI (header, Settings, Progress), sync, boot.

- Progress: localStorage `music.ear.v1`. `save()` marks a local change (sets `S.updatedAt`);
  `saveRaw()` doesn't.
- Sync token and gist id: localStorage `music.ear.sync`, never in progress files, exports or the gist.
  Gist file `ear-trainer-progress.json`. Every write checks the gist first; if both sides
  changed, the user picks which to keep. Pushes every 10 answers, on Stop, and when leaving the app.
- Audio: nearest sample within 3 semitones, otherwise a simple synth. Release time depends on
  pitch (bass rings longer). Samples are cached (Cache Storage `music-samples-v2`).

## Every release

- Bump `APP_VERSION` (format `YYYY-MM-DD.N`). Installed copies compare it to decide to update.
  Without a bump, Steve's phone won't pick up the change.
- Updates load from `?v=<version>` on the app's own address and try only once per version (sessionStorage
  `ear.updateTried`). A plain reload can return iOS's cached old page and loop forever.

## iPhone lessons (home-screen web app)

- The app reports a viewport one status bar shorter than the screen (812 on an 874 screen), and
  the bottom ~62 pt gets painted but not drawn. `fitHeight()` extends the app only when
  `innerHeight + top inset == screen height` at zoom 1, and the tab bar sits above that dead
  zone (`--deadzone`). Don't guess heights: earlier attempts pushed the tab bar off-screen.
- iOS blurs the status-bar area: the header gets extra top padding in home-screen mode (`.standalone`).
- Form controls under 16 px make iOS zoom in, and the zoom can stick. Keep inputs and selects at
  16 px; viewport has `maximum-scale=1`; `resetZoom()` runs at start and after editing.
  Safari's per-site Page Zoom (Settings → Apps → Safari → Page Zoom) also changes the layout.
- The home-screen app has its own storage, separate from Safari tabs. Removing the icon deletes
  its data, so export or sync first. The icon image is saved when added; a new icon needs the
  app removed and re-added.
- A playing audio session shows in the Dynamic Island and on the lock screen. `A.release()` removes the
  silent looping element entirely (a merely paused one stays on the lock screen), sets `audioSession.type` to `auto` and closes the AudioContext (suspending it was not enough; decoded samples are kept); `A.engage()`
  rebuilds it (`A.build()`) and runs from the Start/Begin taps and from `A.seq`/`A.note`. Not testable in headless Chrome
  beyond the states; check on the phone after changing it.
  Even after a full release the lock screen still lists the app, like any music app that has played
  (iOS keeps the last media app there). Steve accepted that; don't spend more effort trying to remove it.
- All screens share one scrolling area (`main`). Coming back from a long Settings page could leave the Train screen blank or scrolled off the top, so `showView()` resets the scroll to the top (and briefly hides overflow to stop iOS momentum). Not reproducible in headless Chrome; confirm on the phone.
- Web Audio is muted by the silent switch unless routed as playback (`navigator.audioSession`
  plus a looping silent audio element). Web apps pause when the screen locks, so Car mode keeps
  the screen on. Web MIDI isn't available on iOS.

## Pending ideas (not yet decided or built)

- Functional Ear Trainer features Steve wants to compare against: auto-advance choices (after correct / mistake / giving up) and octave markers on answers. (Keyboard input on any level, cadence styles, resolution styles, separate cadence/notes/resolution speeds, and the Give up button are built.)
- Keyboard levels: whether to require the exact octave, and a landscape keyboard with about
  three octaves. Steve will decide when he reaches the keyboard levels.
- Minor keys and modes, chromatic notes, chords, sing-back, rhythm in dictation.
