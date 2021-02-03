export default function If({ expression, children }) {
  return expression ? children : "";
}