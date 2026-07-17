import { slaRingColor } from "@/lib/utils";

interface SlaRingProps {
  percentElapsed: number; // 0-100+
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}

export function SlaRing({ percentElapsed, size = 56, stroke = 5, label, sublabel }: SlaRingProps) {
  const clamped = Math.min(percentElapsed, 100);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const color = slaRingColor(percentElapsed);
  const breached = percentElapsed >= 100;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center leading-none">
        <span className="font-mono text-[11px] font-semibold" style={{ color }}>
          {breached ? "!" : `${Math.round(clamped)}%`}
        </span>
      </div>
      {(label || sublabel) && (
        <div className="absolute -bottom-6 whitespace-nowrap text-center">
          {label && <p className="text-[10px] font-medium text-ink-500">{label}</p>}
        </div>
      )}
    </div>
  );
}

export function SlaBar({ percentElapsed }: { percentElapsed: number }) {
  const clamped = Math.min(percentElapsed, 100);
  const color = slaRingColor(percentElapsed);
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
