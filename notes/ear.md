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
- `icon-180.png`, `icon-512.png`: the two-tone blue ear (light blue ear, cobalt notes, black background), chosen by Steve Nov 24 2026. The `icons/` folder keeps the variants he supplied (two-tone blue, orange ear with blue notes, orange ear with light blue notes; 180 and 512 px each); to switch, copy a variant over the two root files and bump `?v=`. Icon links carry `?v=8` (index.html, manifest.json, ear-sw.js); bump it when the icon changes. `A.engage()` also sets the media-session artwork (the same icon) for the lock screen and Dynamic Island; whether iOS shows it there is unconfirmed.
- `assets/`: piano keyboard artwork Steve supplied Nov 24 2026 for a possible landscape layout (warm ivory and neutral white, each with a reference version showing two keys pressed, one black and one white, and a plain template). Not used by the app yet, and not cached by the service worker.
- `manifest.json`: home-screen web app settings.
- Toolbar icons (Train, Car, Progress, Settings): filled shapes supplied by Steve (Nov 24 2026), drawn in the page and coloured by the tab's text colour (blue when selected).

## Decisions (Steve's)

- Answers as numbers 1–7, never solfège. The number pad shows 1 2 3 4 / 5 6 7 1 (upper 1 counts as 1).
- Major keys through the whole ladder (single notes, phrases, chromatic notes, chords, rhythm); other modes are a Settings choice with their own mastery (Steve, Nov 23 2026).
- No singing (Nov 24 2026): Steve had the four Sing back levels and the whole microphone-pitch feature removed; it did not help him learn scale degrees. Old progress for those levels stays in saved files (kept as unknown ids). Voice answers (speaking the number) are a separate feature and stay.
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
- Answers are on the number pad for every lesson for now; a keyboard lesson comes later (see the Nov 24 2026 decision below).
- (Replaced Nov 24 2026: there is no keyboard answer option for now.)
- Voice answers (experiment, Nov 2026): Settings → Voice has "Answer by voice" and a Test button. Uses Safari's speech recognition; spoken numbers (one/won, two/to/too, four/for…) press the number pad. Only for number-pad questions; a 🎤 marker shows while listening. The mic stays on from the first voice question until Stop / the Start screen / app backgrounded (Steve's choice: switching it on and off per question glitched the notes). Spoken results are ignored outside the answering phase. Uses interim results (acts on the first number word, faster than waiting for the final); only the top guess of each result counts, each result (utterance) can answer once, and an utterance that began before the question's tone is ignored (Steve saw 5 answered as 6 by itself, Nov 21 2026; cause unconfirmed, see Settings → Voice → Voice log), and the response time runs to when speech began (`onspeechstart`), not to when it was recognized. On the first question the mic is switched on before the cadence so iOS's audio-mode change doesn't swallow it. With voice on the audio session is `play-and-record` (`audioType()`) and the notes get a loudness boost (`voiceBoost`, default 1.5, a slider, `masterGain()`; a "Match volume" button plays a chord with the mic off then on so he can set it by ear. It cannot be automatic: the web can't measure the speaker level) because iOS plays quieter with the mic open. Untested on the phone. Unknown whether it works in the home-screen app (WebKit reports conflict); Steve asked to keep it only if it works. To remove: delete the `VOICE ANSWERS` block, the Voice card in `renderSettings`, the `masterGain`/`audioType` helpers and the `// VOICE` hook lines.
- Car mode: cadence, then note → pause → resolution, with the cadence repeating every N notes
  (adjustable), also mixing in top confused pairs from training (~30% of notes when active). No spoken numbers (removed at his request). Ranges: 1, 2, 3 or 4 octaves.
