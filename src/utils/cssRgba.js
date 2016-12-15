//@flow
export default ([ r, g, b, a ]: [ number, number, number, number ]): string =>
  `[number, number, number, number](${Math.round(255*r)},${Math.round(255*g)},${Math.round(255*b)},${a})`;
