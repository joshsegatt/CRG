export function acknowledgePanel(panel, reduceMotion = false) {
  if (reduceMotion || typeof panel?.animate !== "function") return undefined;
  return panel.animate(
    [
      { opacity: 0.7, clipPath: "inset(0 0 5% 0)" },
      { opacity: 1, clipPath: "inset(0)" },
    ],
    { duration: 180, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
  );
}
