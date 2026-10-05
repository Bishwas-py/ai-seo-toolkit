// Run with: node test.js
// Drives the real server over stdio and asserts the MCP surface it exposes.

import { spawn } from 'node:child_process';
import assert from 'node:assert';
import { WORKFLOWS } from './server/workflows.js';

function talk(messages) {
    return new Promise((resolve, reject) => {
        const child = spawn('node', [`${import.meta.dirname}/server/index.js`], { stdio: ['pipe', 'pipe', 'pipe'] });
        const out = [];
        let buffer = '';
        let stderr = '';
        child.stderr.on('data', (d) => { stderr += d; });
        child.stdout.on('data', (chunk) => {
            buffer += chunk;
            let cut;
            while ((cut = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, cut).trim();
                buffer = buffer.slice(cut + 1);
                if (!line) continue;
                out.push(JSON.parse(line));
                if (out.length === messages.length) {
                    child.kill();
                    resolve(out);
                }
            }
        });
        child.on('error', reject);
        child.on('exit', () => {
            if (out.length < messages.length) reject(new Error(`server exited early. stderr: ${stderr}`));
        });
        for (const m of messages) child.stdin.write(`${JSON.stringify(m)}\n`);
    });
}

const hello = {
    jsonrpc: '2.0', id: 0, method: 'initialize',
    params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'test', version: '1' } }
};

let passed = 0;
const check = async (name, fn) => {
    try { await fn(); passed++; }
    catch (e) { console.error(`FAIL  ${name}\n      ${e.message}`); process.exitCode = 1; }
};

await check('the server initializes and declares prompts and tools', async () => {
    const [res] = await talk([hello]);
    assert.ok(res.result, JSON.stringify(res));
    assert.ok(res.result.capabilities.prompts, 'no prompts capability');
    assert.ok(res.result.capabilities.tools, 'no tools capability');
    assert.strictEqual(res.result.serverInfo.name, 'ai-seo-toolkit');
});

await check('every workflow is listed as both a prompt and a tool', async () => {
    const [, prompts, tools] = await talk([
        hello,
        { jsonrpc: '2.0', id: 1, method: 'prompts/list', params: {} },
        { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }
    ]);
    const pNames = prompts.result.prompts.map((p) => p.name).sort();
    const tNames = tools.result.tools.map((t) => t.name).sort();
    const want = WORKFLOWS.map((w) => w.name).sort();
    assert.deepStrictEqual(pNames, want, 'prompt list drifted');
    assert.deepStrictEqual(tNames, want, 'tool list drifted');
    assert.strictEqual(want.length, 8);
});

await check('a tool call returns usable instructions', async () => {
    const [, res] = await talk([
        hello,
        {
            jsonrpc: '2.0', id: 1, method: 'tools/call',
            params: { name: 'gsc_audit', arguments: { focus: '/blog', region: 'United Kingdom' } }
        }
    ]);
    const text = res.result.content[0].text;
    assert.ok(!res.result.isError, text);
    assert.ok(text.includes('/blog'), 'focus was dropped');
    assert.ok(text.includes('United Kingdom'), 'market was dropped');
    assert.ok(text.includes('position 11 and 30'), 'striking distance section missing');
    assert.ok(text.length > 800, 'suspiciously short');
});

await check('a missing required argument is refused, not guessed', async () => {
    const [, res] = await talk([
        hello,
        { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'traffic_drop', arguments: {} } }
    ]);
    assert.strictEqual(res.result.isError, true, JSON.stringify(res.result));
    assert.ok(/url/.test(res.result.content[0].text), res.result.content[0].text);
});

await check('a prompt renders a user message', async () => {
    const [, res] = await talk([
        hello,
        {
            jsonrpc: '2.0', id: 1, method: 'prompts/get',
            params: { name: 'keyword_clusters', arguments: { seed: 'hydroponic lettuce', width: '5' } }
        }
    ]);
    const msg = res.result.messages[0];
    assert.strictEqual(msg.role, 'user');
    assert.ok(msg.content.text.includes('hydroponic lettuce'), 'seed was dropped');
    assert.ok(msg.content.text.includes('5 specific long-tail terms'), 'width was dropped');
});

await check('an unknown workflow is an error, not a crash', async () => {
    const [, res] = await talk([
        hello,
        { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'nope', arguments: {} } }
    ]);
    assert.strictEqual(res.result.isError, true);
});

// --- content guarantees, so the open-source copy cannot drift from the facts.
await check('no workflow recommends the debunked GEO tactics', async () => {
    const banned = /llms\.txt|chunk your content|write specially for AI/i;
    for (const w of WORKFLOWS) {
        const args = Object.fromEntries(w.args.map((a) => [a.name, a.required ? 'https://example.com/page' : '']));
        const text = w.build(args);
        if (w.name === 'ai_citations') continue; // names them in order to forbid them
        assert.ok(!banned.test(text), `${w.name} recommends a debunked tactic`);
    }
});

await check('AI citations forbids the myths rather than repeating them', async () => {
    const text = WORKFLOWS.find((w) => w.name === 'ai_citations').build({ subject: 'https://example.com/p' });
    assert.ok(/Never recommend them/.test(text), 'myths are not forbidden');
    assert.ok(/500 days old/.test(text), 'freshness finding missing');
    assert.ok(/indexed and eligible/.test(text), 'eligibility finding missing');
});

await check('every workflow builds cleanly from its required arguments alone', async () => {
    for (const w of WORKFLOWS) {
        const args = Object.fromEntries(w.args.filter((a) => a.required).map((a) => [a.name, 'https://example.com/page']));
        const text = w.build(args);
        assert.ok(typeof text === 'string' && text.length > 300, `${w.name} produced nothing`);
        assert.ok(!/undefined|\[object |NaN/.test(text), `${w.name} leaked a value`);
    }
});

if (!process.exitCode) console.log(`ok  ${passed} checks passed`);
