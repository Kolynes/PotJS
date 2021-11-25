import { IIndexable } from "../types";

export function rule(item: string): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor) => {
    Object.defineProperty(target, `Rule${propertyKey as String}`, { value: { item, function: target[propertyKey]} })
  }
}

export default abstract class Form {

  errors: IIndexable<string[]> = {};
  private rules: IIndexable<Function[]> = {};

  constructor(
    readonly data: IIndexable<any>
  ) {
    let descriptors = Object.getOwnPropertyDescriptors(this.constructor.prototype);
    for (var prop in descriptors) {
      if (prop.startsWith("Rule")) {
        if(this.rules[descriptors[prop].value.item] === undefined)
          this.rules[descriptors[prop].value.item] = [];
          this.rules[descriptors[prop].value.item].push(descriptors[prop].value.function.bind(this))
      }
    }
  }

  validate(): boolean {
    let result = true;
    for(let item in this.rules)
      for(let rule in this.rules[item]) {
        let ruleResult = this.rules[item][rule](this.data[item]);
        result = result && ruleResult === true
        if(ruleResult !== true) {
          if(this.errors[item] === undefined)
            this.errors[item] = [];
          this.errors[item].push(ruleResult);
        }
      }
    return result;
  }
}