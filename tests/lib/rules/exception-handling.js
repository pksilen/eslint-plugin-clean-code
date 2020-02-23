/**
 * @fileoverview Feature envy
 * @author Petri Silen
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/exception-handling'),

  RuleTester = require('eslint').RuleTester;

RuleTester.setDefaultConfig({
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module"
  },
  "parser": "/Users/pksilen/Code/eslint-plugin-clean-code/node_modules/babel-eslint"
});


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('exception-handling', rule, {

  valid: [
    "function tryDoSomething() { throw new Error(''); }",
    "const tryDoSomething = () => { throw new Error(''); }",
    "class Test { tryDoSomething() { throw new Error(''); } }",
    "class Test { tryDoSomething = () => { throw new Error(''); } }",
    "function doSomething() { throw new UnrecoverableError(''); }",
    "const doSomething = () => { throw new UnrecoverableError(''); }",
    "class Test { doSomething() { throw new UnrecoverableError(''); } }",
    "class Test { doSomething = () => { throw new UnrecoverableError(''); } }",
    "function tryDoSomething() { throw new Error(''); } function useJee() { try { tryDoSomething(); } catch(error) {}};",
    "function tryDoSomething() { throw new Error(''); } const useJee = () => { try { tryDoSomething(); } catch(error) {}};",
    "function tryDoSomething() { throw new Error(''); } function useJee() { try { tryDoSomething(); } catch(error) { throw new UnrecoverableError() }};",
    "function tryDoSomething() { throw new Error(''); } const useJee = () => { try { tryDoSomething(); } catch(error) { throw new UnrecoverableError() }};",
    "function tryDoSomething() { throw new Error(''); } class Test { useJee() { try { tryDoSomething(); } catch(error) {}}; }",
    "function tryDoSomething() { throw new Error(''); } class Test { useJee = () => { try { tryDoSomething(); } catch(error) {}}; }",
    "function tryDoSomething() { throw new Error(''); } class Test { useJee() { try { tryDoSomething(); } catch(error) { throw new UnrecoverableError() }}; }",
    "function tryDoSomething() { throw new Error(''); } class Test { useJee = () => { try { tryDoSomething(); } catch(error) { throw new UnrecoverableError() }}; }"
  ],

  invalid: [
    {
      code: "function doSomething() { throw new Error(''); }",
      errors: [{
        message: "Exception handling: function doSomething throws, but function name does not start with 'try'.",
        type: "FunctionDeclaration"
      }]
    },
    {
      code: "class Test { doSomething() { throw new Error(''); } }",
      errors: [{
        message: "Exception handling: function doSomething throws, but function name does not start with 'try'.",
        type: "MethodDefinition"
      }]
    },
    {
      code: "const doSomething = () => { throw new Error(''); }",
      errors: [{
        message: "Exception handling: function doSomething throws, but function name does not start with 'try'.",
        type: "VariableDeclaration"
      }]
    },
    {
      code: "class Test { doSomething = () => { throw new Error(''); } }",
      errors: [{
        message: "Exception handling: function doSomething throws, but function name does not start with 'try'.",
        type: "ClassProperty"
      }]
    },
    {
      code: "function tryDoSomething() { throw new Error(''); } function useJee() { tryDoSomething(); };",
      errors: [{
        message: "Exception handling: function with 'try' prefix in name is called outside of try-catch block.",
        type: "FunctionDeclaration"
      }]
    },
    {
      code: "function tryDoSomething() { throw new Error(''); } const useJee = () => { tryDoSomething(); };",
      errors: [{
        message: "Exception handling: function with 'try' prefix in name is called outside of try-catch block.",
        type: "VariableDeclaration"
      }]
    },
    {
      code: "function tryDoSomething() { throw new Error(''); } class Test { useJee() { tryDoSomething(); }; }",
      errors: [{
        message: "Exception handling: function with 'try' prefix in name is called outside of try-catch block.",
        type: "MethodDefinition"
      }]
    },
    {
      code: "function tryDoSomething() { throw new Error(''); } class Test { useJee = () => { tryDoSomething(); }; }",
      errors: [{
        message: "Exception handling: function with 'try' prefix in name is called outside of try-catch block.",
        type: "ClassProperty"
      }]
    },
  ]
});
