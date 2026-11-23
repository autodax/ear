# ear: notes for Claude

This repo is Steve's Ear Trainer, a home-screen web app on GitHub Pages (https://autodax.github.io/ear/).
It is one self-contained HTML file (`index.html`) with no build step and no server. Pushing to `main`
publishes within a minute or two. It used to live in the `autodax.github.io` repo (moved Nov 22 2026).

**This repo is public.** Anything written here, including these notes, can be read by anyone.
Never put personal details in the repo: no addresses, account numbers, balances, salary, or tokens.

## Working with Steve

- Steve doesn't read code. Describe changes in plain language: what he'll see and do, not how
  it's built. Don't paste code into replies.
- Ask clarifying questions in plain text, never as pop-up multiple-choice dialogs.
- He uses an iPhone (Safari, and the app saved to the home screen as a web app). Mobile-first.
- When a choice is visual (icons, layouts, sounds), show a few options side by side before
  committing to one.
- Do the work, test it, and push it; then say briefly what changed and anything he must do
  (for example, swipe the app away and reopen it).

## Notes

Everything about the app (decisions, level ladder, iPhone lessons, release steps) is in
@notes/ear.md. Read it before changing anything.

## Every change

1. `git fetch` and rebase onto `origin/main` before pushing. Other Claude sessions may also push.
2. Test before pushing. Headless Chrome with Playwright is enough for layout and logic. Use an
   iPhone-sized viewport (402 × 874; the home-screen web app reports 402 × 812).
3. Commit messages in plain language, describing what changed for the user.
4. Bump `APP_VERSION` in `index.html` (see notes/ear.md, "Every release").

## Keeping these notes current

These files are the memory for this repo. When you learn something a future session would
otherwise have to rediscover (a decision Steve made, a preference, an iPhone quirk, how a part of
the app works, a pending idea), update `notes/ear.md` in the same commit. Keep entries short, keep
the file tidy, and remove anything that's no longer true. Only Steve's stated decisions go under
"Decisions"; don't record guesses as decisions.
