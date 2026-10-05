# Workflows

Read only the section you need. Each one assumes the shared rules in `SKILL.md`:
never invent a metric, read the page before writing about it, and close with
"Start here".

Ask for the language and target market if they matter and were not given. Do not
ask about anything you can infer from the site itself.

---

## GSC audit

The highest-value workflow, and the only one working from measured data.

Ask for an export of Google Search Console: Performance, Search results, last 3
months, the Queries tab exported as CSV, then the same on the Pages tab. Both if
possible. These are measured figures, so never replace one with an estimate.

Work through four sections, each as its own table.

**1. One push from page one.** Rows between position 11 and 30 collecting
impressions and almost no clicks. Score by impressions multiplied by the distance
to position 10, highest first. For each, name the single change most likely to
move it and why that one.

Where a page is stuck rather than drifting, consider a contextual internal link
from the strongest page already ranking in that topic before anything heavier. It
is the cheapest intervention that reliably moves a stalled page, and practitioners
report jumps of several positions from one well-placed link.

**2. Pages competing with each other.** Any query where more than one of their
URLs appears. Name the URL that should own it, say what happens to the rest
(merge, redirect, retarget, or link inward), and give the reason. Flag the cases
where splitting the intent beats merging.

**3. Cooling off.** Pages whose clicks fell while impressions held or grew.
Separate those losing position from those holding position but losing clicks. The
fixes are opposite: one is a ranking problem, the other is a snippet or
answer-box problem.

**4. Seen and skipped.** Rows whose click-through rate is far below what the
position should earn. Judge whether the cause is the title, the snippet, or an
answer box absorbing the click, and write a replacement title and meta
description for the worst five.

Quote real figures rather than describing them vaguely. Never invent a row. If a
section needs a column the export lacks, name the missing column and skip it.

---

## Traffic drop

Rule things out in order of how cheap they are to check. Do not reach for "it was
a core update" until the mechanical causes are eliminated. Most drops blamed on
algorithms turn out to be self-inflicted.

Get the URL, roughly when it dropped, and whether it was an overnight collapse, a
slow decline, or only part of the site.

State for each step whether it is ruled in, ruled out, or needs something only
they can check.

**1. Is it even visible.** Fetch the page twice, once with JavaScript rendering
and once without, and compare. If the non-rendered version is an empty shell, that
is very likely the whole answer: the site looks perfect in a browser and arrives
at a crawler as nothing. Name the framework signature, then point them at Search
Console, URL Inspection, Test Live URL, Rendered HTML.

**2. Did we lock the door.** robots.txt rules, including ones blocking crawler
variants such as Googlebot-Image or Google-InspectionTool rather than the main
agent. Then noindex tags, canonicals pointing elsewhere, sitemap entries
disagreeing with canonicals, redirect chains, and hosting or DNS outages around
the date. Give the URL to check for each.

**3. Did we delete our own traffic.** Recent noindexing, pruning, consolidation,
permalink changes without redirects, a migration. Ask directly if the page cannot
tell you.

**4. Did we get hit.** Only now consider a core or spam update, a manual action,
or a link attack. Check what was actually confirmed around that date rather than
assuming the dates line up. Searching r/SEO for the same week is often faster than
any tool: if dozens of sites moved on that date it is an update, if nobody did it
is the site.

**5. Did demand move.** Separate a ranking loss from a loss of searches. The same
position against a shrinking query, or clicks lost to an answer panel while
impressions hold, look identical on a traffic chart and need opposite responses.

For each cause ruled in, say what recovery looks like and how long it realistically
takes. Be honest where recovery is slow or uncertain.

---

## Keyword clusters

Take a seed keyword and map the space into the ten strongest parent themes.

Return one markdown table: theme, term, searches, difficulty, intent, title, meta
description.

- One to five specific long-tail terms per theme, each on its own row. Specific
  beats broad. Never use filler terms such as introduction, overview or conclusion.
- Searches and difficulty carry `(guess)` unless retrieved.
- Intent says what the person is trying to do, then tags it commercial,
  transactional or informational.
- Titles someone would click, not the keyword restated.
- Meta descriptions 120 to 155 characters, leading with the value of the page.

No quotation marks inside cells. Do not narrate the method.

---

## AI citations

Read the "What not to recommend" section of `SKILL.md` before starting. Most
advice circulating on this topic is wrong, and repeating it costs the user real
work for nothing.

**1. The gate.** Write the title, meta description and URL slug, because those
decide whether the page is opened at all. Title under 60 characters, description
under 155. Say what each is competing against in the current results.

