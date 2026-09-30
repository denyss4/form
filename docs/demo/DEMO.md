# Demo: locked path, runbook and fallback

Status: path locked on 1 Oct 2026. Every number below comes from a real run of the model on the production build (`npm run demo`, web preview at 375 × 812). The path ran end to end, unattended, twice (paths A and B below). **No person has rehearsed it yet**, and it has not been timed at human speed or run on the iPhone in production mode.

Target: under 3 minutes (Brief §9: "demo under 3 min"). Rehearsal needs two full runs by the team, with a stopwatch.

## What the demo must show (Brief §9)

1. One persona and 3 days of logs: Marta, 29, product analyst, Warsaw, lifts 4 times a week.
2. A morning score with its range and drivers.
3. The plan changing when the day switches from Work to Training.

## The locked path (path B)

Inputs are fixed so the numbers repeat. The clock is the demo clock: Monday 5 Oct 2026.

| Day | What you do | What the screen shows |
|---|---|---|
| Mon 5, morning | Open Today. The reveal plays. Set the morning rating to **7**. Tap **Accept plan**. | **Train light**, 51, Likely 34–68, Based on 11 of 11 inputs. "Your score is near a typical day, so your Push session is kept light." Drivers: Recent readiness +6, Training load −4, Alcohol −2. The line "2 taps to sharpen tomorrow" disappears once you rate. |
| Mon 5, evening | **Log tonight**: Moderate, alcohol No, unusual No, plan fit Yes. **Save log**. Tap **Demo: jump to tomorrow morning**. | "Logged. Tomorrow's plan arrives in the morning." |
| Tue 6, morning | Open **Week**. Read "Thursday dinner, Friday flight. Wednesday has no session. Move Heavy legs there?" Tap **Move to Wednesday**. Back on Today, set the rating to **9**. Accept. | **Train light**, 58, Likely 41–75, Based on 2 of 11 inputs ("Few inputs today"). Recent readiness +10, Training load −4. On Week: Wednesday is now Train hard (Heavy legs), Thursday is a Deep-work day. |
| Tue 6, evening | **Log tonight**: Moderate, No, No, Yes. Save. Tap **Demo: jump to tomorrow morning**. | |
| Wed 7, morning | Read the screen. | **Train hard** (Ember field), 65, Likely 48–82, Based on 2 of 11 inputs. "Your score is high, so your Heavy legs session stays hard." Recent readiness +17, Training load −3. |

The plan changes from **Deep-work day** (Wednesday before the move: Work only) to **Train hard** (after the move: Work and Training, score high). That is the Work-to-Training switch.

Path A (ratings 7 and 7) ends on Wed 7 at **Train light**, 59, Likely 42–76. A score of 59 is one point under the 60 that makes a hard session stay hard (`packages/planner/plan.ts`, GAPS G2, a proposal). Do not rate 7 on Tuesday.

### Why "Based on 2 of 11 inputs" on days 2 and 3

Day 1 is seeded from Marta's scripted week, which has all 11 inputs. From day 2 the forecast uses only what the three-tap log and the rating supply. The screen says so. The sentence "2 taps to sharpen tomorrow" is literal: on Tue the rating gave 2 of 11 inputs; in a run where the morning rating was skipped, Wed had 1 of 11.

## Script, about 2:50 (draft for rehearsal)

| Time | Screen | Say |
|---|---|---|
| 0:00 | Today, Mon 5 | "Marta lifts four times a week. Every morning she asks one question: what kind of day should I plan?" |
| 0:20 | The score, range, drivers | "Form answers with a plan and a score. The score is a likely range, 34 to 68, not a precise number. Three reasons, each against a typical day." |
| 0:45 | Rating, Accept plan | "She rates how she feels. That rating is an input for tomorrow's forecast. Two taps." |
| 1:05 | Log tonight | "Evening: three taps. Effort, alcohol, anything unusual." |
| 1:25 | Jump to Tue 6 | "Next morning the model runs again, on her own log. It says how many inputs it had: two of eleven." |
| 1:45 | Week | "The week comes from her calendar. Thursday has dinner, Friday a flight. Form suggests moving Heavy legs to Wednesday." Tap Move. |
| 2:10 | Jump to Wed 7 | "Wednesday is now a training day and her score is high, so the plan changes to Train hard." |
| 2:30 | Progress (optional) | "It asks whether the plan fit, and shows her rating beside the forecast. This week is scripted demo data." |
| 2:45 | Credit | "The model is trained on PMData, a public dataset of 16 recreational athletes. Credit slide." |

Cut first if over time: Progress. Both evening logs are needed to reach Wednesday, so keep them.

## What to claim and what not to (Brief, "What not to claim")

