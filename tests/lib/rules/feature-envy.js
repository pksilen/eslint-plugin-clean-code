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
        "Number.isFinite(1); Number.isFinite(2); Number.isFinite(3);",
        "const str = ''; str.trim(); str.trim(); str.trim()",
        "import _ from 'lodash'; const a = []; a.head(); a.head(); a.head()",
        "class TestObj { testFunction() {}; }; const testObj = new TestObj(); function test() { testObj.testFunction(); testObj.testFunction(); }"
    ],

    invalid: [
        {
            code: "class TestObj { testFunction() {}; }; const testObj = new TestObj(); function test() { testObj.testFunction(); testObj.testFunction(); testObj.testFunction(); }",
            errors: [{
                message: "Feature envy: object 'testObj' called multiple times",
                type: "FunctionDeclaration"
            }]
        },
        {
            code: "import testObj from './testObj'; function test() { testObj.testFunction(); testObj.testFunction(); testObj.testFunction(); }",
            errors: [{
                message: "Feature envy: object 'testObj' called multiple times",
                type: "FunctionDeclaration"
            }]
        },
        {
            code: "import StringUtils from './StringUtils'; function test() { StringUtils.testFunction(); StringUtils.testFunction(); StringUtils.testFunction(); }",
            errors: [{
                message: "Feature envy: object 'StringUtils' called multiple times",
                type: "FunctionDeclaration"
            }]
        },
        {
            code: "import Chart from './Chart'; const chart = new Chart(); function test() { chart.testFunction(); chart.testFunction(); chart.testFunction(); }",
            errors: [{
                message: "Feature envy: object 'chart' called multiple times",
                type: "FunctionDeclaration"
            }]
        }

    ]
});
