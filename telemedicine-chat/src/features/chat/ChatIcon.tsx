import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export function ChatIcon({ icon }: { icon: IconDefinition }) {
  const [width, height, , , paths] = icon.icon;

  return (
    <svg
      width="16"
      height="16"
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {[paths].flat().map((path) => (
        <path key={path} d={path} />
      ))}
    </svg>
  );
}
