class BEM {
  b: string;
  c: string[]; // Stack

  constructor(baseClass: string) {
    this.b = baseClass;
    this.c = [];
  }

  p(str: string) {
    this.c.push(str);
    return this;
  }

  // This one is probably a bit much ... and maybe confusing?
  clearChainIf(condition: boolean) {
    if (condition) this.c = [];
    return this;
  }

  toString() {
    const className = this.c.join(" ");
    this.c = [];
    return className;
  }

  static createTransformer = (variationClass: string) => (baseClass: string) =>
    `${baseClass}--${variationClass}`;

  static ACTIVE = BEM.createTransformer("active");
  static OPEN = BEM.createTransformer("open");
  static EMPTY = BEM.createTransformer("empty");
  static NO_RESULTS = BEM.createTransformer("no-results");
  static STATIC = BEM.createTransformer("static");
  static INVISIBLE = BEM.createTransformer("invisible");

  get RAW() {
    return this.p(this.b);
  }

  get ACTIVE() {
    return this.p(BEM.ACTIVE(this.b));
  }

  get OPEN() {
    return this.p(BEM.OPEN(this.b));
  }

  get EMPTY() {
    return this.p(BEM.EMPTY(this.b));
  }

  get NO_RESULTS() {
    return this.p(BEM.NO_RESULTS(this.b));
  }

  get STATIC() {
    return this.p(BEM.STATIC(this.b));
  }

  get INVISIBLE() {
    return this.p(BEM.INVISIBLE(this.b));
  }

  *[Symbol.iterator]() {
    let cls;
    while ((cls = this.c.shift())) yield cls;
  }
}

export default BEM;
