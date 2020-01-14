# eslint-plugin-clean-code

Clean code ESLint plugin

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-clean-code`:

```
$ npm install eslint-plugin-clean-code --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-clean-code` globally.

## Usage

Add `clean-code` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "clean-code"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "clean-code/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





