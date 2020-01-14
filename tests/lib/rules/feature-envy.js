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


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run('feature-envy', rule, {

    valid: [
        "var a = 1;"
    ],

    invalid: [
        {
            code: "var testObj = new TestObj(); testObject.testFunction = function(){}; function test() { testObj.testFunction(); testObj.testFunction(); testObj.testFunction(); }",
            errors: [{
                message: "Feature envy: object 'testObj' called multiple times",
                type: "FunctionDeclaration"
            }]
        }
    ]
});
