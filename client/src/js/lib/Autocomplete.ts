type AutocompleteSpaces = "recipes" | "ingredients";
type AutocompleteOptions = any;

type AutocompleteRecipeResult = {
  id: number;
  imageType: string;
  title: string;
};

type AutocompleteIngredientResult = {
  name: string;
  image: string;
};

// Map the space to the respective result type
type AutocompleteResult<T extends AutocompleteSpaces> = T extends "recipes"
  ? AutocompleteRecipeResult
  : AutocompleteIngredientResult;

class Autocomplete<T extends AutocompleteSpaces> {
  private readonly url: URL;

  constructor(
    private readonly space: T,
    private readonly options: AutocompleteOptions
  ) {
    this.url = new URL(`http://localhost:3000/${space}/autocomplete`);
  }

  async query(q: string): Promise<AutocompleteResult<T>[]> {
    this.url.searchParams.set("q", q);

    const response = await fetch(this.url);
    const { error, data }: { error: string; data: AutocompleteResult<T>[] } =
      await response.json();

    if (error !== null) throw new Error(error);

    return data;
  }
}

export default Autocomplete;
