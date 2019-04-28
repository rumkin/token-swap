export default class Factory {
  // Component configuration default properties
  static configDefaults = {};
  // Component dependencies
  static deps = [];

  constructor(layout) {
    this.deps = this.constructor.deps;
    if (layout) {
      this.layout = layout;
    } else {
      this.layout = this.deps.reduce(
        (layout, name) => ({
          ...layout,
          [name]: true,
        }),
        {},
      );
    }
  }

  async start({name, config, scope}) {}
  async stop(instance) {}
}
