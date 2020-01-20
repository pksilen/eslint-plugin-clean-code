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
      recommended: false
    },
    fixable: null,
    schema: []
  },

  create: function (context) {

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
        } catch(e) {
          try {
            const obj = builtInClass();
            return  Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(propName =>
              typeof Object.getPrototypeOf(obj)[propName] === 'function' && propName !== 'constructor');
          } catch(e) {
            return [];
          }
        }
    }).reduce((acc, val) => acc.concat(val), []);

    const allowedImportedObjectIdentifiers = [];
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
          node[key].callee.type === 'MemberExpression' && node[key].callee.object && node[key].callee.object.type === 'Identifier' &&
          !builtInClassNames.includes(node[key].callee.object.name) && !allowedImportedObjectIdentifiers.includes(node[key].callee.object.name) &&
          !builtInFunctionNames.includes(node[key].callee.property.name)) {
          const currentCallCount = calleeObjectIdentifierToCallCountMap[node[key].callee.object.name] || 0;
          calleeObjectIdentifierToCallCountMap[node[key].callee.object.name] = currentCallCount + 1
        }
      });
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
      }
    };
  }
};
