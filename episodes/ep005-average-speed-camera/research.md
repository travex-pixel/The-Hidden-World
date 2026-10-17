# Research record — Episode 005

**Episode:** ep005-average-speed-camera — *The Speed Camera That Never Measures Your Speed*
**Series:** Invisible Tech (hidden-world reveals of everyday technology), 3D low-poly style.
**Central question:** If an average speed camera never measures your speed, how does it know you were speeding, and why doesn't braking at the camera help?
**Proposed answer:** Two (or more) ANPR cameras a known distance apart each read your number plate and stamp the time. The system divides distance by elapsed time. Your speed at either camera is never used, so braking at the end can't undo time you already gained.

## Research-access note (honest)
Direct page fetches to gov.uk, police and National Highways sites failed with DNS errors in this environment. Research used the web-search tool's indexed excerpts of the real pages listed below. Before publishing, open S1, S5 and S7 in a browser to confirm the wording.

## Sources actually consulted
| ID | Source | Date | Supports |
|----|--------|------|----------|
| S1 | [Highways England: Average speed enforcement cameras](https://highwaysengland.co.uk/road-safety/average-speed-enforcement-cameras/) | current | ANPR at two points; evidence record with images and date/time stamps from both cameras; plate data and images of vehicles that did not exceed the average limit are automatically deleted. |
| S2 | [Driving.co.uk: How do average speed cameras work?](https://driving.co.uk/?p=69703) | undated | Distance ÷ time between two cameras; changing lane does not help. |
| S3 | [Autocar: Explained, every type of speed camera](https://www.autocar.co.uk/node/369591) | undated | Entry camera takes an infrared image and records the time; exit camera takes infrared and colour images; plate read by computer. |
| S4 | [Gurney, Rhead et al., Univ. of Hertfordshire: retro-reflectivity of UK number plates and ANPR performance](https://uhra.herts.ac.uk/handle/2299/12526) | 2013 | UK plates are retroreflective; their infrared behaviour matters for ANPR (night capture). |
| S5 | [Surveillance Camera Commissioner blog: Police use of ANPR](https://videosurveillance.blog.gov.uk/2016/08/23/police-use-of-automatic-number-plate-recognition/) | Aug 2016 | ANPR "reads" between 25 and 35 million pieces of data a day, stored on the National ANPR Data Centre. |
| S6 | [UKAuthority: Police to get new national ANPR system](https://ukauthority.com/articles/police-to-get-new-national-anpr-system) | undated | NPCC: around 8,500 cameras submit 25–35 million read records a day. |
| S7 | [West Yorkshire Police: ANPR privacy notice](https://www.westyorkshire.police.uk/node/147888) | current | Read records on the National ANPR Service are deleted 12 months after entry unless preserved (CPIA 1996). |
| S8 | [Lancashire Constabulary: How we use ANPR](https://lancashire.police.uk/about-us/accessing-information/how-we-use-anpr) | current | Access mostly limited to 90 days; certain staff up to 12 months. |

## Claim-level fact check
| Claim | Script wording | Status | Evidence |
|-------|----------------|--------|----------|
| C1 | "this one never measures your speed. It checks a clock. Twice." | Established | S1, S2, S3. Average speed = distance ÷ time between plate reads. Some systems use more than two cameras; "twice" is the minimal case shown. |
| C2 | "It fires an infrared flash you can't see." | Established | S3 (infrared image at entry camera), S4. Infrared is drawn in red/magenta with an on-screen "shown in colour" label. |
| C3 | "Your number plate bounces it straight back." | Established | S4: UK plates are retroreflective. |
| C4 | "At fifty, that takes at least two minutes twenty-four" / "Two miles in two minutes flat… sixty" / "Seventy most of the way. Forty for the camera. Same two minutes. Still sixty." | Illustrative maths | 2/50 h = 144 s; 2 mi / 120 s = 60 mph; 70 mph for 14/9 mi + 40 mph for 4/9 mi = 80 s + 40 s = 120 s. Checked in `tests/test_episode.py`. |
| C5 | "Legal? Your record is deleted. Too fast? Both photos become evidence." | Established | S1. |
| C6 | "Around twenty-five million a day." | Estimate (low end of range) | S5, S6 (25–35 million; vendor capacity figures of 50 million+ not used). |
| C7 | "Stored for up to a year." | Established | S7, S8. |
| — | "So where was your car last Tuesday?" | Rhetorical threshold | No factual claim; opens the next episode (national ANPR). |

## Deliberately left out
- Enforcement thresholds (e.g. "10% + 2 mph" guidance): discretionary and not needed for the mechanism.
- Vendor names, specific camera models and how each one synchronises its clock (GPS time is used by some systems, but no accessible source confirmed it for UK systems).
- Lane-changing myths: true (cameras cover every lane, S2) but a second mechanism; saved for a follow-up.

## Licences
Original 3D models built in code (three.js, MIT). Narration: Piper TTS en_GB-alba-medium (MIT engine, CC BY 4.0 dataset). Music and SFX synthesised by `pipeline/audio.py`. Fonts: Nunito (OFL).
