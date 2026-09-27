"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

type EntryListItem = {
  id: string;
  servings: number;
  mealType: string;
  loggedAt: string;
  food: {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export function EntryList({
  entries,
  isToday = true,
}: {
  entries: EntryListItem[];
  isToday?: boolean;
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    router.refresh();
    setDeletingId(null);
  }

  if (entries.length === 0) {
    if (!isToday) {
      return <p className="text-sm text-neutral-500">Nothing logged this day.</p>;
    }
    return (
      <p className="text-sm text-neutral-500">
        Nothing logged yet today. Head to{" "}
        <Link href="/log" className="underline">
          Log food
        </Link>{" "}
        to add something.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
      {entries.map((entry) => (
        <li key={entry.id} className="flex items-center justify-between gap-3 p-4">
          <div>
            <p className="font-medium">{entry.food.name}</p>
            <p className="text-xs text-neutral-500">
              {entry.mealType.charAt(0) + entry.mealType.slice(1).toLowerCase()} ·{" "}
              {entry.servings} serving{entry.servings === 1 ? "" : "s"} ·{" "}
              {Math.round(entry.food.calories * entry.servings)} kcal
            </p>
          </div>
          <button
            onClick={() => handleDelete(entry.id)}
            disabled={deletingId === entry.id}
            className="text-xs text-neutral-400 hover:text-red-600 disabled:opacity-50"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
