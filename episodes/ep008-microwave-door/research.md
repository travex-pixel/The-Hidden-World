# Research record — Episode 008

**Episode:** ep008-microwave-door — *You Can See Through Your Microwave Door. The Microwaves Can't.*
**Central question:** If you can see through the door, why can't the microwaves get out?
**Answer:** Glass is transparent to microwaves. The perforated metal sheet in the door does the shielding. Its holes (about 1–2 mm) are far smaller than the about 12 cm wavelength, so to the microwaves it behaves like solid metal and reflects them. Visible light (0.4–0.7 µm) is thousands of times smaller than the holes and passes through. The whole cavity is a Faraday cage.

## Access note
Pages were read via the web-search tool's indexed excerpts. The wavelength was calculated: c / 2.45 GHz = 3.0e8 / 2.45e9 = 0.122 m.

## Sources
| ID | Source | Supports |
|----|--------|----------|
| S1 | [FDA: Microwave Ovens](https://www.fda.gov/radiation-emittingproducts/resourcesforyouradiationemittingproducts/ucm252762.htm) | Metal reflects microwaves; glass, paper and plastic let them through; food absorbs them; waves reflect off the metal interior. Leakage limit 5 mW/cm² at about 2 inches (21 CFR 1030.10), far below harmful levels. |
| S2 | [Health Physics Society: Microwave Ovens](https://hps.org/hpspublications/articles/microwaveovens.html) | Oven frequency and general operation. |
| S3 | [Straight Dope: what keeps microwave radiation from leaking out the door?](https://www.straightdope.com/21343269/what-keeps-microwave-radiation-from-leaking-out-the-oven-door) | Holes much smaller than the wavelength block it; shorter wavelengths need smaller holes. |
| S4 | [Swinburne University physics explainer](https://www.swinburne.edu.my/?p=4929) | Wavelength about 12.2 cm; holes about 1–2 mm; conducting surfaces with holes much smaller than the wavelength reflect it; light at 0.4–0.7 µm passes. |
| S5 | [ScienceABC: do microwaves interfere with WiFi?](https://www.scienceabc.com/innovation/do-microwaves-interfere-with-wifi-signals.html) | Ovens at 2.45 GHz leak a little and can swamp 2.4 GHz Wi-Fi (802.11b/g/n). |
| S6 | [US patent 10869274](https://image-ppubs.uspto.gov/dirsearch-public/print/downloadPdf/10869274) | Leakage within the federal limit can still disrupt nearby Wi-Fi. |
| S7 | [The Takeout: why microwaves have mesh on the door](https://www.thetakeout.com/2073815/why-microwaves-mesh-on-door-important/) | The mesh is part of a Faraday cage around the cavity. |

## Claim check
| Claim | Wording | Status |
|-------|---------|--------|
| C1 | "You think the glass door stops the microwaves. It doesn't. Glass lets them straight through." | Established (S1). |
| C2 | "Waves about twelve centimetres long… bounce off the metal walls." | Established (S1, S2, S4); arithmetic above. |
| C3 | "Holes… one or two millimetres. Holes that small act like solid metal. The waves bounce back." | Established, simplified (S3, S4). Not the myth that the wave is a solid object that "can't fit". |
| C4 | "Light waves are thousands of times smaller." | 1.5 mm / 0.5 µm ≈ 3,000×. Established (S4). |
| C5 | "Wi-Fi uses the same band. A tiny leak, within safety limits, drowns it out." | Established (S1, S5, S6). Only 2.4 GHz Wi-Fi; 5 GHz is unaffected (said in the upload kit). |
| C6 | On-screen: "US limit: 5 mW/cm² at ~2 in (5 cm)". | Established (S1). |
| C7 | "A Faraday cage you cook in." | Established (S7, S4). |
| — | "So why is the middle of your food still frozen?" | Threshold (standing waves and penetration depth) for a follow-up. |

## Deliberately left out
- Watts ratings (no authoritative source found here).
- Door choke seals (true, but a second mechanism).
