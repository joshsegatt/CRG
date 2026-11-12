import test from "node:test";
import assert from "node:assert/strict";
import { acknowledgePanel } from "../src/motion.mjs";

test("reduced motion leaves the already visible panel usable without animation", () => {
  let calls = 0;
  const panel = {
    animate() {
      calls++;
    },
  };
  assert.equal(acknowledgePanel(panel, true), undefined);
  assert.equal(calls, 0);
});

test("unsupported animation APIs do not interrupt navigation", () => {
  assert.doesNotThrow(() => acknowledgePanel(null));
  assert.doesNotThrow(() => acknowledgePanel({}));
});

test("panel feedback is short, bounded and ends fully visible", () => {
  let received;
  const panel = {
    animate(frames, options) {
      received = { frames, options };
      return "animation";
    },
  };
  assert.equal(acknowledgePanel(panel), "animation");
  assert.ok(received.options.duration <= 300);
  assert.equal(received.frames.at(-1).opacity, 1);
  assert.equal(received.frames.at(-1).clipPath, "inset(0)");
});
