import { cn, initials} from "@/lib/utils";

const palette = [
  "bg-brand-100 text-brand-700",
  "bg-blue-100 text-blue-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
];

function hashName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}

export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-6 w-6 text-[10px]", md: "h-9 w-9 text-xs", lg: "h-12 w-12 text-sm" };
  const color = palette[hashName(name) % palette.length];
  return (
    <div className={cn("flex shrink-0 items-center justify-center rounded-full font-semibold", sizes[size], color)}>
      {initials(name)}
    </div>
  );
}
