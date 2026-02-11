// eslint.config.mjs
import vue from "eslint-plugin-vue";
import stylistic from "@stylistic/eslint-plugin";
import vuetify from "eslint-plugin-vuetify";
import jsdoc from "eslint-plugin-jsdoc";
import vueParser from "vue-eslint-parser";
import importPlugin from "eslint-plugin-import";
import preferOptionalChaining from "eslint-plugin-prefer-optional-chaining";
import pluginSVGO from "eslint-plugin-svgo";

export default [
	...vue.configs[ "flat/essential" ],
	{
		files:   [ "**/*.svg" ],
		ignores: [ "icons/*.svg" ],
		plugins: { svgo: pluginSVGO },
		rules:   {
			  "svgo/svgo": [ "error", {
				floatPrecision: 2,
				multipass:      true,
				plugins:        [ "preset-default" ]
			  } ]
		}
	},
	{
		files:           [ "*.config.mjs" ],
		languageOptions: {
			ecmaVersion: 2024,
			sourceType:  "module"
		},
		rules: {
			"sort-keys": [ "error", "asc", {
				caseSensitive: false,
				minKeys:       2,
				natural:       true
			} ]
		}
	},
	{
		files:           [ "**/*.mjs", "**/*.js", "**/*.vue" ],
		ignores:         [ "public/**", "node_modules/**", "dist/**", "tsup.config.ts" ],
		languageOptions: {
			ecmaVersion: 2024,
			globals:     {
				Buffer:       "readonly",
				document:     "readonly",
				localStorage: "readonly",
				window:       "readonly"
				
			},
			sourceType: "module"
		},
		plugins: {
			"@stylistic":               stylistic,
			importPlugin,
			jsdoc,
			"prefer-optional-chaining": preferOptionalChaining,
			vuetify
		},
		rules: {
			"@stylistic/function-call-argument-newline": [ "error", "consistent" ],
			"@stylistic/function-call-spacing":          [ "error", "never" ],
			"@stylistic/space-in-parens":                [ "error", "always" ],
			"array-bracket-spacing":                     [ "error", "always" ],
			"brace-style":                               [ "error", "1tbs", { allowSingleLine: false } ],
			"comma-dangle":                              [ "error", "never" ],
			"computed-property-spacing":                 [ "error", "always" ],
			curly:                                       [ "error", "all" ],
			"dot-location":                              [ "error", "property" ],
			"dot-notation":                              "error",
			eqeqeq:                                      0,
			"function-paren-newline":                    [ "error", { minItems: 3 } ],
			indent:                                      [ "error", "tab", {
				MemberExpression: 1, SwitchCase: 1, VariableDeclarator: "first"
			} ],
			"jsdoc/check-values": [
				"error",
				{ allowedLicenses: [ "commercial" ] }
			],
			"jsdoc/no-multi-asterisks":          0,
			"jsdoc/no-undefined-types":          0,
			"jsdoc/require-param-description":   0,
			"jsdoc/require-param-type":          0,
			"jsdoc/require-returns-description": 0,
			"jsdoc/tag-lines":                   [ "error", "never", { startLines: 1 } ],
			"key-spacing":                       [ "error", { align: "value" } ],
			"linebreak-style":                   0,
			"newline-per-chained-call":          [ "error", { ignoreChainWithDepth: 2 } ],
			"no-console":                        "off",
			"no-debugger":                       "off",
			"no-extra-parens":                   "error",
			"no-extra-semi":                     "error",
			"no-lonely-if":                      "error",
			"no-mixed-spaces-and-tabs":          0,
			"no-multi-spaces":                   "error",
			"no-multiple-empty-lines":           [ "error", { max: 2, maxEOF: 0 } ],
			"no-new":                            0,
			"no-tabs":                           0,
			"no-throw-literal":                  0,
			"no-trailing-spaces":                [ 2, { skipBlankLines: true } ],
			"no-useless-constructor":            0,
			"no-useless-return":                 0,
			"no-var-requires":                   0,
			"no-whitespace-before-property":     "error",
			"node/no-callback-literal":          0,
			"object-curly-newline":              [ "error", { minProperties: 3, multiline: true } ],
			"object-curly-spacing":              [ "error", "always" ],
			"object-property-newline":           [ "error", { allowAllPropertiesOnSameLine: true } ],
			"operator-linebreak":                [ "error", "after" ],
			"padding-line-between-statements":   [
				"error",
				{
					blankLine: "always",next: "block", prev: "*"
				},
				{
					blankLine: "always", next: "*", prev: "block"
				},
				{
					blankLine: "always", next: "block-like", prev: "*"
				},
				{
					blankLine: "always", next: "*", prev: "block-like"
				}
			],
			"prefer-optional-chaining/prefer-optional-chaining": "error",
			"quote-props":                                       [ "error", "as-needed" ],
			quotes:                                              [ "error", "double" ],
			"require-await":                                     "off",
			semi:                                                [ "error", "always" ],
			"space-before-function-paren":                       [ "error", "never" ],
			"space-in-parens":                                   [ "error", "always" ],
			"space-infix-ops":                                   [ "error", { int32Hint: false } ]
		}
	},
	// overrides for Vue files
	{
		files:           [ "**/*.vue" ],
		ignores:         [ "public/**", "node_modules/**", "dist/**" ],
		languageOptions: {
			ecmaVersion:   2022,
			parser:        vueParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType:  "module"
			},
			sourceType: "module"
		},
		plugins: { vue },
		rules:   {
			"computed-property-spacing":        [ "error", "always" ],
			"vue/array-bracket-spacing":        [ "error", "always" ],
			"vue/attribute-hyphenation":        [ "error", "always" ],
			"vue/attributes-order":             [ "error",{ alphabetical: true } ],
			"vue/block-lang":                   "off",
			"vue/block-spacing":                [ "error", "always" ],
			"vue/html-closing-bracket-newline": [
				"error",
				{
					multiline:  "always",
					singleline: "never"
				}
			],
			"vue/html-indent":             [ "error", "tab", { baseIndent: 0 } ],
			"vue/jsx-uses-vars":           2,
			"vue/max-attributes-per-line": [
				"error",
				{
					multiline:  { max: 1 },
					singleline: { max: 3 }
				}
			],
			"vue/max-len": [
				"error",
				{
					code:                      120,
					comments:                  150,
					ignoreComments:            true,
					ignoreHTMLAttributeValues: false,
					ignoreHTMLTextContents:    false,
					ignorePattern:             "",
					ignoreRegExpLiterals:      true,
					ignoreStrings:             false,
					ignoreTemplateLiterals:    false,
					ignoreTrailingComments:    false,
					ignoreUrls:                true,
					tabWidth:                  4,
					template:                  150
				}
			],
			"vue/multi-word-component-names":             0,
			"vue/no-irregular-whitespace":                2,
			"vue/no-mutating-props":                      0,
			"vue/no-side-effects-in-computed-properties": 0,
			"vue/no-template-key":                        0,
			"vue/no-unused-properties":                   [ "error", {
				deepData:            false,
				groups:              [ "props", "data", "computed", "methods", "setup" ],
				ignorePublicMembers: false
			} ],
			"vue/no-v-for-template-key":          "off",
			"vue/no-v-for-template-key-on-child": "off",
			"vue/no-v-html":                      "off",
			"vue/no-v-model-argument":            "off",
			"vue/no-v-text-v-html-on-component":  "off",
			"vue/object-curly-spacing":           [ "error", "always" ],
			"vue/order-in-components":            2,
			"vue/require-explicit-emits":         2,
			"vue/this-in-template":               "off",
			"vue/v-bind-style":                   [ "error", "shorthand", { sameNameShorthand: "ignore" } ],
			"vue/v-on-event-hyphenation":         [ "error", "always", { autofix: true } ],
			"vue/valid-v-bind":                   "off",
			"vue/valid-v-if":                     "error",
			"vue/valid-v-slot":                   "off"
		}
	},
	{
		files: [ "**/*Skeleton.vue" ],
		rules: { "vue/no-unused-properties": "off" }
	}
];
