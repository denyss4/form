# Hard-plan hue: candidate #A64B00 (not applied)

Status: **not applied.** The user will run a 5-second test with 3 people on Train hard against Recover and report; nothing changes until then. The app still uses Ember `#B83A1B`.

The maths is in plain scripts, no dependency (WCAG 2.x contrast; CIEDE2000 colour difference; deuteranopia simulated two ways, Machado 2009 at severity 1.0 and Viénot 1999). Values below are from a run on 1 Oct 2026.

## 1. The candidate passes contrast

Text needs 4.5:1. Ember's field is `#FBE8E1`.

| Colour | On canvas `#F3F6FA` | On raised `#FFFFFF` | On its field |
|---|---|---|---|
| Ember (today) `#B83A1B` | 5.29 | 5.74 | 4.85 |
| Candidate `#A64B00` | **5.34** | 5.79 | **4.89** (on `#FBE8E1`) |

The candidate also reads 5.11:1 on the Ochre field, so it would hold if the field changed. **Contrast: pass, by a hair more than Ember.**

## 2. The candidate is not more distinct from Ochre. It is less.

Colour difference (CIEDE2000; about 2 is just noticeable, about 10 is clearly different):

| Pair | Normal vision | Deuteranopia (Machado) | Deuteranopia (Viénot) |
|---|---|---|---|
| Ember (today) vs Ochre | 20.3 | 3.1 | 3.0 |
| **Candidate vs Ochre** | **11.2** | **2.7** | **2.0** |
| Ember vs Tide | 47.0 | 44.2 | 49.1 |
| Candidate vs Tide | 44.5 | 44.9 | 48.8 |
| Ember vs Iris | 41.4 | 53.6 | 60.3 |
| Candidate vs Iris | 46.1 | 54.3 | 60.1 |

Under deuteranopia, `#B83A1B` becomes about `#7E7014` and Ochre `#8A5A10` becomes about `#766913`: two olive-brown shades, almost the same. `#A64B00` becomes `#7C6D00`, which is closer still. **Verdict: the candidate does not fix the problem it was chosen for.** It also moves "Train hard" closer to "Train light" for people with normal vision (11.2 against 20.3).

## 3. The real cause: equal lightness

The lightness gap between Ember and Ochre is **1.03:1** (the candidate and Ochre: 1.02:1). When hue is lost, nothing else separates them. So this is a lightness problem, not a hue problem, and a different orange will not solve it.

What the test the user is running does and does not cover: Train hard against **Recover** (Ember against Tide) is fine under deuteranopia (44 or more). The weak pair is Train hard against **Train light**. Meaning is still carried by the glyph (dumbbell against footprints) and the label, never colour alone, so nothing breaks. But scanning Week by colour is harder for this pair.

## 4. An alternative that does pass, for discussion only

Darken Ember so it differs in lightness from Ochre. Searching red-orange hues (about 10 degrees) that keep 4.5:1 on canvas and field, and are at least 10 away from Ochre in both simulations, with a lightness gap of at least 1.4:

| Option | On canvas | On field | vs Ochre: normal / Machado / Viénot | Lightness gap vs Ochre |
|---|---|---|---|---|
| `#841F0B` | 8.88 | 8.12 | 22.2 / 10.1 / 10.2 | 1.63 |
| `#7E1B07` | 9.49 | 8.68 | 22.8 / 11.6 / 11.8 | 1.74 |
| `#841B0B` | 9.04 | 8.27 | 23.1 / 10.5 / 10.6 | 1.66 |

Trade-off: it is a deep brick red, less bright than today's Ember. A dark field-on-field pairing also needs a look on the real Today screen, since the Ember field sits behind a 72 pt score. It is a proposal. **A new colour needs the user's approval (`CLAUDE.md`), and the user said not to apply any hue before the test result.**

## What I recommend

1. Run the 5-second test as planned, on Train hard against Recover. Also show Train hard against Train light if you can: that is the pair at risk.
2. Do not adopt `#A64B00`.
3. If the test shows Ember reads as a warning, or if deuteranopia matters for your audience, try `#841F0B` on Today and Week and re-run the test.
