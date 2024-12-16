export type IngredientObject = {
  name: string;
  image: string;
};

export type RoutesWithParametersAndReponseObject = {
  search: { parameters: { q: string }; response: IngredientObject[] };
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
