"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { parseLocalDate } from "@/lib/date";

type FoodOption = {
  id: string;
  name: string;
  brand: string | null;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

const MEAL_TYPES = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] as const;

const emptyNewFood = {
  name: "",
  brand: "",
  servingSize: "1 serving",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
};

export function LogForm({
  foods,
  initialDate,
  today,
}: {
  foods: FoodOption[];
  initialDate: string; // YYYY-MM-DD
  today: string; // YYYY-MM-DD
}) {
  const router = useRouter();
  const [date, setDate] = useState(initialDate);
  const [query, setQuery] = useState("");
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  const [servings, setServings] = useState("1");
  const [mealType, setMealType] = useState<(typeof MEAL_TYPES)[number]>("SNACK");
  const [showNewFood, setShowNewFood] = useState(false);
  const [newFood, setNewFood] = useState(emptyNewFood);
  const [submitting, setSubmitting] = useState(false);

  const filteredFoods = useMemo(() => {
    if (!query.trim()) return foods;
    const q = query.toLowerCase();
    return foods.filter((f) => f.name.toLowerCase().includes(q));
  }, [foods, query]);

  const selectedFood = foods.find((f) => f.id === selectedFoodId) ?? null;

  async function handleLogEntry() {
    if (!selectedFoodId) return;
    setSubmitting(true);
    const isToday = !date || date === today;
    // Backfilled entries keep the current time of day on the chosen date, so
    // they sort naturally alongside that day's other entries.
    let loggedAt: string | undefined;
    if (!isToday) {
      const now = new Date();
      const day = parseLocalDate(date);
      day.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
      loggedAt = day.toISOString();
    }
    await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        foodId: selectedFoodId,
        servings: Number(servings) || 1,
        mealType,
        loggedAt,
      }),
    });
    setSubmitting(false);
    router.push(isToday ? "/" : `/?date=${date}`);
    router.refresh();
  }

  async function handleCreateFood(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/foods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFood),
    });
    const created = await res.json();
    setSubmitting(false);
    setShowNewFood(false);
    setNewFood(emptyNewFood);
    setSelectedFoodId(created.id);
    setQuery(created.name);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Date</label>
        <input
          type="date"
          max={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Search foods</label>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedFoodId(null);
          }}
          placeholder="e.g. Chicken breast"
          className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />
      </div>

      {!selectedFood && (
        <ul className="max-h-64 divide-y divide-neutral-200 overflow-y-auto rounded-xl border border-neutral-200 bg-white">
          {filteredFoods.length === 0 && (
            <li className="p-4 text-sm text-neutral-500">No foods found.</li>
          )}
          {filteredFoods.map((food) => (
            <li key={food.id}>
              <button
                type="button"
                onClick={() => setSelectedFoodId(food.id)}
                className="flex w-full items-center justify-between gap-3 p-3 text-left hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-medium">{food.name}</p>
                  <p className="text-xs text-neutral-500">
                    {food.servingSize} · {Math.round(food.calories)} kcal
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedFood && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{selectedFood.name}</p>
              <p className="text-xs text-neutral-500">
                {selectedFood.servingSize} per serving · P{selectedFood.protein}g
                / C{selectedFood.carbs}g / F{selectedFood.fat}g
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFoodId(null)}
              className="text-xs text-neutral-400 hover:text-neutral-900"
            >
              Change
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Servings</label>
              <input
                type="number"
                min="0"
                step="0.25"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Meal</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value as (typeof MEAL_TYPES)[number])}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              >
                {MEAL_TYPES.map((m) => (
                  <option key={m} value={m}>
                    {m.charAt(0) + m.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogEntry}
            disabled={submitting}
            className="mt-4 w-full rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {submitting ? "Logging…" : "Log entry"}
          </button>
        </div>
      )}

      <div className="border-t border-neutral-200 pt-4">
        {!showNewFood ? (
          <button
            type="button"
            onClick={() => setShowNewFood(true)}
            className="text-sm text-neutral-600 underline"
          >
            Can&apos;t find it? Add a new food
          </button>
        ) : (
          <form onSubmit={handleCreateFood} className="space-y-3 rounded-xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-medium">New food</p>
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                placeholder="Name"
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                className="col-span-2 rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
              <input
                placeholder="Brand (optional)"
                value={newFood.brand}
                onChange={(e) => setNewFood({ ...newFood, brand: e.target.value })}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
              <input
                placeholder="Serving size (e.g. 100g)"
                value={newFood.servingSize}
                onChange={(e) => setNewFood({ ...newFood, servingSize: e.target.value })}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
              <input
                required
                type="number"
                step="any"
                placeholder="Calories"
                value={newFood.calories}
                onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
              <input
                required
                type="number"
                step="any"
                placeholder="Protein (g)"
                value={newFood.protein}
                onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
              <input
                required
                type="number"
                step="any"
                placeholder="Carbs (g)"
                value={newFood.carbs}
                onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
              <input
                required
                type="number"
                step="any"
                placeholder="Fat (g)"
                value={newFood.fat}
                onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {submitting ? "Saving…" : "Save food"}
              </button>
              <button
                type="button"
                onClick={() => setShowNewFood(false)}
                className="rounded-md px-4 py-2 text-sm text-neutral-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
