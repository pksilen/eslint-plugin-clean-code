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
      category: 'Clean code',
      recommended: true
    },
    fixable: null,
    schema: []
  },

  create(context) {

    const builtInClassNames = [
      'Array', 'ArrayBuffer', 'BigInt',
      'BigInt64Array', 'BigUint64Array', 'Boolean', 'DataView', 'Date', 'Error', 'EvalError',
      'Float32Array', 'Float64Array', 'Function', 'Infinity',
      'Int16Array', 'Int32Array', 'Int8Array', 'Intl', 'Intl.Collator', 'Intl.DateTimeFormat',
      'Intl.NumberFormat', 'Intl.PluralRules',
      'JSON', 'Map', 'Math', 'NaN', 'Number', 'Object', 'Promise', 'Proxy', 'RangeError', 'ReferenceError',
      'Reflect', 'RegExp', 'Set', 'SharedArrayBuffer', 'String', 'Symbol', 'SyntaxError', 'TypeError',
      'URIError', 'Uint16Array', 'Uint32Array', 'Uint8Array', 'Uint8ClampedArray', 'WeakMap', 'WeakSet', 'WebAssembly'
    ];

    const builtInClasses = [
      Array, ArrayBuffer, BigInt,
      BigInt64Array, BigUint64Array, Boolean, DataView, Date, Error, EvalError,
      Float32Array, Float64Array, Function, Infinity,
      Int16Array, Int32Array, Int8Array, Intl, Intl.Collator, Intl.DateTimeFormat,
      Intl.NumberFormat, Intl.PluralRules,
      JSON, Map, Math, NaN, Number, Object, Promise, Proxy, RangeError, ReferenceError,
      Reflect, RegExp, Set, SharedArrayBuffer, String, Symbol, SyntaxError, TypeError,
      URIError, Uint16Array, Uint32Array, Uint8Array, Uint8ClampedArray, WeakMap, WeakSet, WebAssembly
    ];

    const builtInFunctionNames = builtInClasses.map(builtInClass => {
      try {
        const obj = new builtInClass();
        return Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(propName =>
          typeof Object.getPrototypeOf(obj)[propName] === 'function' && propName !== 'constructor');
      } catch (e) {
        try {
          const obj = builtInClass();
          return Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(propName =>
            typeof Object.getPrototypeOf(obj)[propName] === 'function' && propName !== 'constructor');
        } catch (e) {
          return [];
        }
      }
    }).reduce((acc, val) => acc.concat(val), []);

    const allowedImportedObjectIdentifiers = ['console', 'document', 'event'];
    let calleeObjectIdentifierToCallCountMap = {};

    function traverseTree(node) {
      if (!node) {
        return;
      }
      
      Object.keys(node).forEach(key => {
        if (key === 'parent') {
          return;
        }

        if (node[key] !== null && typeof node[key] === 'object' && node[key].type) {
          traverseTree(node[key])
        } else if (Array.isArray(node[key]) && node[key].length > 0 && key !== 'range') {
          node[key].forEach(subNode => {
            traverseTree(subNode);
          });
        }
      });

      if (node !== null && typeof node === 'object' && node.type === 'CallExpression' && node.callee &&
        node.callee.type === 'MemberExpression' && node.callee.object && node.callee.object.type === 'Identifier' &&
        !builtInClassNames.includes(node.callee.object.name) && !allowedImportedObjectIdentifiers.includes(node.callee.object.name) &&
        !builtInFunctionNames.includes(node.callee.property.name)) {
        const currentCallCount = calleeObjectIdentifierToCallCountMap[node.callee.object.name] || 0;
        calleeObjectIdentifierToCallCountMap[node.callee.object.name] = currentCallCount + 1
      }
    }

    return {
      ImportDeclaration(node) {
        if (!node.source.value.startsWith('.')) {
          node.specifiers.forEach(specifier => {
            allowedImportedObjectIdentifiers.push(specifier.local.name);
          });
        }
      },

      FunctionDeclaration(functionNode) {
        calleeObjectIdentifierToCallCountMap = {};
        traverseTree(functionNode);
        Object.entries(calleeObjectIdentifierToCallCountMap).forEach(([objectIdentifier, callCount]) => {
          if (callCount >= 3) {
            context.report(functionNode, "Feature envy: object '" + objectIdentifier + "' called multiple times");
          }
        });
      },

      MethodDefinition(methodDefNode) {
        calleeObjectIdentifierToCallCountMap = {};
        traverseTree(methodDefNode);
        Object.entries(calleeObjectIdentifierToCallCountMap).forEach(([objectIdentifier, callCount]) => {
          if (callCount >= 3) {
            context.report(methodDefNode, "Feature envy: object '" + objectIdentifier + "' called multiple times");
          }
        });
      },

      ClassProperty(classPropNode) {
        if(classPropNode.value && classPropNode.value.type === 'ArrowFunctionExpression') {
          calleeObjectIdentifierToCallCountMap = {};
          traverseTree(classPropNode.value);
          Object.entries(calleeObjectIdentifierToCallCountMap).forEach(([objectIdentifier, callCount]) => {
            if (callCount >= 3) {
              context.report(classPropNode, "Feature envy: object '" + objectIdentifier + "' called multiple times");
            }
          });
        }
      },

      VariableDeclaration(variableDeclNode) {
        variableDeclNode.declarations.forEach(declaration => {
          if(declaration.init && declaration.init.type === 'ArrowFunctionExpression') {
            calleeObjectIdentifierToCallCountMap = {};

            traverseTree(declaration.init);

            Object.entries(calleeObjectIdentifierToCallCountMap).forEach(([objectIdentifier, callCount]) => {
              if (callCount >= 3) {
                context.report(variableDeclNode, "Feature envy: object '" + objectIdentifier + "' called multiple times");
              }
            });
          }
        });
      }
    };
  }
};
