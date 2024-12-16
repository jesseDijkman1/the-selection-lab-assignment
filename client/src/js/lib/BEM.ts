class BEM {
  static createTransformer = (variationClass: string) => (baseClass: string) =>
    `${baseClass}--${variationClass}`;

  static ACTIVE = BEM.createTransformer("active");
  static OPEN = BEM.createTransformer("open");
  static EMPTY = BEM.createTransformer("empty");
  static NO_RESULTS = BEM.createTransformer("no-results");
  static STATIC = BEM.createTransformer("static");
}

export default BEM;
