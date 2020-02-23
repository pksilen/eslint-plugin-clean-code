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
    ecmaVersion: 6,
    sourceType: "module"
  }
});


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('exception-handling', rule, {

  valid: [
    "function tryDoSomething() { throw new Error(''); }",
    "const tryDoSomething = () => { throw new Error(''); }",
    "function doSomething() { throw new UnrecoverableError(''); }",
    "const doSomething = () => { throw new UnrecoverableError(''); }",
    "function tryDoSomething() { throw new Error(''); } function useJee() { try { tryDoSomething(); } catch(error) {}};",
    "function tryDoSomething() { throw new Error(''); } const useJee = () => { try { tryDoSomething(); } catch(error) {}};",
    "function tryDoSomething() { throw new Error(''); } function useJee() { try { tryDoSomething(); } catch(error) { throw new UnrecoverableError() }};",
    "function tryDoSomething() { throw new Error(''); } const useJee = () => { try { tryDoSomething(); } catch(error) { throw new UnrecoverableError() }};"
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
      code: "const doSomething = () => { throw new Error(''); }",
      errors: [{
        message: "Exception handling: function doSomething throws, but function name does not start with 'try'.",
        type: "VariableDeclaration"
      }]
    },
    {
      code: "function tryDoSomething() { throw new Error(''); } function useJee() { tryDoSomething(); };",
      errors: [{
        message: "Exception handling: function with 'try' prefix in name is called outside of try-catch block.",
        type: "FunctionDeclaration"
      }]
    }
  ]
});
