/**
 * Keep it mind that the expression is only evaluate once on load
 * @param {expression} expression : (ex : var1 > 2)
 */
export default function If({ expression, children }) {
  return expression ? children : "";
}