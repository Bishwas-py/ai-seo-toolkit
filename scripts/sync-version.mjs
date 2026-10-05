// package.json is the one place a version is edited. `npm version` bumps it,
// then calls this through the `version` lifecycle hook to mirror the number
// into manifest.json before the release commit is made.
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const read = (name) => JSON.parse(readFileSync(new URL(name, root), 'utf8'));

const pkg = read('package.json');
const manifest = read('manifest.json');

if (manifest.version === pkg.version && manifest.name === pkg.name) {
    console.log(`manifest.json already at ${pkg.version}`);
    process.exit(0);
}

manifest.version = pkg.version;
manifest.name = pkg.name;
writeFileSync(new URL('manifest.json', root), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`manifest.json synced to ${pkg.version}`);
