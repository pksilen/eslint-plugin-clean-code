/**
 * @fileoverview Feature envy
 * @author Petri Silen
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Feature envy',
      category: 'Fill me in',
      recommended: false
    },
    fixable: null,
    schema: [
      // fill in your schema
    ]
  },

  create: function (context) {

    let calleeObjectIdentifierToCallCountMap = {};


    function traverseTree(node) {
      Object.keys(node).forEach(key => {
        if (key === 'parent') {
          return;
        }

        if (typeof node[key] === 'object' && node[key].type) {
          traverseTree(node[key])
        } else if (Array.isArray(node[key]) && node[key].length > 0 && key !== 'range') {
          node[key].forEach(subNode => {
            traverseTree(subNode);
          });
        }

        if (typeof node[key] === 'object' && node[key].type === 'CallExpression' && node[key].callee &&
          node[key].callee.type === 'MemberExpression' && node[key].callee.object && node[key].callee.object.type === 'Identifier') {
          const currentCallCount = calleeObjectIdentifierToCallCountMap[node[key].callee.object.name] || 0;
          calleeObjectIdentifierToCallCountMap[node[key].callee.object.name] = currentCallCount + 1
        }
      });
    }

    return {
      FunctionDeclaration: function (functionNode) {
        calleeObjectIdentifierToCallCountMap = {};
        traverseTree(functionNode);
        Object.entries(calleeObjectIdentifierToCallCountMap).forEach(([objectIdentifier, callCount]) => {
          if (callCount >= 3) {
            context.report(functionNode, "Feature envy: object '" + objectIdentifier + "' called multiple times");
          }
        });
      }
    };
  }
};