- Say: the model beats "tomorrow = today" on training days; the score is a likely range; every number has a reason; it is wellness, not diagnosis.
- Facts you may quote: mean error 10.8, against 11.4 for "tomorrow = today" and 14.7 for the average. Gains are on training days. The range is ±17.2 and is **not a calibrated interval**. Trained on PMData, 16 people.
- Do not say: "highly accurate"; that sleep is a top driver; that it "gets sharper as you log"; that the Health and calendar-write screens are connected (they are previews).
- The "6 of 6 days landed inside the likely range" line on Felt vs forecast is a count on scripted ratings. Do not present it as accuracy.

## Questions you will get

| Question | Answer |
|---|---|
| Why 2 of 11 inputs on day 2? | Day 1 is a scripted week. Afterwards the model only has what the three-tap log and the rating give it, and the screen says so. |
| Is the range a guarantee? | No. It is ±17.2 points and not a calibrated interval. |
| Is this medical? | No. It plans training and work around how you will likely feel. It does not diagnose or treat anything. |
| Is Health or calendar data real? | The calendar is a scripted week. Health and calendar-write are labelled previews; nothing is connected. |
| Where does the data come from? | PMData, Simula, CC BY 4.0, 16 recreational athletes in Norway. A small, narrow sample. |

## Runbook

### Before you go on

1. Put the PC and the iPhone on the same Wi-Fi. Allow Node.js through the Windows firewall for that network (you did this once; "Public" networks block it by default).
2. On the PC, from the project root: `npm run demo`. This is `expo start --no-dev --minify`. It runs the app in production mode: `__DEV__` is false, the gallery link is hidden, and Reanimated's development warnings are gone. Verified: the manifest asks for `dev=false&minify=true`, the iOS bundle is 6.2 MB.
3. **Warm the bundle.** The first iOS build took 133 s on this PC (cold cache). Open the app on the phone once, at least 10 minutes before you present, so the demo load is instant.
4. On the iPhone: Low Power Mode **off** (it can lower the frame rate; GAPS G38), Do Not Disturb on, auto-lock off, brightness up.
5. In Expo Go, enter `exp://<PC address>:8081` (the PC address was 192.168.0.228 on 30 Sep; it can change). Expo prints it.
6. Walk to Today once: Get started, four Allow choices, Continue, Allow read access. The state is in memory, so **do not close the app or reload** before the demo. "Reset demo" in Settings returns to the first screen.
7. Expo Go's tools button: see below. Check it before you present.

### Expo Go's tools button (GAPS G37): result of the check

It floats at the top right and sits over our Settings gear. I looked for a way to hide it on SDK 57 and **could not confirm one**:

- Expo documents `EXPO_NO_DEV_MENU=1` ("keeps the developer menu closed, hides the tools button, and skips onboarding"), marked **SDK 58+**. This project's Expo CLI (57.0.27) contains no such switch (searched its build).
- A `disableFab=1` launch parameter is reported for SDK 58 and later.
- A web search summary said the developer menu has a Tools-button switch on SDK 57. The official pages I could open do not say so, and a GitHub issue for the dev menu asks for a way to hide it, so I do not rely on it.
- Nothing I found says whether production mode hides it.

**You can settle it in 30 seconds on the phone:** with the app open, shake the phone (or three-finger long press) to open the developer menu, and look for a switch for the tools button. Then reload in production mode and see whether the button is still there. Tell me the result.

If it cannot be hidden: present with it on the screen and do not tap the top-right corner. The Settings gear is not part of the path.

### If something goes wrong

| Problem | Do this |
|---|---|
| The phone cannot reach the server | Play the fallback recording. Check the firewall and the Wi-Fi network after. |
| The app shows a red error | Shake, reload. If the state is lost, play the recording. |
| Out of time | Skip Progress. |
| The numbers differ from the table | The clock or the rating was different. Follow the table, or say "this is a live run; the inputs differ". |

## Fallback screen recording

I cannot record your phone. To make it (5 minutes):

1. iPhone: Settings, Control Center, add Screen Recording.
2. Set up exactly as in "Before you go on". Start from the first screen (Reset demo).
3. Start recording, run the locked path at talking pace, stop. Do not narrate; you will narrate live over it.
4. Save as `docs/demo/fallback-production.mp4`. Record it in **production mode**, with the same Low Power Mode and tools-button state you will present with, because both show in the video.
5. A second, shorter copy (Wed 7 reveal and the Week move only, 30 s) is useful if time is cut.

An alternative I can make if you want it: a GIF of the production web build following the path. It is not the phone, so it is a weaker fallback.

## Credits

`docs/demo/pmdata-credit-slide.html` is a one-slide credit page (16:9). The citation was taken from search results, not from the dataset page (its certificate would not load here), so **check it against https://datasets.simula.no/pmdata/ before you show it**.
