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
      description: 'Exception handling',
      category: 'Clean code',
      recommended: true
    },
    fixable: null,
    schema: []
  },

  create(context) {

    const builtInFunctionsThatCanThrow = [
      'decodeUri', 'decodeURIComponent'
    ];

    let throwsWithoutFunctionNamePrefixTry = false;
    let callsTryPrefixedFunctionOutsideOfTryStatement = false;

    function traverseTree(node, functionName, isInsideTryStatement) {
      if (!node) {
        return;
      }

      Object.keys(node).forEach(key => {
        if (key === 'parent' || key === 'loc') {
          return;
        }

        if (node[key] !== null && typeof node[key] === 'object' && node[key].type) {
          traverseTree(node[key], functionName, isInsideTryStatement || typeof node[key] === 'object' && node[key].type === 'TryStatement')
        } else if (Array.isArray(node[key]) && node[key].length > 0) {
          if (key !== 'range') {
            node[key].forEach(subNode => {
              traverseTree(subNode, functionName, isInsideTryStatement || typeof subNode === 'object' && subNode != null && subNode.type === 'TryStatement');
            });
          }

        }
      });

      if (node !== null && typeof node === 'object' && node.type === 'ThrowStatement' && !functionName.startsWith('try')) {
        if (node.argument && node.argument.callee && node.argument.callee.name && node.argument.callee.name === 'UnrecoverableError') {
          return;
        }

        throwsWithoutFunctionNamePrefixTry = true;
      } else if (node !== null && typeof node === 'object' && node.type === 'CallExpression' && node.callee && node.callee.name && node.callee.name.startsWith('try') && !isInsideTryStatement) {
        callsTryPrefixedFunctionOutsideOfTryStatement = true;
      }
    }

    return {
      FunctionDeclaration(functionNode) {
        throwsWithoutFunctionNamePrefixTry = false;
        callsTryPrefixedFunctionOutsideOfTryStatement = false;

        if (functionNode.id) {
          traverseTree(functionNode, functionNode.id.name, false);
        }

        if (throwsWithoutFunctionNamePrefixTry) {
          context.report(functionNode, `Exception handling: function ${functionNode.id.name} throws, but function name does not start with 'try'.`);
        }

        if (callsTryPrefixedFunctionOutsideOfTryStatement) {
          context.report(functionNode, "Exception handling: function with 'try' prefix in name is called outside of try-catch block.");
        }
      },

      MethodDefinition(methodDefNode) {
        throwsWithoutFunctionNamePrefixTry = false;
        callsTryPrefixedFunctionOutsideOfTryStatement = false;

        if (methodDefNode) {
          traverseTree(methodDefNode, methodDefNode.key.name, false);
        }

        if (throwsWithoutFunctionNamePrefixTry) {
          context.report(methodDefNode, `Exception handling: function ${methodDefNode.key.name} throws, but function name does not start with 'try'.`);
        }

        if (callsTryPrefixedFunctionOutsideOfTryStatement) {
          context.report(methodDefNode, "Exception handling: function with 'try' prefix in name is called outside of try-catch block.");
        }
      },

      ClassProperty(classPropNode) {
        if (classPropNode.value && classPropNode.value.type === 'ArrowFunctionExpression') {
          throwsWithoutFunctionNamePrefixTry = false;
          callsTryPrefixedFunctionOutsideOfTryStatement = false;

          traverseTree(classPropNode.value, classPropNode.key.name, false);

          if (throwsWithoutFunctionNamePrefixTry) {
            context.report(classPropNode, `Exception handling: function ${classPropNode.key.name} throws, but function name does not start with 'try'.`);
          }

          if (callsTryPrefixedFunctionOutsideOfTryStatement) {
            context.report(classPropNode, "Exception handling: function with 'try' prefix in name is called outside of try-catch block.");
          }
        }
      },

      VariableDeclaration(variableDeclNode) {
        variableDeclNode.declarations.forEach(declaration => {
          if (declaration.init && declaration.init.type === 'ArrowFunctionExpression' && declaration.id) {
            throwsWithoutFunctionNamePrefixTry = false;
            callsTryPrefixedFunctionOutsideOfTryStatement = false;

            traverseTree(declaration.init, declaration.id.name, false);

            if (throwsWithoutFunctionNamePrefixTry) {
              context.report(variableDeclNode, `Exception handling: function ${declaration.id.name} throws, but function name does not start with 'try'.`);
            }

            if (callsTryPrefixedFunctionOutsideOfTryStatement) {
              context.report(variableDeclNode, "Exception handling: function with 'try' prefix in name is called outside of try-catch block.");
            }
          }
        });
      }
    };
  }
};
