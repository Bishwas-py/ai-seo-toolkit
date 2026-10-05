// The eight workflows, as composable instruction blocks.
// Each entry declares its arguments once; the server derives both the MCP
// prompt and the MCP tool from that single declaration.

export const TONGUES = [
    'English', 'Arabic', 'Dutch', 'French', 'German', 'Hindi', 'Hungarian', 'Indonesian',
    'Italian', 'Korean', 'Latvian', 'Romanian', 'Slovenian', 'Spanish', 'Swedish',
    'Thai', 'Turkish', 'Urdu'
];

export const REGIONS = [
    'Worldwide', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'New Zealand', 'Ireland', 'India', 'Singapore', 'South Africa', 'United Arab Emirates',
    'Germany', 'France', 'Spain', 'Netherlands'
];

const DEFAULTS = { tongue: 'English', region: 'Worldwide' };

// --- shared blocks ---------------------------------------------------------

const HONESTY = `Never invent a metric. Search volume, keyword difficulty and ranking positions are either retrieved or they are guesses. Open with one line stating which you have: a connected SEO data source, live browsing, or neither. Mark every unretrieved figure (guess). A confident fabricated number is worse than an admitted gap, because work gets planned around it.`;

const FETCH_PREF = `Fetch pages with MCP Browser's browse_anything using js=true, so JavaScript renders and the signed-in session is used. A plain HTTP fetch cannot tell a genuinely thin page from one that only looks empty to a fetcher, and that difference matters in every judgement below. If MCP Browser is unavailable, use whatever fetch tool you have and say in one line that you could not verify rendering.`;

const START_HERE = `Close with a table headed "Start here": the three changes with the most upside, as columns Change, Payoff, Time (under 30 minutes / 1 to 3 hours / half a day or more).`;

function locale(region) {
    if (!region || region === REGIONS[0]) {
        return 'Market: work it out from the language, spelling, currency or domain in front of you, then state in one line which market and search locale you settled on.';
    }
    return `Market: ${region}. Use that market's results, volumes and spelling conventions, and name the search locale you used in one line.`;
}

function proveFetch(label, url) {
    return `${label}: ${url}

${FETCH_PREF}

Retrieve the page before anything else. Memory and assumption are not substitutes. If it will not load for any reason (bot protection, paywall, sign-in wall, robots rule, empty shell, client-side rendering), name the reason in one line, ask for the text, and stop.

Then show you read it. Lead with: title and H1 word for word; every H2 and H3 in order; an approximate word count; the published or updated date, or "none shown"; and two short direct quotes. Write "none found" for anything absent rather than filling the gap.`;
}

// --- argument helpers ------------------------------------------------------

const tongue = { name: 'tongue', description: `Output language, e.g. ${TONGUES.slice(0, 4).join(', ')}`, required: false };
const region = { name: 'region', description: `Target market, e.g. ${REGIONS.slice(1, 4).join(', ')}`, required: false };

const v = (args, key) => (args[key] || DEFAULTS[key] || '').trim();

// --- the workflows ---------------------------------------------------------

