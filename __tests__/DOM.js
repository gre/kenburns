/* global test expect */
import KenBurnsDOM from "../lib/dom";
import crop from "rect-crop";

function createMockDiv (width, height) {
  const div = document.createElement("div");
  Object.assign(div.style, {
    width: width+"px",
    height: height+"px",
  });
  // we have to mock this for jsdom.
  div.getBoundingClientRect = () => ({
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
  });
  return div;
}

test(".animate()", () => {
  const div = createMockDiv(400, 300);
  const kenBurns = new KenBurnsDOM(div);
  const el = createMockDiv(900, 400);
  return kenBurns.animate(
    el,
    crop.largest,
    crop(0.2, [0.5, 0.5]),
    100
  ).then(() => {
    expect(div.style).toMatchSnapshot();
    expect(el.style).toMatchSnapshot();
  });
});

test(".animateStep()", () => {
  const div = createMockDiv(400, 300);
  const kenBurns = new KenBurnsDOM(div);
  const el = createMockDiv(100, 100);
  const boundA = crop(0.2, [0.5, 0.5]);
  const boundB = crop.largest;
  for (let i=0.0; i<=1.0; i+=0.1) {
    kenBurns.animateStep(el, boundA, boundB, i);
    expect(el.style).toMatchSnapshot();
  }
});

test("background & clamped", () => {
  const div = createMockDiv(400, 300);
  const kenBurns = new KenBurnsDOM(div);
  kenBurns.background = [1,0,0,1];
  kenBurns.clamped = false;
  const el = createMockDiv(100, 800);
  const boundA = crop(0.1, [0, 0]);
  const boundB = crop.largest;
  for (let i=0.0; i<=1.0; i+=0.1) {
    kenBurns.animateStep(el, boundA, boundB, i);
    expect(el.style).toMatchSnapshot();
  }
});
