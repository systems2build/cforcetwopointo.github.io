import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync('index.html', 'utf8');
const css = readFileSync('styles.css', 'utf8');
test('site uses semantic landmarks and a single H1', () => {
  assert.match(html, /<html lang="en">/);
  for(const tag of ['header','nav','main','footer']) assert.match(html,new RegExp('<'+tag+'\\b'));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.match(html,/href="#main"/);
  assert.match(html,/id="main"/);
});
test('in-page navigation targets exist', () => {
  for(const [,anchor] of html.matchAll(/href="#([^"]+)"/g)) {
    assert.ok(html.includes('id="'+anchor+'"'),'missing #'+anchor);
  }
});
test('site has keyboard focus and reduced-motion styles', () => {
  assert.match(css,/:focus-visible/);
  assert.match(css,/prefers-reduced-motion:\s*reduce/);
  assert.match(css,/@media \(max-width: 740px\)/);
});
test('contains no outbound tracking scripts or forms', () => {
  assert.doesNotMatch(html,/<script\b/i);
  assert.doesNotMatch(html,/<form\b/i);
  assert.doesNotMatch(html,/(?:google-analytics|gtag|facebook-pixel)/i);
});
