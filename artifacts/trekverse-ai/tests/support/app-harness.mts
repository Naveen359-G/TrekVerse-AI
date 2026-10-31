import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { act, createElement } from 'react';

// Install a private browser before importing react-dom so React detects DOM
// input support correctly. No real user storage or network is involved.
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'https://trekverse.test/',
});
for (const [key, value] of Object.entries({
  window: dom.window,
  document: dom.window.document,
  navigator: dom.window.navigator,
  localStorage: dom.window.localStorage,
  HTMLElement: dom.window.HTMLElement,
  IS_REACT_ACT_ENVIRONMENT: true,
})) {
  Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
}
const { createRoot } = await import('react-dom/client');
const { default: App } = await import('../../src/App.tsx');
let root: ReturnType<typeof createRoot> | undefined;

export function stored<T = any>(key = 'tv-adventure'): T {
  const value = localStorage.getItem(key);
  assert.notEqual(value, null, `${key} must be persisted`);
  return JSON.parse(value!);
}

export async function mount(records: Record<string, unknown>) {
  assert.equal(root, undefined, 'Unmount before starting a new storage session');
  localStorage.clear();
  localStorage.setItem('tv-onboard', 'done');
  for (const [key, value] of Object.entries(records)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  await render();
}

async function render() {
  root = createRoot(document.getElementById('root')!);
  await act(async () => { root!.render(createElement(App)); });
}

export async function unmount() {
  if (root) await act(async () => { root!.unmount(); });
  root = undefined;
}

// A fresh React tree exercises lazy localStorage loaders, not retained hooks.
export async function reload() {
  await unmount();
  await render();
}

export function element<T extends Element = HTMLElement>(selector: string): T {
  const result = document.querySelector<T>(selector);
  assert.ok(result, `Missing element: ${selector}`);
  return result;
}

export async function clickElement(target: Element) {
  assert.ok(!(target as HTMLButtonElement).disabled, `Disabled control: ${target.textContent}`);
  await act(async () => {
    target.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));
  });
}

export async function click(label: string) {
  const matches = [...document.querySelectorAll('button')].filter(
    button => button.textContent?.trim() === label,
  );
  assert.equal(matches.length, 1, `Expected exactly one button named "${label}"`);
  await clickElement(matches[0]);
}

export async function navigate(screen: string) {
  await clickElement(element(`[data-testid="nav-${screen.toLowerCase().replaceAll(' ', '-')}"]`));
}

export async function change(selector: string, value: string) {
  const control = element<HTMLInputElement | HTMLSelectElement>(selector);
  const prototype = control.tagName === 'SELECT'
    ? dom.window.HTMLSelectElement.prototype : dom.window.HTMLInputElement.prototype;
  // Use the native setter, bypassing React's value tracker, just like user input.
  Object.getOwnPropertyDescriptor(prototype, 'value')!.set!.call(control, value);
  await act(async () => {
    control.dispatchEvent(new dom.window.Event(
      control.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true },
    ));
  });
  assert.equal(element<HTMLInputElement>(selector).value, value);
}

export async function openSaved(title: string) {
  await navigate('My Adventures');
  const matches = [...document.querySelectorAll('.saved-plan-open')]
    .filter(button => button.querySelector('strong')?.textContent === title);
  assert.equal(matches.length, 1, `Expected saved plan "${title}"`);
  await clickElement(matches[0]);
}
