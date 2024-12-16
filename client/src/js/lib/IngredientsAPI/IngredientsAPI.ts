import { SERVER_ORIGIN } from "../../config";
import * as IngredientsAPITypes from "./IngredientsAPI.types";

class IngredientsAPI {
  static async fetch<
    T extends keyof IngredientsAPITypes.RoutesWithParametersAndReponseObject
  >(
    path: T,
    parameters: IngredientsAPITypes.RouteParameters<T>
  ): Promise<IngredientsAPITypes.RouteResponseObject<T>> {
    const url = new URL(`/ingredients/${path}`, SERVER_ORIGIN);

    for (let [key, value] of Object.entries(parameters))
      url.searchParams.set(key, value.toString());

    const response = await fetch(url);
    const { error, data }: IngredientsAPITypes.Response<T> =
      await response.json();

    if (error !== null) throw new Error(error);

    return data;
  }
}

export default IngredientsAPI;
