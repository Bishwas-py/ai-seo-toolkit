# SEO Toolkit

Eight SEO and AI-search workflows for Claude and ChatGPT, built on measured data
rather than invented numbers. MIT licensed.

| Workflow | What it does |
|---|---|
| `gsc_audit` | Reads a Search Console export: striking distance, cannibalisation, decay, click-through gaps |
| `traffic_drop` | Diagnoses lost rankings in cost order, rendering and crawl before any talk of an update |
| `keyword_clusters` | Seed keyword into themes, long-tails, intent, titles, metas |
| `ai_citations` | Getting quoted by AI answers, from Google's published guidance |
| `competitor_gap` | Reads the page that outranks you, writes past it |
| `content_refresh` | Audits a page you own against what currently ranks |
| `schema_markup` | Valid JSON-LD, placeholders instead of invented values |
| `article_draft` | A first draft a human finishes |

## Install

In claude.ai or the Claude desktop app, go to **Customize > Plugins > Add > Add
marketplace** and enter:

```
Bishwas-py/ai-seo-toolkit
```

Then select **AI SEO Toolkit** and **Add**.

From Claude Code instead:

```bash
/plugin marketplace add Bishwas-py/ai-seo-toolkit
/plugin install ai-seo-toolkit@webmatrices
```

That is the whole install. It covers chat on web, desktop and mobile, Cowork,
and Claude Code from one account. To pick up a new version later, run
`/plugin update ai-seo-toolkit@webmatrices`, or turn on auto-update for the
marketplace.

## Pair with MCP Browser

Every workflow that touches a URL must fetch the page and prove it read it. A
plain HTTP fetch cannot distinguish a genuinely thin page from one that only
looks empty to a fetcher, and that distinction is the entire diagnosis when a
site renders through JavaScript.

[MCP Browser](https://webmatrices.com/mcpbrowser) drives real Chrome with your
signed-in session, so the toolkit can render JavaScript, fetch both ways and
compare, and read Reddit, BlackHatWorld and forums behind a login.

```bash
brew install --cask bishwas-py/tap/mcpbrowser
```

macOS on Apple Silicon, free for 50 requests a day. Everything here works
without it, and will say in one line when it could not verify rendering.

## What it refuses to recommend

Google publishes an
[AI optimisation guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide)
that contradicts most of what is sold as GEO and AEO. These workflows encode the
guide. They will not tell you to add an `llms.txt` file, chunk your content,
write in a special style for AI, treat structured data as a citation
requirement, or buy brand mentions, and they will push back if asked.

Two findings they do hold to: a page must be indexed and eligible to show with a
snippet before it can appear in a generative answer, and across 1.4 million
prompts the title, snippet and URL decided whether a page was opened at all,
while the average cited page was around 500 days old.

## Develop

```bash
npm install
npm test                             # drives the real server over stdio
npm start                            # run the server directly
claude --plugin-dir .                # load the plugin from this working copy
claude plugin validate .             # check the manifest and components
```

`server/workflows.js` is the single source of truth. Each workflow declares its
arguments once, and the server derives both the MCP prompt and the MCP tool from
that declaration, so the two can never drift apart.

## Release

Pushing a tag is the whole release.

```bash
npm version patch && git push --follow-tags
```

That bumps `package.json`, mirrors the number into `.claude-plugin/plugin.json`
through the `version` lifecycle hook, commits, tags, and pushes. CI then runs
the tests, refuses to continue if the tag disagrees with `package.json`,
publishes the server to npm and cuts a GitHub release with generated notes.

Installed plugins pick the new version up from this repository on their own.
The npm package is what `.mcp.json` starts, so it is plumbing rather than
something anyone installs by hand.

There is no `NPM_TOKEN`. The workflow authenticates with
[npm trusted publishing](https://docs.npmjs.com/trusted-publishers/), which
exchanges a short-lived GitHub OIDC token for publish rights and attaches
provenance automatically, so there is no long-lived credential to leak or
rotate.

### One-time setup

Trusted publishing is configured on an existing package, so the first publish is
manual:

```bash
npm login
npm publish            # claims the name
```

Then on npmjs.com, under the package's Settings, add a trusted publisher:
repository `Bishwas-py/ai-seo-toolkit`, workflow `release.yml`. Every release
after that is the one-liner above.

The repository must also be public before the release asset is downloadable by
anyone else. While it is private, the download link on the landing page returns
404 for everyone but you.

The test suite asserts the MCP surface over a real stdio connection and checks
the content guarantees, including that no workflow recommends a tactic Google
has said does not work.
