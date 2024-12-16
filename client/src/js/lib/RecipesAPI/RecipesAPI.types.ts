export type RecipeDetailsIngredientMeasure = {
  us: {
    amount: number;
    unitShort: string;
    unitLong: string;
  };
  metric: {
    amount: number;
    unitShort: string;
    unitLong: string;
  };
};

export type RecipeDetailsIngredientObject = {
  id: number;
  aisle: string;
  image: string;
  consistency: "SOLID" | "LIQUID";
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
  measures: RecipeDetailsIngredientMeasure;
};

export type RecipeDetailsObject = {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  preparationMinutes: number | null;
  cookingMinutes: number | null;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  sourceName: string;
  pricePerServing: number;
  extendedIngredients: RecipeDetailsIngredientObject[];
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  image: string;
  imageType: string;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  instructions: string;
  analyzedInstructions: string[];
  originalId: number | null;
  spoonacularScore: number;
  spoonacularSourceUrl: string;
};

export type RecipeIngredientObject = {
  id: number;
  amount: number;
  unit: string;
  unitLong: string;
  unitShort: string;
  aisle: string;
  name: string;
  original: string;
  originalName: string;
  meta: string[];
  image: string;
  missing?: boolean;
};

export type RecipeObject = {
  id: number;
  title: string;
  image: string;
  imageType: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: RecipeIngredientObject[];
  usedIngredients: RecipeIngredientObject[];
  unusedIngredients: RecipeIngredientObject[];
  likes: number;
  ingredients: (RecipeIngredientObject & { missing: boolean })[];
};

export type RoutesWithParametersAndReponseObject = {
  search: { parameters: { ingredients: string }; response: RecipeObject[] };
  details: { parameters: { id: string }; response: RecipeDetailsObject };
};

export type RouteParameters<
  T extends keyof RoutesWithParametersAndReponseObject
> = RoutesWithParametersAndReponseObject[T]["parameters"];

export type RouteResponseObject<
  T extends keyof RoutesWithParametersAndReponseObject
> = RoutesWithParametersAndReponseObject[T]["response"];

export type Response<T extends keyof RoutesWithParametersAndReponseObject> =
  | { error: string; data: null }
  | { error: null; data: RouteResponseObject<T> };