export const WORKFLOWS = [
    {
        name: 'gsc_audit',
        title: 'Search Console audit',
        description: 'Turn a Google Search Console export into a ranked fix list: striking distance, cannibalisation, decay and click-through gaps. Works from measured data, not estimates.',
        args: [
            { name: 'focus', description: 'Limit to a section or path, e.g. /blog', required: false },
            tongue, region
        ],
        build: (a) => `Act as a search analyst working from the user's own Google Search Console export. Those are measured numbers, so never replace a figure in the file with one of your own.

If no export has been provided, stop and ask for one, naming the exact path: Search Console, Performance, Search results, set the range to the last 3 months, open the Queries tab and export CSV, then do the same on the Pages tab, and attach both.

${v(a, 'focus') ? `Only consider rows under: ${v(a, 'focus')}` : 'Consider the whole export.'}

${locale(v(a, 'region'))}

Answer in ${v(a, 'tongue')}, each section as its own table.

1. One push from page one. Rows between position 11 and 30 that collect impressions and almost no clicks. Score by impressions multiplied by the distance to position 10 and order by that score. For each, name the single change most likely to move it and why that one. Where a page is stuck rather than drifting, weigh a contextual internal link from the strongest page already ranking in that topic before anything heavier: it is the cheapest intervention that reliably moves a stalled page.

2. Pages competing with each other. Any query where more than one of their URLs appears. Name the URL that should own it, say what happens to the rest (merge, redirect, retarget or link inward), and give the reason. Flag where splitting the intent beats merging.

3. Cooling off. Pages whose clicks fell while impressions held or rose. Separate those losing position from those holding position but losing clicks, because the fixes are opposite.

4. Seen and skipped. Rows whose click-through rate is far below what their position should earn. Judge whether the cause is the title, the snippet or an answer box absorbing the click, and write a replacement title and meta description for the worst five.

Quote the real figures rather than describing them vaguely, never invent a row, and if a section needs a column the export lacks, name the missing column and skip it.

${START_HERE}`
    },
    {
        name: 'traffic_drop',
        title: 'Traffic drop diagnosis',
        description: 'Diagnose lost rankings or traffic in cost order: rendering, indexing and crawl before any talk of an algorithm update.',
        args: [
            { name: 'url', description: 'Affected site or page URL', required: true },
            { name: 'when', description: 'Roughly when it dropped, e.g. late September', required: false },
            { name: 'shape', description: 'overnight | slow | partial', required: false },
            tongue, region
        ],
        build: (a) => `Diagnose a loss of search traffic. Work like an investigator: rule things out in order of how cheap they are to check, and do not reach for "it was a core update" until the mechanical causes are eliminated. Most drops blamed on algorithms turn out to be self-inflicted.

${proveFetch('Affected site or page', v(a, 'url'))}

Drop shape: ${{ overnight: 'fell off a cliff within a day or two', slow: 'drained slowly over weeks or months', partial: 'only part of the site lost traffic' }[v(a, 'shape')] || 'not stated, so ask if the answer depends on it'}.
${v(a, 'when') ? `Reported timing: ${v(a, 'when')}.` : 'Timing not given, so ask for it if the answer depends on it.'}

${locale(v(a, 'region'))}

Answer in ${v(a, 'tongue')}. Say for each step whether it is ruled in, ruled out, or needs something only the user can check.

1. Is it even visible. Fetch the page twice, once with JavaScript rendering and once without, and compare. If the unrendered version is an empty shell, that is very likely the whole answer: the site looks perfect in a browser and arrives at a crawler as nothing. Name the framework signature, then give the exact check: Search Console, URL Inspection, Test Live URL, Rendered HTML.

2. Did we lock the door. robots.txt rules, including ones blocking crawler variants such as Googlebot-Image or Google-InspectionTool rather than the main agent. Then noindex tags, canonicals pointing elsewhere, sitemap entries disagreeing with canonicals, redirect chains, and hosting or DNS outages around the date. Give the URL to check for each.

3. Did we delete our own traffic. Recent noindexing, pruning, consolidation, permalink changes without redirects, a migration. Ask directly if the page cannot tell you.

4. Did we get hit. Only now consider a core or spam update, a manual action, or a link attack. Check what was actually confirmed around that date rather than assuming the dates line up. Searching r/SEO or r/bigseo for that week is often the fastest test: if many sites moved on that date it is an update, if nobody did it is this site.

5. Did demand move. Separate a ranking loss from a loss of searches. The same position against a shrinking query, and clicks lost to an answer panel while impressions hold, look identical on a traffic chart and need opposite responses.

For each cause ruled in, say what recovery looks like and how long it realistically takes. Be honest where recovery is slow or uncertain. Nothing generic: every item points at something you observed or are explicitly asking the user to look up.

${START_HERE}`
    },
    {
        name: 'keyword_clusters',
        title: 'Keyword clustering',
        description: 'Turn a seed keyword into themed clusters with long-tail terms, intent, titles and meta descriptions.',
        args: [
            { name: 'seed', description: 'Seed keyword', required: true },
            { name: 'width', description: 'Terms per cluster: 1, 3 or 5', required: false },
            tongue, region
        ],
        build: (a) => {
            const width = ['1', '3', '5'].includes(v(a, 'width')) ? v(a, 'width') : '3';
            return `Act as a search strategist working in fluent ${v(a, 'tongue')}.

${HONESTY}

${locale(v(a, 'region'))}

Seed term: ${v(a, 'seed')}

Map the space around that seed into the ten strongest parent themes. Return one markdown table, nothing before it and nothing after it except the closing section.

Columns in this order: theme, term, searches, difficulty, intent, title, meta description.

- theme: the parent theme the row belongs to.
- term: ${width} specific long-tail ${width === '1' ? 'term' : 'terms'} per theme, each on its own row. Specific beats broad. Never use filler terms such as introduction, overview or conclusion.
- searches: monthly searches in the target market, with (guess) on anything not retrieved.
- difficulty: 0 to 100, same rule.
- intent: what the person is trying to do, then tagged commercial, transactional or informational.
- title: a headline somebody would click, not the keyword restated.
- meta description: 120 to 155 characters, leading with the value of the page and ending with a reason to click.

Write the table in ${v(a, 'tongue')}. No quotation marks or wrapping characters inside cells. Do not narrate your method.

${START_HERE}`;
        }
    },
    {
        name: 'ai_citations',
        title: 'AI citation optimisation',
        description: 'Get a page quoted by AI Overviews, AI Mode, ChatGPT search and Perplexity, using Google\'s published guidance rather than GEO folklore.',
        args: [
            { name: 'subject', description: 'URL to improve, or a topic to write about', required: true },
            tongue, region
        ],
        build: (a) => {
            const subject = v(a, 'subject');
            const isUrl = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(subject);
            return `Get content quoted by generative answers: AI Overviews, AI Mode, ChatGPT search, Perplexity, Claude, Copilot.

Work from how these systems demonstrably behave, not from circulating GEO advice. Four things are established and you must hold to them:

- Eligibility first. Google states a page must be indexed and eligible to appear with a snippet before it can surface in a generative answer. Ranking is the entry fee, not a parallel track.
- There is a gate before your prose. Across 1.4 million prompts, the title, snippet and URL decided whether a page was opened at all. Fix those before rewriting body copy.
- Fresh does not mean cited. The average cited page in that study was around 500 days old. Do not recommend chasing recency.
- Google explicitly says these are not needed: llms.txt or other special files, chunking content into fragments, writing in a special style for AI, structured data as a precondition, and bought or inauthentic mentions. Never recommend them. If you believe one applies here, say why in one line and flag it as your own opinion.

${isUrl
    ? `${proveFetch('Page to improve', subject)}\n\nThen look at what the current answer panels and top results say on the same subject.`
    : `Subject: ${subject}\n\n${FETCH_PREF}\n\nResearch what the current answer panels and top results already say, so the new piece covers their ground and goes past it.`}

${locale(v(a, 'region'))}

Work in ${v(a, 'tongue')}.

1. The gate. Write the title, meta description and URL slug that decide whether this page is opened at all. Title under 60 characters, description under 155. Say what each competes against in the current results.

2. Fan out the query. The 8 to 12 sub-questions an engine is likely to spin off, grouped by what the person wants: meaning, comparison, method, cost, shortlist, problems, local, latest. That set is the coverage target.

3. Quotability. ${isUrl
    ? 'Score the page out of 100 and justify it in three to five lines: does it answer plainly, can a passage be lifted whole and still hold up, is it specific, does it say anything the other results do not. Age is not a criterion. Then list the sub-questions it fails to answer.'
    : 'In three to five lines, say what the existing answers get wrong, skip or explain badly. That gap is what the new piece is for.'}

4. The content. Open with a 40 to 60 word answer that stays correct when lifted out alone, then let every H2 answer its own question before elaborating. One heading per fan-out question, four to six key points near the top, five to eight FAQs. Named entities, specific figures, named sources, a comparison table where it fits. Name what this page knows that the results do not: first-hand testing, original data, a case nobody else covers. Plain sentences, no hype.

5. Reachability, in three lines. Does the content arrive in the HTML or only after JavaScript, is the page crawlable and indexable, are the headings real headings.

6. Markup, optional. JSON-LD for Article plus FAQPage, labelled as a rich-result aid rather than a citation requirement.

${START_HERE}`;
        }
    },
    {
        name: 'competitor_gap',
        title: 'Competitor gap analysis',
        description: 'Read a page that outranks you, find what it is missing, and write the replacement.',
        args: [
            { name: 'url', description: 'URL of the page to beat', required: true },
            { name: 'voice', description: 'business | friendly | casual', required: false },
            tongue
        ],
        build: (a) => `Produce a piece that outranks a specific competing page. You do not get to guess what is on it.

${proveFetch('Page to beat', v(a, 'url'))}

Once the evidence block is out, work through this in ${v(a, 'tongue')}, in a ${v(a, 'voice') || 'business'} voice.

1. Read what is there. The subject and sub-subjects it genuinely covers, how it is structured, the arguments it makes, its depth relative to length, the terms it chases.

2. Find the openings. Every gap must point at something the fetched page does or fails to do. Generic advice that would apply to any page on the internet is worthless here.

3. See the rest of the field. Look at the other results and the answer panel for the same subject, so the new piece clears all of them rather than just this one.

4. Outline the replacement: the sub-subjects they missed, where more depth pays, a structure easier to follow than theirs, current figures, the questions readers ask that their page ignores.

5. Write it in full. At least 10 to 20 percent longer than the word count you measured. Terms used naturally rather than sprinkled. Suggested title tag and meta description.

6. Add two or three places an internal link would belong, by anchor and destination subject.

7. Cite three to five external sources you actually retrieved. No invented URLs, figures or dates. Mark anything unverified.

Order of output: evidence block, a short gap analysis, the piece beginning with its title, then "Start here".

${START_HERE}`
    },
    {
        name: 'content_refresh',
        title: 'Content refresh audit',
        description: 'Audit a page you own against what currently ranks, and say exactly what to change.',
        args: [
            { name: 'url', description: 'URL of your page', required: true },
            { name: 'target', description: 'Target keyword', required: false },
            { name: 'depth', description: 'quick | full', required: false },
            tongue, region
        ],
        build: (a) => `Audit a page the user owns that is no longer performing.

${proveFetch('Page to audit', v(a, 'url'))}

Target term: ${v(a, 'target') || 'not given. Work it out from the page and state it in the snapshot.'}

${locale(v(a, 'region'))}

Then look at what currently wins: the top five results and the answer panel for the target term in that market. Note today's date and treat anything on the page older than twelve months as a freshness candidate. This is content decay in classic search, not AI citation, where age does not matter.

Deliver in ${v(a, 'tongue')}.

${v(a, 'depth') === 'full'
    ? `Full audit.
1. Snapshot: length, heading outline, apparent primary and secondary terms, visible date, and a one-line verdict on intent match.
2. What the winners have that this page does not: sub-subjects, questions and formats (tables, tools, calculators, video), plus anything this page does better.
3. What has gone stale: figures, dates, prices, product and feature names, screenshots, rules, references, each with its replacement.
4. Credibility: first-hand experience, a named author with real credentials, sourcing, trust signals that are thin or missing.
5. On the page: title tag, meta description, H1, heading order, where the target term sits in the first hundred words, image alt text, and five internal links by anchor and destination.
6. Quotability: does it answer directly, does it carry an FAQ, are entities named consistently. Supply the 40 to 60 word answer paragraph it should open with.
7. The plan: one table, columns Priority, Change, Payoff, Time.
8. The rewrites: title tag under 60 characters, meta description under 155, a replacement opening paragraph, and a full rewrite of any section you marked for one.`
    : `Quick wins only.
1. Snapshot: length, heading outline, apparent primary and secondary terms, visible date, a one-line verdict on intent match.
2. The ten changes worth making: one table, columns Priority, Change, Payoff, Time. Nothing that cannot be finished inside a day in total.
3. The rewrites: title tag under 60 characters, meta description under 155, and a replacement opening paragraph written answer-first.`}

Quote the real text when proposing a change and show the replacement beside it. Order by expected impact, not by the order you noticed things. Nothing generic: every item points at something on the page or in the competing results.`
    },
    {
        name: 'schema_markup',
        title: 'Schema markup',
        description: 'Valid JSON-LD for any Schema.org type, with placeholders instead of invented values.',
        args: [
            { name: 'subject', description: 'Page URL, or a description of the page', required: true },
            { name: 'type', description: 'Schema type, or leave blank to detect', required: false },
            { name: 'output', description: 'notes | code', required: false }
        ],
        build: (a) => {
            const subject = v(a, 'subject');
            const isUrl = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(subject);
            return `Write Schema.org structured data that passes validation and qualifies for rich results.

${isUrl ? proveFetch('Page', subject) : `The page: ${subject}`}

Type: ${v(a, 'type') || 'work it out from the page and say which you chose and why, in one line'}

Requirements:
- One <script type="application/ld+json"> block.
- Real values from the page. Where a value is genuinely unknown use an obvious placeholder such as REPLACE_WITH_AUTHOR_NAME. Never invent a price, rating, review count, date, address or phone number, because wrong markup is worse than none.
- Follow Google's guidelines for the type: every required property, and every recommended one you have data for.
- Nest properly: Organization as publisher, Person as author, ImageObject for images, BreadcrumbList for the path, and @id references so an entity is never written twice.
- ISO 8601 for dates and durations. Include inLanguage.
- Strictly valid JSON: double quotes, no comments, no trailing commas.
- If the page clearly carries an FAQ, steps, products or reviews, add the matching type to the same @graph.

${v(a, 'output') === 'code'
    ? 'Output the code block and nothing else, before or after.'
    : `Follow the code with:
1. A table of every placeholder and where to find the real value.
2. Where the script goes, and how to add it in WordPress, Shopify and plain HTML.
3. How to check it: the Rich Results Test and the Schema Markup Validator.
4. Which rich result this makes the page eligible for, and what the page itself must also do to qualify.`}`;
        }
    },
    {
        name: 'article_draft',
        title: 'Article draft',
        description: 'A first draft a human finishes, ending with the three things only they can add.',
        args: [
            { name: 'topic', description: 'Title or topic', required: true },
            { name: 'length', description: 'Approximate word count, e.g. 1000', required: false },
            { name: 'voice', description: 'business | friendly | casual', required: false },
            tongue
        ],
        build: (a) => `Write a ${v(a, 'length') || '1000'} word article in ${v(a, 'tongue')} on: ${v(a, 'topic')}

Treat this as a first draft a human will finish, not a page to publish as it stands.

Shape: a headline, an opening that earns the next paragraph, a body under real headings, and an ending that does not simply restate the piece.

The headline should be one somebody would choose to click: concrete, specific, carrying a number or a question where that is honest. No power-word padding.

In the body, answer the questions people genuinely ask about this subject. Prefer a specific example over a general claim. Where a statistic would help, name its source, and where you do not have one, say the figure is needed rather than inventing it.

Write in a ${v(a, 'voice') || 'business'} voice, in active sentences. Vary sentence length. Cut any sentence that only exists to transition. Avoid the stock openings, the stock hedges, and the habit of announcing what the article will do before doing it.

Finish with a short notes block after the article:
- a meta description under 155 characters
- ten tags
- five long-tail tags
- three things a human should add that you could not: first-hand experience, proprietary data, or a named source

No code block around the article, and no commentary about having written it.`
    }
];

export const byName = (name) => WORKFLOWS.find((w) => w.name === name);
