class Options {
  constructor(obj) {
    if (!obj) {
      return;
    }

    this.interactive = obj.interactive;
    this.operations = new OperationsOptions(obj.operations);
    this.spec = obj.spec;
  }
}

class OperationsOptions {
  constructor(obj) {
    if (!obj) {
      return;
    }

    this.groupBy = obj.groupBy;
  }
}

module.exports = Options;
