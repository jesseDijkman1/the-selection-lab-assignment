import { SERVER_ORIGIN } from "../../config";
import * as RecipesAPITypes from "./RecipesAPI.types";

class RecipesAPI {
  static async fetch<
    T extends keyof RecipesAPITypes.RoutesWithParametersAndReponseObject
  >(
    path: T,
    parameters: RecipesAPITypes.RouteParameters<T>
  ): Promise<RecipesAPITypes.RouteResponseObject<T>> {
    const url = new URL(`/recipes/${path}`, SERVER_ORIGIN);

    for (let [key, value] of Object.entries(parameters))
      url.searchParams.set(key, value.toString());

    const response = await fetch(url);
    const { error, data }: RecipesAPITypes.Response<T> = await response.json();

    if (error !== null) throw new Error(error);

    return data;
  }
}

export default RecipesAPI;
