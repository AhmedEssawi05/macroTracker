import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MacroBar } from "@/components/MacroBar";
import { EntryList } from "@/components/EntryList";
import { addDays, formatLocalDate, parseLocalDateOrToday } from "@/lib/date";

export const dynamic = "force-dynamic";

// Simple default daily goals until user-configurable goals are added.
const GOALS = { calories: 2000, protein: 150, carbs: 200, fat: 65 };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { date: dateParam } = await searchParams;
  const startOfDay = parseLocalDateOrToday(
    typeof dateParam === "string" ? dateParam : undefined
  );
  const endOfDay = new Date(startOfDay);
  endOfDay.setHours(23, 59, 59, 999);

  const todayStr = formatLocalDate(new Date());
  const dayStr = formatLocalDate(startOfDay);
  const isToday = dayStr === todayStr;
  const prevStr = formatLocalDate(addDays(startOfDay, -1));
  const nextStr = formatLocalDate(addDays(startOfDay, 1));
  const heading = isToday
    ? "Today"
    : startOfDay.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

  const entries = await prisma.entry.findMany({
    where: { loggedAt: { gte: startOfDay, lte: endOfDay } },
    include: { food: true },
    orderBy: { loggedAt: "asc" },
  });

  const totals = entries.reduce(
    (acc, entry) => {
      acc.calories += entry.food.calories * entry.servings;
      acc.protein += entry.food.protein * entry.servings;
      acc.carbs += entry.food.carbs * entry.servings;
      acc.fat += entry.food.fat * entry.servings;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="space-y-8">
      <nav className="flex items-center justify-between text-sm">
        <Link
          href={`/?date=${prevStr}`}
          className="text-neutral-600 hover:text-neutral-900"
        >
          ← Previous day
        </Link>
        {!isToday && (
          <Link href="/" className="text-neutral-600 underline">
            Back to today
          </Link>
        )}
        {isToday ? (
          <span className="text-neutral-300">Next day →</span>
        ) : (
          <Link
            href={nextStr === todayStr ? "/" : `/?date=${nextStr}`}
            className="text-neutral-600 hover:text-neutral-900"
          >
            Next day →
          </Link>
        )}
      </nav>

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h1 className="text-lg font-semibold">{heading}</h1>
          <span className="text-2xl font-semibold">
            {Math.round(totals.calories)}{" "}
            <span className="text-sm font-normal text-neutral-500">
              / {GOALS.calories} kcal
            </span>
          </span>
        </div>
        <div className="space-y-3">
          <MacroBar
            label="Protein"
            grams={totals.protein}
            goalGrams={GOALS.protein}
            colorClass="bg-rose-500"
          />
          <MacroBar
            label="Carbs"
            grams={totals.carbs}
            goalGrams={GOALS.carbs}
            colorClass="bg-amber-500"
          />
          <MacroBar
            label="Fat"
            grams={totals.fat}
            goalGrams={GOALS.fat}
            colorClass="bg-sky-500"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-neutral-600">
          Entries
        </h2>
        <EntryList
          isToday={isToday}
          entries={entries.map((e) => ({
            id: e.id,
            servings: e.servings,
            mealType: e.mealType,
            loggedAt: e.loggedAt.toISOString(),
            food: {
              id: e.food.id,
              name: e.food.name,
              calories: e.food.calories,
              protein: e.food.protein,
              carbs: e.food.carbs,
              fat: e.food.fat,
            },
          }))}
        />
      </section>
    </div>
  );
}
