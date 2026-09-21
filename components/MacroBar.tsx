type MacroBarProps = {
  label: string;
  grams: number;
  goalGrams: number;
  colorClass: string;
};

export function MacroBar({ label, grams, goalGrams, colorClass }: MacroBarProps) {
  const pct = goalGrams > 0 ? Math.min(100, (grams / goalGrams) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span className="text-neutral-600">
          {Math.round(grams)}g / {goalGrams}g
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-neutral-200">
        <div
          className={`h-2 rounded-full ${colorClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
