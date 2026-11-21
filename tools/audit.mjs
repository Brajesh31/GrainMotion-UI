#!/usr/bin/env node
// Structural audit for the GrainMotion-UI repository.
// This checks source inventory, demos, documentation, registry wiring and build assets.
// It does not claim that a component's interaction or visual rendering is correct.
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SPEC } from './spec.mjs';
import { NAMES, SOUNDS, ART } from './build.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const required = (relativePath, reason) => {
  const absolutePath = join(root, relativePath);
  if (!existsSync(absolutePath) || !statSync(absolutePath).isFile() || statSync(absolutePath).size === 0) {
    failures.push(`${relativePath}: missing or empty (${reason})`);
    return false;
  }
  return true;
};
const readJson = (relativePath) => {
  try {
    return JSON.parse(readFileSync(join(root, relativePath), 'utf8'));
  } catch (error) {
    failures.push(`${relativePath}: could not be parsed as JSON (${error.message})`);
    return null;
  }
};
const duplicates = (values) => values.filter((value, index) => values.indexOf(value) !== index);
const sorted = (values) => [...values].sort();

if (SPEC.length !== 50) failures.push(`tools/spec.mjs: expected 50 component entries, found ${SPEC.length}`);
if (NAMES.length !== 50) failures.push(`tools/build.mjs: expected 50 build entries, found ${NAMES.length}`);

const specIds = SPEC.map((component) => component.id);
const buildIds = [...NAMES];
if (duplicates(specIds).length) failures.push(`tools/spec.mjs: duplicate IDs: ${duplicates(specIds).join(', ')}`);
if (duplicates(SPEC.map((component) => component.tag)).length) failures.push('tools/spec.mjs: duplicate custom-element tags');
if (JSON.stringify(sorted(specIds)) !== JSON.stringify(sorted(buildIds))) {
  failures.push('tools/spec.mjs and tools/build.mjs do not contain the same component IDs');
}

const registry = readJson('registry.json');
const registryItems = Array.isArray(registry?.items) ? registry.items : [];
if (registryItems.length !== 50) failures.push(`registry.json: expected 50 entries, found ${registryItems.length}`);
if (duplicates(registryItems.map((item) => item.name)).length) failures.push('registry.json: duplicate component names');

for (const component of SPEC) {
  const { id, tag } = component;
  if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    failures.push(`Invalid component ID: ${String(id)}`);
    continue;
  }
  if (!tag || !tag.startsWith('sand-')) failures.push(`${id}: custom element must use the sand- prefix`);

  const sourcePath = `${id}/${id}.js`;
  const readmePath = `${id}/README.md`;
  const demoPath = `${id}/index.html`;
  const sourceExists = required(sourcePath, 'standalone component source');
  const readmeExists = required(readmePath, 'component guide');
  const demoExists = required(demoPath, 'working demo page');

  if (sourceExists) {
    const source = readFileSync(join(root, sourcePath), 'utf8');
    if (!source.includes(tag)) failures.push(`${sourcePath}: custom-element tag ${tag} is not referenced`);
    if (!source.includes('// >>> grainmotion-ui core') || !source.includes('// <<< grainmotion-ui core')) {
      failures.push(`${sourcePath}: standalone shared-core stamp markers are missing`);
    }
  }
  if (readmeExists) {
    const readme = readFileSync(join(root, readmePath), 'utf8');
    if (!readme.includes(tag)) failures.push(`${readmePath}: guide does not mention ${tag}`);
  }
  if (demoExists) {
    const demo = readFileSync(join(root, demoPath), 'utf8');
    if (!demo.includes(`<${tag}`)) failures.push(`${demoPath}: demo does not render ${tag}`);
    const scriptPattern = new RegExp(`<script\\b[^>]*\\bsrc=["']${id}\\.js["']`, 'i');
    if (!scriptPattern.test(demo)) failures.push(`${demoPath}: demo does not load its standalone ${id}.js script`);
  }

  const registryItem = registryItems.find((item) => item.name === id);
  if (!registryItem) {
    failures.push(`registry.json: missing entry for ${id}`);
  } else if (!registryItem.files?.some((file) => file.path === sourcePath)) {
    failures.push(`registry.json: ${id} does not point to ${sourcePath}`);
  }

  const soundMap = SOUNDS[id];
  if (!soundMap || Object.keys(soundMap).length === 0) failures.push(`tools/build.mjs: no sound/build entry for ${id}`);
}

for (const [componentId, soundMap] of Object.entries(SOUNDS)) {
  for (const file of Object.values(soundMap)) required(`sounds/${file}`, `sound asset for ${componentId}`);
}
for (const [componentId, artMap] of Object.entries(ART)) {
  for (const file of Object.values(artMap)) required(`art/${file}`, `art asset for ${componentId}`);
}

for (const path of [
  'core.js',
  'tools/build.mjs',
  'tools/docs.mjs',
  'tools/spec.mjs',
  'tools/test.mjs',
  'skills/grainmotion-ui/SKILL.md',
  'skills/grainmotion-ui/core.js',
  'docs/ARCHITECTURE.md',
  'docs/DESIGN-SYSTEM.md',
  'docs/COMPONENT-CONTRACT.md',
  'docs/PHASE-0-FOUNDATION-AUDIT.md',
  'design/tokens.css',
]) required(path, 'Phase 0 foundation file');

if (failures.length) {
  console.error(`GrainMotion-UI structural audit failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  const sourceBytes = SPEC.reduce((sum, component) => sum + statSync(join(root, component.id, component.id + '.js')).size, 0);
  console.log('GrainMotion-UI structural audit passed.');
  console.log(`- Components in spec/build/registry: ${SPEC.length}/${NAMES.length}/${registryItems.length}`);
  console.log('- Every component has a non-empty standalone source, README and demo.');
  console.log('- Every demo loads its matching standalone script and renders its custom element.');
  console.log('- Every standalone source contains the shared-core stamp markers.');
  console.log('- Every configured sound and art asset exists.');
  console.log(`- Combined standalone JavaScript source size: ${(sourceBytes / 1024 / 1024).toFixed(2)} MiB`);
  console.log('Note: this is a structural inventory check, not a functional, visual, accessibility or browser-compatibility test.');
}
