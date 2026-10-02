# Demo: locked path, runbook and fallback

Status: rewritten on 2 Oct 2026 for the Lichen redesign (D4, v2 Item 5). Every number below comes from `node scripts/demo-path.mts 7 9`, which replays the path through the same model and plan functions Today calls (`app/(tabs)/today.tsx`). Re-run it after any change to the model, the fixtures or the plan rules, and update this table. **No person has rehearsed this version yet**, and it has not been timed at human speed. Confirm the numbers on the phone at the first rehearsal.

Target: under 3 minutes (Brief §9). Rehearsal needs two full runs by the team, with a stopwatch (`rehearsal-timer.html`).

## What the demo must show (Brief §9)

1. One persona and 3 days of logs: Marta, 29, product analyst, Warsaw, lifts 4 times a week.
2. A morning score with its range and drivers.
3. The plan changing when the day switches from Work to Training.

## The demo clock

The demo build (`npm run demo`) starts every launch on the scripted morning, Monday 5 Oct 2026. **Long-press the date under the plan name on Today** to step the clock: morning → evening → next morning. The step to the next morning only works once tonight's log is saved; otherwise the phone gives a warning buzz and nothing changes. There is no visible button (user decision, 1 Oct).

## The locked path (ratings 7, then 9)

| Day | What you do | What the screen shows |
|---|---|---|
| Mon 5, morning | Today opens on "How do you feel this morning?". Tap **7**. The score reveals. | **Train light**, 51, Likely 34–68. "Your score is near a typical day, so your Push session is kept light." What moved your score: Recent readiness +6, Training load −4, Alcohol −2, each "vs. a typical day". No inputs line: all 11 inputs are there. |
| Mon 5, evening | Long-press the date. **Log tonight** is now the primary. Push felt: **Moderate**. Alcohol: **No**. Anything unusual: **No**. Did today's plan fit: **Yes**. **Save log**. | "Logged. Tomorrow's plan arrives in the morning." |
| Tue 6, morning | Long-press the date. Tap **9** on the rating. | **Train light**, 56, Likely 39–73. "Based on 2 of 11 inputs", with "Few inputs today. Add more for a fuller picture." Recent readiness +10, Training load −4, Alcohol −2. |
| Tue 6, Week | Open **Week**. Wednesday and Thursday are outlined on the strip. "Heavy legs on Thursday sits before a late dinner and a Friday flight." "Wednesday becomes Train hard. Thursday becomes Deep-work day." Tap **Move to Wednesday**. The glyph travels from Thursday to Wednesday. Then tap **Wednesday**: its column grows into the day card. Close it. | "Heavy legs moved to Wednesday." with Undo. The card: Wednesday 7 Oct, Train hard, Work and Training, Heavy legs, 18:00. |
| Tue 6, evening | Back on **Today**, long-press the date. **Log tonight**: Moderate, No, No, Yes. Save. | "Logged. Tomorrow's plan arrives in the morning." |
| Wed 7, morning | Long-press the date. Tap any rating, or **Skip to my plan** (Wednesday's rating feeds Thursday, not today). | **Train hard**, 64, Likely 47–81. "Your score is high, so your Heavy legs session stays hard." Recent readiness +17, Training load −3, Alcohol −2. Based on 2 of 11 inputs. |

The plan for Wednesday changes from **Deep-work day** (before the move: Work only) to **Train hard** (after the move: Work and Training, score 64). That is the Work-to-Training switch.

**Do not rate 7 on Tuesday.** Ratings 7 and 7 end on Wednesday at **Train light**, 57, Likely 40–74: under the 60 that keeps a hard session hard (`packages/planner/plan.ts`, GAPS G2, a proposal).

### Why "Based on 2 of 11 inputs" on days 2 and 3

Day 1 is the scripted week, which has all 11 inputs. From day 2 the forecast has only what the three-tap log and the morning rating supply, and the screen says so. Do not say it "gets sharper as you log".

## Script, about 2:50 (draft for rehearsal)

| Time | Screen | Say |
|---|---|---|
| 0:00 | Today, Mon 5, the rating | "Marta lifts four times a week. Every morning she asks one question: what kind of day should I plan? First she says how she feels, before she sees anything." Tap 7. |
| 0:20 | The score, range, drivers | "Form answers with a plan and a score. The score is a likely range, 34 to 68, not a precise number. Three reasons, each against a typical day." |
| 0:45 | Long-press, Log tonight | "Evening: three taps. How hard it felt, alcohol, anything unusual. And did the plan fit." |
| 1:05 | Long-press to Tue 6, rate 9 | "Next morning the model runs again, on her own log. It says how many inputs it had: two of eleven." |
| 1:25 | Week, Move, the Wednesday card | "The week comes from her calendar. Thursday has a late dinner, Friday a flight. Form suggests moving Heavy legs to Wednesday." Tap Move, then Wednesday. |
| 1:55 | Log Tue, long-press to Wed 7 | "Wednesday is now a training day and her score is high, so the plan changes to Train hard." |
| 2:20 | Progress (optional) | "It asks whether the plan fit, and shows her rating beside the forecast. This week is scripted demo data." Switch the tab to Felt vs forecast. |
| 2:40 | Credit | "The model is trained on PMData, a public dataset of 16 recreational athletes. Credit slide." |

Cut first if over time: Progress, then the Wednesday card (keep the Move). Both evening logs are needed to reach Wednesday.

Optional opening, only if there is time and the app was freshly launched: Welcome (the week rises over the horizon, about 1 s), then "Continue without an account".

## What to claim and what not to (Brief, "What not to claim")

- Say: the model beats "tomorrow = today" on training days; the score is a likely range; every number has a reason; it is wellness, not diagnosis.
- Facts you may quote: mean error 10.8, against 11.4 for "tomorrow = today" and 14.7 for the average. Gains are on training days. The range is ±17.2 and is **not a calibrated interval**. Trained on PMData, 16 people.
- Do not say: "highly accurate"; that sleep is a top driver; that it "gets sharper as you log"; that the Health and calendar-write screens are connected (they are previews); that accounts or sync exist (accounts are mocked, in memory).
- "6 of 6 days landed inside the likely range" on Felt vs forecast is a count on scripted ratings. Do not present it as accuracy.

## Questions you will get

| Question | Answer |
|---|---|
| Why 2 of 11 inputs on day 2? | Day 1 is a scripted week. Afterwards the model only has what the three-tap log and the rating give it, and the screen says so. |
| Is the range a guarantee? | No. It is ±17.2 points and not a calibrated interval. |
| Is this medical? | No. It plans training and work around how you will likely feel. It does not diagnose or treat anything. |
| Is Health or calendar data real? | The calendar is a scripted week. Health and calendar-write are labelled previews; nothing is connected. |
| Do I need an account? | No. Form works without one; scoring runs on the phone. Accounts in the demo are mocked and last until the app closes. |
| Where does the data come from? | PMData, Simula, CC BY 4.0, 16 recreational athletes in Norway. A small, narrow sample. |

## Runbook

### Before you go on

1. Put the PC and the iPhone on the same Wi-Fi. Allow Node.js through the Windows firewall for that network ("Public" networks block it by default).
2. On the PC, from the project root: `npm run demo` (`scripts/demo.mjs`). It runs the app in production mode on **port 8090** with a cleared Metro cache and the demo clock on. The terminal prints a build stamp first, for example `Build stamp: 1589c3c+changes, started 2026-10-02 14:44`; the same text shows at the bottom of Progress.
3. **Warm the bundle.** A cold iOS build takes one to two minutes on this PC. Open the app on the phone once, at least 10 minutes before you present.
4. On the iPhone: **Reduce Motion off** (Settings, Accessibility, Motion), so the reveal, the move and the Wednesday card animate. Low Power Mode **off** (it can lower the frame rate; GAPS G38), Do Not Disturb on, auto-lock off, brightness up.
5. In Expo Go, enter **`exp://192.168.0.228:8090?disableFab=1`** (the PC address can change; Expo prints it). `disableFab=1` hides Expo Go's tools button. If the blue gear shows, the URL was opened without it.
   Before every run, close Expo Go fully (swipe it away) and open the URL again. Check that **"App opened"** at the bottom of Progress shows the new time: if not, the old run is still in memory.
6. Walk to Today once, before you present: Welcome, **Continue without an account**, **Skip** the slides, **Allow** for each of the four purposes, **Continue**, **Allow read access** (calendar), **Allow notifications** (mocked in the demo build: no system dialog). Today opens on Monday's rating. **Do not close the app or reload** after this: the state is in memory.

### If something goes wrong

| Problem | Do this |
|---|---|
| The phone cannot reach the server | Play the fallback recording. Check the firewall and the Wi-Fi network after. |
| The app shows a red error | Shake, reload. If the state is lost, play the recording. |
| The long-press does nothing and the phone buzzes | Tonight's log is not saved yet. Open Log tonight and save it, then long-press again. |
| Out of time | Skip Progress, then the Wednesday card. |
| The numbers differ from the table | The ratings were different. Follow the table, or say "this is a live run; the inputs differ". |

## Fallback screen recording

**The existing recording predates the redesign: record a new one.**

1. iPhone: Settings, Control Center, add Screen Recording.
2. Set up exactly as in "Before you go on", including Reduce Motion off. Start from the first screen (close Expo Go and open the app again) if you want the Welcome in it, or from Monday's rating after step 6.
3. Start recording, run the locked path at talking pace, stop. Do not narrate; you will narrate live over it.
4. Save as `docs/demo/fallback-production.mp4`.
5. A second, shorter copy (the Week move, the Wednesday card and the Wed 7 reveal, about 30 s) is useful if time is cut.

## Credits

`docs/demo/pmdata-credit-slide.html` is a one-slide credit page (16:9). The citation was taken from search results, not from the dataset page, so **check it against https://datasets.simula.no/pmdata/ before you show it**.

## Helper pages (open in any browser)

- `colour-test.html`: the 5-second colour test, now in Lichen. Shows a plan's arc and glow on the dark canvas for 5 seconds with no glyph and no label, then asks what kind of day it is and tallies the answers. The contrast and colour-vision numbers are in `docs/colour-test.md` (`node scripts/colour-test.mjs`).
- `rehearsal-timer.html`: a stopwatch for the rehearsals. Press Start, then Next at each step, and it shows the total against 3:00.
