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

**Claude Desktop, one click.** Download `ai-seo-toolkit.mcpb` from
[releases](https://github.com/bishwas-py/ai-seo-toolkit/releases) and
double-click it.

**Claude Code.**

```bash
claude mcp add ai-seo -- npx -y ai-seo-toolkit
```

**Codex, Cursor, Windsurf, Zed, VS Code.** Add a stdio MCP server:

```json
{
  "mcpServers": {
    "ai-seo": {
      "command": "npx",
      "args": ["-y", "ai-seo-toolkit"]
    }
  }
}
```

**As a file-based skill.** Copy `ai-seo-toolkit/` into `~/.claude/skills/` (user
wide) or `.claude/skills/` (one project). No server, no install step; the client
reads `SKILL.md` and loads `references/workflows.md` when a workflow applies.

**In the browser.** The same workflows ship as a Chrome extension for claude.ai
and chatgpt.com.

## Two ways in, and why both exist

The MCP server and the file-based skill carry the same eight workflows.

The **server** is the one-click path and the only thing that works in Claude
Desktop, where there is no filesystem to drop a skill into. It also exposes each
workflow as a named command in the client UI.

The **skill** is better in a coding agent, because the agent reads it as context
and applies the rules while doing other work, rather than needing an explicit
call.

If you install both, prefer the skill and ignore the server's tools; they will
otherwise say the same thing twice.

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
npm test          # drives the real server over stdio
npm start         # run the server directly
npx @anthropic-ai/mcpb pack .   # rebuild the .mcpb
```

`server/workflows.js` is the single source of truth. Each workflow declares its
arguments once, and the server derives both the MCP prompt and the MCP tool from
that declaration, so the two can never drift apart.

## Release

Two independent channels. npm serves the `npx` installs, the GitHub release
serves the one-click `.mcpb`. Neither blocks the other, but the version lives in
two files and the test suite fails if they disagree.

```bash
npm version patch                 # bumps package.json only
# mirror the same number into manifest.json
npm test                          # fails if the two disagree
npm publish                       # npx -y ai-seo-toolkit now resolves

npx @anthropic-ai/mcpb pack . ai-seo-toolkit.mcpb
gh release create "v$(node -p "require('./package.json').version")" \
  ai-seo-toolkit.mcpb \
  --title "v$(node -p "require('./package.json').version")" \
  --notes "One-click install for Claude Desktop. Download the .mcpb and double-click it."
```

The release asset is only downloadable by the public once the repository is
public. While it is private, the download link on the landing page returns 404
for everyone but you.

The test suite asserts the MCP surface over a real stdio connection and checks
the content guarantees, including that no workflow recommends a tactic Google
has said does not work.
