// package.json is the one place a version is edited. `npm version` bumps it,
// then calls this through the `version` lifecycle hook to mirror the number
// into the plugin manifest before the release commit is made.
import { readFileSync, writeFileSync } from 'node:fs';

const MANIFEST = '.claude-plugin/plugin.json';
const root = new URL('..', import.meta.url);
const read = (name) => JSON.parse(readFileSync(new URL(name, root), 'utf8'));

const pkg = read('package.json');
const plugin = read(MANIFEST);

if (plugin.version === pkg.version) {
    console.log(`${MANIFEST} already at ${pkg.version}`);
    process.exit(0);
}

plugin.version = pkg.version;
writeFileSync(new URL(MANIFEST, root), `${JSON.stringify(plugin, null, 2)}\n`);
console.log(`${MANIFEST} synced to ${pkg.version}`);
