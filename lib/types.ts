export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";

export type Food = {
  id: string;
  name: string;
  brand: string | null;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
};

export type Entry = {
  id: string;
  foodId: string;
  food: Food;
  servings: number;
  mealType: MealType;
  loggedAt: string;
};

export type DailyTotals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};
