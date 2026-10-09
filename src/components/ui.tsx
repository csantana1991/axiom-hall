import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";

export function Button({
  tone = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "ghost" }) {
  const toneClass =
    tone === "primary"
      ? "border-brass bg-brass text-ink hover:bg-cream"
      : "border-line bg-panel text-cream hover:border-brass";
  return (
    <button
      {...props}
      className={`inline-flex min-h-11 items-center justify-center gap-2 border px-4 font-mono text-sm ${toneClass} ${className}`}
    />
  );
}

export function SliderField({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  display: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="flex items-baseline justify-between gap-3 font-mono text-xs text-mist">
        <span>{label}</span>
        <span className="text-cream">{display}</span>
      </span>
      <input
        className="mt-1 h-11 w-full accent-brass"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="min-w-0 border border-line bg-raise px-3 py-3">
      <div className="font-mono text-xs text-mist">{label}</div>
      <div className="mt-1 truncate font-mono text-lg text-cream">{value}</div>
      {hint ? <p className="mt-1 text-sm text-mist">{hint}</p> : null}
    </div>
  );
}

export function Formula({ children }: { children: string }) {
  return (
    <p className="mt-3 overflow-x-auto border border-line bg-ink px-3 py-3 font-mono text-sm leading-relaxed text-brass">
      {children}
    </p>
  );
}

export function CodeBlock({ code, filename }: { code: string; filename: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="min-w-0 border border-line bg-ink">
      <div className="flex items-center justify-between gap-3 border-b border-line px-3">
        <span className="font-mono text-xs text-mist">{filename}</span>
        <button
          type="button"
          className="min-h-11 px-2 font-mono text-xs text-brass"
          onClick={() => {
            void navigator.clipboard.writeText(code).then(
              () => {
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1400);
              },
              () => setCopied(false),
            );
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="max-h-96 overflow-auto p-4 font-mono text-sm leading-relaxed text-cream">{code}</pre>
    </div>
  );
}

export function LabFrame({ brief, children }: { brief: string; children: ReactNode }) {
  return (
    <div className="min-w-0 space-y-4">
      <p className="max-w-3xl text-lg leading-relaxed text-cream">{brief}</p>
      {children}
    </div>
  );
}