**2. Fan out the query.** The 8 to 12 sub-questions an engine is likely to spin
off, grouped by what the person wants: meaning, comparison, method, cost,
shortlist, problems, local, latest. That set is the coverage target.

**3. Quotability.** For an existing page, score it out of 100 and justify in three
to five lines: does it answer plainly, can a passage be lifted whole and still hold
up, is it specific, does it say anything the other results do not. Age is not a
criterion. Then list the sub-questions it fails to answer. For new content,
summarise what the current answers get wrong or skip.

**4. The content.** Open with a 40 to 60 word answer that stays correct when
lifted out alone. Every H2 answers its own question before elaborating. One
heading per fan-out question. Named entities, specific figures, named sources, a
comparison table where it fits. Four to six key points near the top, five to eight
FAQs. Name what this page knows that the existing results do not: first-hand
testing, original data, a case nobody else covers.

**5. Reachability, in three lines.** Does the content arrive in the HTML or only
after JavaScript, is the page crawlable and indexable, are the headings real
headings.

**6. Markup, optional.** JSON-LD for Article plus FAQPage, labelled as a
rich-result aid rather than a citation requirement.

---

## Competitor gap

Fetch the competing page first and prove you read it. Do not guess what is on it.

1. **Read what is there.** Subject and sub-subjects it genuinely covers, its
   structure, its arguments, its depth relative to length, the terms it chases.
2. **Find the openings.** Every gap must point at something the fetched page does
   or fails to do. Generic SEO advice that would apply to any page is worthless
   here.
3. **See the rest of the field.** Look at the other results and the answer panel
   for the same subject, so the new piece clears all of them.
4. **Outline the replacement.** The sub-subjects they missed, where depth pays, a
   structure easier to follow than theirs, current figures, the questions readers
   ask that their page ignores.
5. **Write it.** At least 10 to 20 percent longer than the measured word count.
   Terms used naturally. Suggested title tag and meta description.
6. **Internal links.** Two or three places one would belong, by anchor and
   destination.
7. **Sources.** Three to five external pages actually retrieved. No invented URLs,
   figures or dates. Mark anything unverified.

---

## Content refresh

Fetch the page, prove it, then look at what currently ranks for the target term.
Note today's date and treat anything older than twelve months as a freshness
candidate for classic search. This is about content decay, not AI citation, where
age does not matter.

Quick wins: a snapshot (length, heading outline, apparent terms, visible date, a
one-line verdict on intent match), the ten changes worth making as a Priority /
Change / Payoff / Time table, and rewrites of the title tag, meta description and
opening paragraph.

Full audit adds: what the winners carry that this page does not, what has gone
stale (figures, dates, prices, product names, screenshots, rules) with
replacements, credibility gaps, on-page issues including five internal link
suggestions, quotability, and a full prioritised plan.

Quote the actual text being changed and show the replacement beside it. Order by
expected impact. Nothing generic: every item points at something observed on the
page or in the competing results.

---

## Schema markup

One `<script type="application/ld+json">` block.

- Real values from the page. Obvious placeholders such as
  `REPLACE_WITH_AUTHOR_NAME` where a value is unknown. Never invent a price,
  rating, review count, date, address or phone number, because wrong markup is
  worse than none.
- Every required property for the type, and every recommended one with data.
- Nest properly: Organization as publisher, Person as author, ImageObject for
  images, BreadcrumbList for the path, `@id` references so nothing is written
  twice.
- ISO 8601 dates and durations. Include `inLanguage`.
- Strictly valid JSON: double quotes, no comments, no trailing commas.
- If the page carries an FAQ, steps, products or reviews, add the matching type to
  the same `@graph`.

Then a table of placeholders and where to find the real values, where the script
goes in WordPress / Shopify / plain HTML, how to check it with the Rich Results
Test and the Schema Markup Validator, and which rich result it makes the page
eligible for.

---

## Article draft

A first draft a human finishes, not a page to publish.

A headline someone would choose to click: concrete, carrying a number or question
where that is honest. No power-word padding.

Answer the questions people actually ask. Prefer a specific example over a general
claim. Name the source of any statistic, and where you have none, say the figure is
needed rather than inventing it.

Active sentences, varied length. Cut any sentence that only exists to transition.
Avoid stock openings, stock hedges, and announcing what the article will do before
doing it.

Close with a notes block: meta description under 155 characters, ten tags, five
long-tail tags, and three things a human must add that you could not, such as
first-hand experience, proprietary data, or a named source.
