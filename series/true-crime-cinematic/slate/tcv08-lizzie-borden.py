"""Case File 08 (cinematic): Lizzie Borden. Acquitted in 1893; the killings of Andrew and Abby Borden are officially unsolved.

Scripted only from the historical record (research ledger: episodes/tcv08-lizzie-borden/research.md), not from Netflix's
*Monster: The Lizzie Borden Story*, which fictionalises. Shots live in renderer/scenes/tcv08-lizzie-borden.js.
Non-graphic: the victims, the killings, blood and any axe or hatchet are never shown or described."""


def build(h):
    N, fx, fw, S = h.N, h.fx, h.fw, h.S
    scenes = [
        S("s01_hook", "lb8_hook", [N("Days after the killings, a friend watched Lizzie Borden burn a dress."),
                                   N("A jury still acquitted her.", pause_before=0.2)],
          "cold", ["LB_burned", "LB_acquitted"], sfx=[fx(0.0, "hit", 0.7), fw(0, 9, "whoosh", 0.5, -0.1), fw(1, 3, "gavel", 0.7, -0.05)],
          emph=["burn", "dress.", "acquitted"], min_d=5.0, pad=0.2),
        S("s02_record", "lb8_record", [N("You've seen the Netflix show. Here's what the record says.")],
          "cold", ["LB_monster"], sfx=[fw(0, 8, "paper", 0.6, -0.1)], emph=["record"], tr="push", pad=0.1),
        S("s03_house", "lb8_house_day", [N("In August 1892, Andrew and Abby Borden were killed in their Fall River home.")],
          "unease", ["LB_killed"], sfx=[fx(0.0, "wind", 0.4), fw(0, 3, "step", 0.4, -0.3), fw(0, 5, "step", 0.4), fw(0, 8, "sub", 0.5)],
          emph=["killed"], tr="zoom"),
        S("s04_step", "lb8_step", [N("Abby wasn't Lizzie's mother. She was her stepmother."),
                                   N("So that famous rhyme gets it wrong.", pause_before=0.2)],
          "unease", ["LB_stepmother", "LB_rhyme"], sfx=[fw(0, 7, "click", 0.4), fw(1, 3, "sparkle", 0.8, -0.1)],
          emph=["stepmother.", "wrong."], tr="push"),
        S("s05_arrest", "lb8_arrest", [N("A week later, police arrested Lizzie.")],
          "tension", ["LB_arrest"], sfx=[fx(0.2, "step", 0.4), fx(0.7, "step", 0.4), fw(0, 4, "door", 0.6, -0.1)],
          emph=["arrested"], tr="push", min_d=2.6, pad=0.15),
        S("s06_trial", "lb8_trial", [N("In June 1893, she stood trial for murder in New Bedford.")],
          "tension", ["LB_trial"], sfx=[fx(0.1, "rumble", 0.4), fw(0, 5, "gavel", 0.6, -0.05)], emph=["murder"], tr="zoom"),
        S("s07_press", "lb8_press", [N("Newspapers across the country followed every day.")],
          "tension-rise", ["LB_press"], sfx=[fx(0.0, "rumble", 0.6), fw(0, 4, "paper", 0.7)], emph=["every"], tr="push", min_d=2.6, pad=0.15),
        S("s08_excluded", "lb8_excluded", [N("Then the court excluded her own inquest testimony,"),
                                           N("and a clerk who said she tried to buy poison the day before.", pause_before=0.15)],
          "tension-rise", ["LB_inquest", "LB_poison"], sfx=[fw(0, 3, "stamp", 0.7, 0.1), fw(1, 12, "stamp", 0.8, 0.1)],
          emph=["excluded", "poison"], tr="push"),
        S("s09_alice", "lb8_alice", [N("But her friend Alice Russell testified."),
                                     N("The Sunday after the killings, she saw Lizzie burning a dress in the stove.", pause_before=0.2)],
          "tension", ["LB_burned"], sfx=[fx(0.1, "step", 0.4), fw(1, 8, "whoosh", 0.6, -0.1)], emph=["alice", "russell", "burning"], tr="fade"),
        S("s10_paint", "lb8_paint", [N("Lizzie said it was stained with paint."),
                                     N("Prosecutors said she was destroying evidence.", pause_before=0.25)],
          "tension-peak", ["LB_paint", "LB_prosecution"], sfx=[fw(0, 6, "hit", 0.5, -0.05), fw(1, 5, "thump", 0.5)],
          emph=["paint.", "evidence."], tr="push", pad=0.2),
        S("s11_verdict", "lb8_verdict", [N("No weapon was ever conclusively tied to her."),
                                         N("After about ninety minutes, the jury said: not guilty.", pause_before=0.3)],
          "tension-peak", ["LB_noweapon", "LB_90min", "LB_acquitted"], sfx=[fw(1, 7, "gavel", 1.0, -0.1), fw(1, 8, "stamp", 0.8, 0.1)],
          emph=["no", "weapon", "not", "guilty."], tr="zoom"),
        S("s12_after", "lb8_after", [N("She stayed in Fall River, in a grand house she named Maplecroft."),
                                     N("Many shunned her until her death in 1927.", pause_before=0.2)],
          "aftermath", ["LB_maplecroft", "LB_shunned"], sfx=[fx(0.2, "wind", 0.4), fx(0.6, "step", 0.3), fx(1.1, "step", 0.3), fx(1.6, "step", 0.3)],
          emph=["maplecroft.", "shunned"], tr="fade"),
        S("s13_bnb", "lb8_bnb", [N("And the house where it happened is now a bed and breakfast."),
                                 N("Yes, you can stay the night.", pause_before=0.15)],
          "aftermath", ["LB_bnb"], sfx=[fw(0, 9, "sparkle", 0.8, -0.1), fw(1, 4, "door", 0.4)], emph=["bed", "breakfast.", "night."], tr="push"),
        S("s14_end", "lb8_end", [N("Officially unsolved. Would you have acquitted her?"),
                                 N("Next: the world's most famous mystery writer vanished for 11 days. Where did she go?", pause_before=0.4)],
          "aftermath", ["LB_unsolved", "LB_acquitted", "LB_next"], sfx=[fx(0.1, "wind", 0.4), fw(1, 0, "whoosh", 0.6, -0.15)],
          emph=["unsolved.", "you", "11", "days."], min_d=3.0, pad=2.0, tr="fade"),
    ]
    sections = {"s01_hook": "A", "s02_record": "A", "s03_house": "B", "s04_step": "B", "s05_arrest": "B", "s06_trial": "B", "s07_press": "B",
                "s08_excluded": "C", "s09_alice": "C", "s10_paint": "C", "s11_verdict": "D", "s12_after": "E", "s13_bnb": "E", "s14_end": "E"}
    for sc in scenes:
        sc["section"] = sections[sc["id"]]
    scenes[7]["music_drop"] = True    # "the court excluded her own inquest testimony"
    scenes[8]["music_drop"] = True    # Alice Russell: the burned dress
    scenes[-1]["fade_out"] = True

    src = h.src
    sources = [
        src("bio_trial", "Biography.com", "Lizzie Borden Was Acquitted of Her Parents' Murders. The Case Was Never Solved.", "https://www.biography.com/crime/a73581416/lizzie-borden-trial", "2026"),
        src("bio_alice", "Biography.com", "Alice Russell and the Burned Dress That Shaped Lizzie Borden's Trial", "https://www.biography.com/crime/a73772110/alice-russell-lizzie-borden-testimony", "2026"),
        src("bio_timeline", "Biography.com", "The Complete Timeline of the Lizzie Borden Murder Trial, Plus Her Life After Acquittal", "https://www.biography.com/crime/a73687951/lizzie-borden-murder-timeline", "2026"),
        src("bio_after", "Biography.com", "Lizzie Borden's life after the murder trial", "https://www.biography.com/crime/lizzie-borden-life-after-murder-trial", "n.d."),
        src("bio_monster", "Biography.com", "Monster season 4: The Lizzie Borden Story", "https://www.biography.com/movies-tv/a73346578/monster-season-4-the-lizzie-borden-story", "2026-09"),
        src("smithsonian", "Smithsonian Magazine", "How Lizzie Borden Got Away With Murder", "https://www.smithsonianmag.com/history/how-lizzie-borden-got-away-with-murder-180972707/", "2019"),
        src("britannica", "Encyclopaedia Britannica", "Was Lizzie Borden guilty?", "https://www.britannica.com/topic/Was-Lizzie-Borden-Guilty", "n.d."),
        src("history_acquit", "HISTORY.com", "Lizzie Borden acquitted (This Day in History, June 20)", "https://www.history.com/this-day-in-history/june-20/lizzie-borden-acquitted", "n.d."),
        src("history_rhyme", "HISTORY.com (Betsy Golden Kellem)", "The Lizzie Borden rhyme and its legacy", "https://www.history.com/articles/lizzie-borden-rhyme-legacy", "n.d."),
        src("cni_rhyme", "Crime+Investigation (UK)", "The 'Lizzie Borden took an axe' rhyme", "https://www.crimeandinvestigation.co.uk/articles/lizzie-borden-took-axe-rhyme", "n.d."),
        src("ae_acquitted", "A&E (aetv.com)", "Why Was Lizzie Borden Acquitted?", "https://www.aetv.com/articles/why-was-lizzie-borden-acquitted", "n.d."),
        src("ae_casefile", "A&E (aetv.com)", "Case File: Lizzie Borden", "https://www.aetv.com/articles/lizzie-borden", "n.d."),
        src("ae_truecrime", "A&E (aetv.com)", "How the Lizzie Borden murders changed American true crime", "https://www.aetv.com/articles/how-lizzie-borden-murders-changed-american-true-crime", "n.d."),
        src("natgeo", "National Geographic", "The Lizzie Borden trial", "https://www.nationalgeographic.com/premium/article/lizzie-borden-trial-axe-murder", "n.d."),
        src("ebsco", "EBSCO Research Starters", "Lizzie Borden", "https://www.ebsco.com/research-starters/history/lizzie-borden", "n.d."),
        src("heinonline", "HeinOnline blog", "Heinous Histories: The Arrest and Trial of Lizzie Borden", "https://home.heinonline.org/blog/2023/09/heinous-histories-the-arrest-and-trial-of-lizzie-borden", "2023-09"),
        src("mentalfloss", "Mental Floss", "How Lizzie Borden Spent Her Life After Being Acquitted", "https://www.mentalfloss.com/article/81765/how-lizzie-borden-spent-her-life-after-being-acquitted", "n.d."),
        src("womanhome", "Woman & Home", "Lizzie Borden: Why was she acquitted and what happened to her after the trial?", "https://www.womanandhome.com/life/news-entertainment/lizzie-borden-why-was-she-acquitted/", "2026-09"),
        src("grazia", "Grazia", "Why Was Lizzie Borden Acquitted? The True Story Behind Netflix's Monster Season Four", "https://graziadaily.co.uk/life/tv-and-film/why-was-lizzie-borden-acquitted/", "2026-09"),
        src("foxnews_bnb", "Fox News (Travel)", "Inside the Lizzie Borden house, where guests stay overnight", "https://www.foxnews.com/travel/inside-lizzie-borden-house-guests-stay-overnight-people-brutally-ax-murdered.print", "n.d."),
        src("bostonmag_bnb", "Boston Magazine", "I Slept with Lizzie Borden, AMA", "https://www.bostonmagazine.com/2015/10/30/i-slept-with-lizzie-borden", "2015-10-30"),
        src("untapped_bnb", "Untapped Cities", "Sleep at the Lizzie Borden Bed and Breakfast Museum in Fall River, MA", "https://untappedcities.com/sleep-at-the-lizzie-borden-bed-and-breakfast-museum-in-fall-river-ma", "n.d."),
        src("mediaplay_monster", "Media Play News", "Netflix's 'Monster: The Lizzie Borden Story' topped weekly streaming through Sept. 20", "https://www.mediaplaynews.com/netflix-monster-the-lizzie-borden-story-topped-weekly-streaming-through-sept-20/", "2026-09"),
        src("won_monster", "What's on Netflix", "'Monster: The Lizzie Borden Story' debuts with 12.1M views on Netflix", "https://www.whats-on-netflix.com/news/monster-the-lizzie-borden-story-debuts-with-12-1m-views-on-netflix-heres-how-it-compares-to-prior-seasons/", "2026-09"),
        src("tna_christie", "The National Archives (UK) blog", "20s People: investigating the strange disappearance of Mrs Agatha Christie", "https://blog.nationalarchives.gov.uk/20speople-investigating-the-strange-disappearance-of-mrs-agatha-christie/", "n.d."),
        src("historyhit_christie", "History Hit", "The enduring mystery of Agatha Christie's disappearance", "https://www.historyhit.com/the-enduring-mystery-of-agatha-christies-disappearance/", "n.d."),
        src("countryfile_christie", "Countryfile", "Agatha Christie's disappearance", "https://www.countryfile.com/famous-people/agatha-christie-disappearance", "n.d."),
    ]
    C = h.claim
    claims = [
        C("LB_burned", "Family friend Alice Russell testified at the 1893 trial that on the Sunday after the killings (7 Aug 1892) she saw Lizzie burn a dress in the kitchen stove.", ["bio_alice", "smithsonian", "britannica", "bio_trial"], "fact"),
        C("LB_acquitted", "On 20 June 1893 a jury in New Bedford acquitted Lizzie Borden of the murders.", ["history_acquit", "bio_trial", "ae_acquitted"], "procedure"),
        C("LB_monster", "Netflix's Monster: The Lizzie Borden Story (a dramatisation) premiered on 17 Sept 2026 and topped Netflix's English TV chart. The episode is scripted from the historical record, not the drama.", ["mediaplay_monster", "won_monster", "bio_monster"], "fact"),
        C("LB_killed", "Andrew Borden and his second wife, Abby, were killed in their home in Fall River, Massachusetts, on 4 Aug 1892.", ["bio_trial", "history_acquit", "ae_casefile"], "fact"),
        C("LB_stepmother", "Abby Borden was Andrew's second wife and Lizzie's stepmother, not her mother.", ["ae_casefile", "history_rhyme", "cni_rhyme"], "fact"),
        C("LB_rhyme", "The anonymous playground rhyme calls Abby Lizzie's 'mother'; she was her stepmother. (The rhyme's other details are also inaccurate; they are not repeated in the episode.)", ["history_rhyme", "cni_rhyme"], "fact"),
        C("LB_arrest", "Lizzie Borden was arrested on 11 Aug 1892, one week after the killings.", ["ae_casefile", "bio_timeline", "heinonline"], "procedure"),
        C("LB_trial", "Her murder trial opened in New Bedford, Massachusetts, on 5 June 1893.", ["ae_acquitted", "bio_trial", "history_acquit", "womanhome"], "procedure"),
        C("LB_press", "The trial was a national press sensation: newspapers from across the country covered it, carried nationwide by wire services.", ["ae_truecrime", "natgeo", "bio_trial"], "fact"),
        C("LB_inquest", "The court excluded Lizzie's own inquest testimony from the trial.", ["ae_acquitted", "ebsco", "grazia"], "procedure"),
        C("LB_poison", "A drugstore clerk (Eli Bence) said Lizzie tried to buy prussic acid, a poison, on 3 Aug 1892, the day before the killings; the court excluded this testimony from the trial.", ["ae_acquitted", "ebsco", "history_rhyme"], "procedure"),
        C("LB_paint", "According to Alice Russell's testimony, Lizzie said she was burning the dress because it was stained (covered) with paint.", ["bio_alice", "smithsonian", "womanhome"], "defence"),
        C("LB_prosecution", "Prosecutors argued the burning was the destruction of evidence. This was the prosecution's argument; the jury acquitted her.", ["smithsonian", "bio_alice"], "allegation"),
        C("LB_noweapon", "No murder weapon was ever conclusively tied to Lizzie; the case against her was circumstantial.", ["ae_acquitted", "womanhome", "bio_trial"], "fact"),
        C("LB_90min", "The jury deliberated for about 90 minutes before returning its not-guilty verdict (HISTORY.com and Biography.com; one outlet gives 65 minutes, so the episode says 'about').", ["history_acquit", "bio_trial"], "procedure"),
        C("LB_maplecroft", "After the trial she stayed in Fall River and, with her sister Emma, bought a large house they named Maplecroft.", ["bio_after", "mentalfloss"], "fact"),
        C("LB_shunned", "She was widely shunned in Fall River for the rest of her life and died there on 1 June 1927.", ["bio_after", "mentalfloss", "womanhome"], "fact"),
        C("LB_unsolved", "Lizzie Borden was acquitted and no one else was ever tried: the killings remain officially unsolved.", ["bio_trial", "womanhome"], "fact"),
        C("LB_bnb", "The Second Street house where the killings happened is now the Lizzie Borden House, a museum and bed and breakfast where guests can stay overnight.", ["foxnews_bnb", "bostonmag_bnb", "untapped_bnb"], "fact"),
        C("LB_next", "Agatha Christie disappeared on 3 Dec 1926 and was found 11 days later at a hotel in Harrogate (next episode tease).", ["tna_christie", "historyhit_christie", "countryfile_christie"], "fact"),
    ]
    figures = ["lb8_lizzie", "lb8_alice", "lb8_juror", "lb8_officer", "lb8_lawyer", "lb8_neighbour", "judge"]
    ep = h.base("tcv08-lizzie-borden", 8, "A Friend Watched Lizzie Borden Burn a Dress. The Jury Still Acquitted Her.",
                "Why was Lizzie Borden acquitted, and what does the historical record actually say?",
                figures, scenes, claims, sources, "LIZZIE BORDEN · 1892-1893", bpm=76)
    ep["narrator_profile"] = dict(h.NARR, length_scale=1.0)
    ep["score"] = {"root_hz": 146.83, "bpm": 76,
                   "hits": [{"scene": "s01_hook", "word": [0, 11], "at": 0.0, "gain": 0.4}],
                   "cliff": {"scene": "s11_verdict", "word": [1, 8], "at": -0.1}}
    ep["content_notes"] = ("Closed historical case (1892-1893); Lizzie Borden was acquitted and the killings are officially unsolved. "
                           "Scripted only from the historical record, not from the Netflix drama. Real people (Lizzie Borden, Alice Russell) are illustrated "
                           "representations, not likenesses; jurors, police, lawyers and neighbours are generic period figures. Non-graphic: the victims, the killings, "
                           "blood and any axe or hatchet are never shown or described; no blow counts. No dialogue or quotes are invented; no court document, "
                           "newspaper masthead or photograph is imitated. Lizzie is never shown with a sinister expression. Research verified " + h.VERIFIED + ".")
    return ep