- Cadence styles (Settings → Training → Cadence style): `I-IV-V-I` (default), `I-V-I`, `V7-I`, `ii7-V7-I`, `I`, `IM7`, `several tonics`, and `tonic`. Applies to both Train and Car modes.
- Resolution styles (Settings → Training → Resolution style): `Nearest tonic, stepwise` (default), `Always down to 1`, `Always up to 1↑`, `Skip by thirds` (e.g. `6-4-2-1`), `Jump straight to tonic`, and `Tonic first, then walk`. Applies to both Train and Car modes.
- No response-timing feedback (Steve, Nov 24 2026: it only creates stress, and speed isn't the lesson unless the lesson is rhythm). Removed: the "Response timing" and "Speed for mastery" settings, the seconds shown after a correct answer, the speed line under the progress bar, and the speed test for mastery. Answers still record a time in the history, but nothing uses it. Rhythm and tap levels still grade the spacing of taps; that is the lesson there.
- Blue look instead of yellow/orange: accent #7eabff (gradient end #5a86ee), background #101321, panels #191f33 / #232a42 (picked from three options between sky blue and periwinkle). The "review" tag is violet, "drill" is blue. No green anywhere (Steve dislikes it): correct is pale ice blue #bfe3ff, wrong is a subdued orange #d9895a. Colors are the variables at the top of the stylesheet.
- Piano sound: Salamander full quality (chosen by ear over Splendid Grand and MusyngKite).
- Response time is counted from the START of the tone (the last note's start for phrases); (no speed goal any more, see above). Steve first asked for end-of-tone timing, then found it too short and set 2 s from the tone start as the goal (flag `timingV3` resets old settings to 2 once). Voice answers count to when speech began (`onspeechstart`); if Safari doesn't report it, a "voice delay allowance" (`voiceLag`, default 1.3 s, slider) is subtracted from the recognized time. (The on-screen timing readout was removed once it was calibrated; calibration stays in Settings → Voice. Steve's phone, Nov 21 2026: Safari in the home-screen app NEVER reports speech start, so the allowance always applies; raw recognized times were 2.0–2.8 s for instant answers, so the default is now 1.3 s. Settings → Voice → Measure the delay: tap and say "one" together, 3 rounds, sets the allowance from the average). Times saved earlier used a mix of the two methods.
- Wrong answer: a short low error tone (`A.error()`), a pause (~0.45 s), then the correct note (replayed phrase for phrases) and the resolution. Setting "Error sound" in Settings → Sound (default on).
- Steve's request (Nov 23 2026): bring short melodies, rhythm and harmony into the early levels as soon as he can reliably hear 1, 3 and 5, with a reset of his progress (the first ladder is archived in the file); a progress file that can grow with future changes and the modes while old files still load; add the last mode (Locrian) and show "(Ionian)" and "(Aeolian)" after Major and Minor. The four points: (1) 1 3 5 in major, keep single notes, then two- and three-note echoes; (2) simple rhythm early with short piano phrases; (3) harmony alongside melody with I–V–I and I–IV–V–I; (4) "Play this phrase in another key" with separate feedback on melodic contour (up, down, same).
- No level locking (Steve's decision, Nov 23 2026): every level can be practiced any time (Progress → Practice). Mastering a level only marks it done and offers "Go to the next level" or "Stay on this level"; it never moves him on by itself. Skip ahead and Undo skipping were removed; old `skipped` marks still count as done. `S.unlocked` is still written, unused, so the progress file keeps its shape.
- Shared stats (my design, he agreed): the Progress degree bars, trouble spots and drilling only take answers from mastered levels and the first unmastered one (`nextLevel()`, `sharedStats()`); dabbling on a harder level counts only toward that level's own score. Review questions still come only from mastered earlier levels.
- Pentatonic first: before the pentatonic level, 1 3 5 only (levels 1–8); then 2 and 6; 4 and 7 come after.
- A break reminder after a set time of practice (setting, default 10 min; "Take a break" or "Keep going").
- No isolated interval drills (two notes with no key). Everything is heard in the context of a key.
- Stop, "Done for today" and "Take a break" release the iPhone's audio channel (so the app leaves the
  Dynamic Island and lock screen) and go back to the Train screen's idle state; tapping Start brings audio back.
- No start screen (Steve's decision, Nov 23 2026): the app opens straight onto Train. Piano samples download and are decoded at once with a throwaway audio engine (`A.decodeEarly()`); the real engine (`A.engage()`) switches on at the first tap (Start, a key, Car mode), since iOS only allows sound after a tap. Startup extras (sync pull, backup reminder) run shortly after opening. Not tried on the phone yet: confirm the first note after a cold open is the piano, not the synth, and that nothing shows on the lock screen before the first tap.
- The header bar is labelled "Mastery of this level" with a percent; the line under it says what's still needed. It is a blend (answers recorded, accuracy against the goal, per-note accuracy), so it can move down after a miss. "Answered today" (daily goal) sits separately at the top right.
  iOS apps can't quit themselves, so releasing the audio is the most the app can do.
- iPhone only for now.
- Sync: a private GitHub gist, one user. Multi-user sign-in (Firebase) was discussed and put off.
- No redirect pages when renaming (he removed music.html rather than redirect it).

## Level ladder (LEVELS in index.html)

42 levels, listed in teaching order. Every level has a permanent `id`; saved progress is filed under the id (never the list position), so levels can be added, moved or retired freely. Never reuse an id for a different level. `LADDER` (now 2) is the version of the whole ladder: a file saved under an older ladder is archived (`S.archive`) and the new ladder starts fresh. `levelNo(i)` gives the number shown to Steve.

Steve's decisions (Nov 23 2026):
- No keyboard-only levels, and no keyboard answers for now: every lesson uses the number pad (tap levels use the tap area).
- The whole progression is taught in major first. Modes are a separate setting (Settings → Mode: major, minor, Dorian, Mixolydian, Lydian, Phrygian). The same ladder is then heard and named in that mode, and each mode starts its own mastery from scratch.

How modes are stored: `S.mode` is the active mode; the progress fields `current, mastered, pending, lvDays, hist, levelDeg, deg, conf` (and `xtra`) at the top level always belong to the active mode, and the other modes' copies wait in `S.modeStore`. `switchMode()` swaps them. Level `scales`/`degrees` are computed from the mode (`modeScale()`); levels list scale steps (`idx`) rather than labels. Modes (`MODE_ORDER`): Major (Ionian), Dorian, Phrygian, Lydian, Mixolydian, Minor (Aeolian), Locrian (added Nov 23 2026 at Steve's request; Locrian is the seventh mode, with ♭2 ♭3 ♭5 ♭6 ♭7; its home chord is diminished). Chromatic levels add "outside notes" for the mode (`outs`, order in `OUT_ORDER`, labels by semitone via `chromaLabels()`): in major that is ♯4 ♭7 then ♭3 ♭6 then ♭2. Chord levels build the chord from the mode's own notes. Car mode stays in major. Not checked by ear: how the cadence sounds in Lydian, Mixolydian, Phrygian and Locrian (`cadence()`), and that chords in each mode sound right.

**The progress file** (`toFile()` / `fromFile()`): `v:2`, `fv:2` (file format), `ladder:2`. Per-level records (`mastered, pending, lvDays, hist, levelDeg`) are keyed by level id, and `currentId` replaces `current`. Inside the app they are keyed by list position for speed; the conversion happens only when reading or writing a file (localStorage, export, import, gist sync). Records for ids this version doesn't know are kept in `xtra` and written back, so nothing is lost when levels are added, removed or an older copy of the app saves. Files from before ids (no `fv`) are read by their old list position through `LEGACY_IDS`; a file from the first ladder (ladder 1) is moved into `archive` (everything per-level, all modes) and the new ladder starts fresh, keeping settings, practice days, XP, totals and the per-note skill stats (`deg`, `conf`). Settings → Import accepts v1 and v2 files; the gist wrapper is `v:2`.

Numbers below are the numbers shown in the app (list order). Steve's request (Nov 23 2026), built as levels 1–8: start with 1 3 5 in major; keep the single notes, then two- and three-note echoes of the same degrees; simple rhythm early with short piano phrases; harmony alongside melody with I–V–I and I–IV–V–I; a "Play this phrase in another key" exercise with separate feedback on melodic shape (up, down, same). The exact levels, rhythms and keys are my choices.

Phrase stepping stones (Steve, Nov 24 2026, to make single notes → phrases gradual): the phrase plays in full and some of its notes are shown on screen (level prop `given`, note positions). He presses every note in order. A shown note sits in a dashed box and turns solid periwinkle when he presses it; hidden notes appear in their box as he presses them. A wrong press on a shown note is ignored (a hint says which number to press) and not counted; shown notes are left out of the per-degree stats. (First version made him press only the hidden notes; he kept pressing the shown one, so it was changed.) Order: two notes with the first shown, with the last shown, then the whole two-note phrase; three notes with the first two shown, the last two shown, the first and last shown, the first shown, the last shown, then the whole three-note phrase. All 1 3 5, key of C. These are levels 2, 3, 5, 6, 7, 8, 9 (ids `part-*`). After an answer on any note-phrase level (`isPhrase`: kind notes, more than one note; rhythm, tap and chord levels excluded) the phrase plays again (after a miss: cadence, then phrase) and there is no resolution to the home note (Steve, Nov 24 2026). Single notes, chords and review questions drawn from single-note levels keep the resolution, and after a miss the cadence plays again on every level that has one.

The older list below was written before them, so its numbers are off by the stepping stones:
1. Home base: 1 3 5 (single notes, key of C) · 2. Two-note echoes · 3. Three-note echoes · 4. Two notes with a rhythm · 5. Three notes with a rhythm (all key of C, cadence I–V–I) · 6. Phrases over a chord (keys C, G, F; a soft I chord sounds under the phrase; cadence I–IV–V–I) · (The two keyboard "Another key" levels were removed Nov 24 2026; the any-key phrase levels, answered on the pad, cover other keys.)
9. Add 2 and 6 (pentatonic) · 10. Add 4 · 11. Add 7, full scale

   Steve's decision (Nov 22 2026): other keys come in early so the ear never leans on C. Level 1 stays in C; level 2 uses C, G, F; level 3 adds D and B♭ (`KEYS_B`); level 4 adds A and E♭ (`KEYS_C`). The key still changes per round.
12. New key every round (all 12) · 13. Three octaves, new key every round
14–15. Two- and three-note phrases on 1 3 5 in any key (added at Steve's request, Nov 24 2026, before the all-seven-degree versions) · 16–20. Two-, three-, four-, five-, six-note phrases
Then: chromatic (one outside note, then first two, two more, all twelve, 3-note phrases; 12-button pad, voice off), chords (roots 1 and 5, roots 1 4 5, every chord, inversions, arpeggios, block chords on 1 4 5, block chords), rhythm (tap, off-beats, melody with rhythm in 2, 3, 5 notes; graded on the gaps between taps, tolerance `tol`).

Tolerances, the key pools are my choices, not Steve's. Rhythm levels have NOT been tried on his phone yet (tap timing); expect tuning.

Mastery (rule in "Making learning stick" below): enough recent answers at the target accuracy, two days, plus every degree ≥75% recently (no speed test).
About 30% of questions
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
  teach scale-degree function, use familiar melodies, prepare by singing. Backs pentatonic-first.
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
  rebuilds it (`A.build()`) and runs from the Start taps and from `A.seq`/`A.note`. Not testable in headless Chrome
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
- Tune rhythm after Steve tries them on the phone. Possible later: other chord qualities, 7th chords.

## Making learning stick (built Nov 23 2026; Steve asked for all four)

Steve felt he moved from phrase levels to melodies, and to the keyboard, too fast. The numbers and rules here are my choices.
1. **Mastery needs more, on two days.** The last 40 answers (30 for multi-note levels) must hit the target accuracy (90%, or 80% for multi-note) with the per-note check. That makes the level "ready" (`S.pending[lvl]` = the date, "Strong session!" popup). It counts as mastered only when the target is met again on a later day, with at least a third of the window answered that day. Levels already mastered before this change stay mastered. Pending levels still feed the shared stats and are skipped when picking "Up next".
2. **Stepping stones** between the big jumps (now ordinary levels in the list; see the ladder). The keyboard needs no stone any more, since it is an option on every level. A new mode is its own Mode setting.
3. **Review of the level before.** A level in its first five practice days (`isYoung`, from `S.lvDays`) mixes in about a third review, mostly from the level just before it (notes and chords may mix; rhythm only mixes with its own kind). Only when the review setting is above 0.
4. **Gentle start.** In those first five days notes and resolutions play 20% slower (`gentle()`) and the header says so. Replays were already free. Levels already well under way (20+ answers) before this change are not treated as new.
- After a miss or give-up (Steve, Nov 24 2026): the error tone, then the cadence again, then the phrase replayed with the answer shown, then the resolution (`cadenceAfterMiss`; not on tap-rhythm levels). He also said the jump from single notes to phrases felt impossible and lessons moved too fast, so mastery now needs 40/30 answers (was 30/20) and the gentle start lasts five days (was three). The window sizes and five days are my choices. Possible next step if still too steep: an easier first phrase level (e.g. two notes from 1 and 5 only); not built, asked Steve.


- Progress note bars (Steve chose option B, Nov 24 2026): periwinkle `#b4b9ff` at 90%+, `#7f86e8` at 70–89%, the app's orange below 70%.

- Level names (Nov 24 2026, my wording, Steve asked for consistent names): `Category: detail`. Categories are Single notes, Phrases, Rhythm phrases, Phrases over a chord, Chromatic, Chord roots, Chord tones, Tap the rhythm, Melody with rhythm. Counts are spelled out (two notes), degrees as digits (1 3 5).
- Number pad for every lesson (Steve, Nov 24 2026): scale degrees only; a piano keyboard and finding notes on it will come later as its own lessons. `inputFor` returns the pad for everything except tap levels; the 123 / Keys button and the "Answer with" setting are gone, and the two keyboard "Another key" levels were removed (progress for their ids stays in the file). Melody-with-rhythm levels are answered on the pad too, tapping the numbers in rhythm. The keyboard drawing code is still in the file for later.
