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
    "function tryDoSomething() { throw new Error(''); } function useJee() { try { tryDoSomething(); } catch(error) {}};"
  ],

  invalid: [
    {
      code: "function doSomething() { throw new Error(''); }",
      errors: [{
        message: "Exception handling: function doSomething throws, but function name does not start with 'try'",
        type: "FunctionDeclaration"
      }]
    },
    {
      code: "function tryDoSomething() { throw new Error(''); } function useJee() { tryDoSomething(); };",
      errors: [{
        message: "Exception handling: function with 'try' prefix in name is called outside of try-catch block",
        type: "FunctionDeclaration"
      }]
    }
  ]
});
