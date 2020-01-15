/**
 * @fileoverview Feature envy
 * @author Petri Silen
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require('../../../lib/rules/feature-envy'),

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
ruleTester.run('feature-envy', rule, {

    valid: [
        "class TestObj { testFunction() {}; }; const testObj = new TestObj(); function test() { testObj.testFunction(); testObj.testFunction(); }"
    ],

    invalid: [
        {
            code: "class TestObj { testFunction() {}; }; const testObj = new TestObj(); function test() { testObj.testFunction(); testObj.testFunction(); testObj.testFunction(); }",
            errors: [{
                message: "Feature envy: object 'testObj' called multiple times",
                type: "FunctionDeclaration"
            }]
        }
    ]
});
