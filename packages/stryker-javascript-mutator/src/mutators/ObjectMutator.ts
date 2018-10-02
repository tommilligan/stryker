import { types } from 'babel-core';
import NodeMutator from './NodeMutator';

/**
 * Represents a mutator which can remove the content of a Object.
 */
export default class ObjectMutator implements NodeMutator {
  public name = 'Object';

  public mutate(node: types.Node, copy: <T extends types.Node>(obj: T, deep?: boolean) => T): void | types.Node[] {
    if (types.isObjectExpression(node) && node.properties.length > 0) {
      const mutatedNode = copy(node);
      mutatedNode.properties = [];
      return [mutatedNode];
    }
  }
}
