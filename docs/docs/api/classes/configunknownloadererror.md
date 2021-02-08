---
id: "configunknownloadererror"
title: "Class: ConfigUnknownLoaderError"
sidebar_label: "ConfigUnknownLoaderError"
hide_title: true
---

# Class: ConfigUnknownLoaderError

Error specifying that the loader is unknown

## Hierarchy

* [*ConfigError*](configerror.md)

  ↳ **ConfigUnknownLoaderError**

## Constructors

### constructor

\+ **new ConfigUnknownLoaderError**(`message?`: *string*, `originalError?`: Error, `fileName?`: *string*): [*ConfigUnknownLoaderError*](configunknownloadererror.md)

#### Parameters:

Name | Type |
------ | ------ |
`message?` | *string* |
`originalError?` | Error |
`fileName?` | *string* |

**Returns:** [*ConfigUnknownLoaderError*](configunknownloadererror.md)

Inherited from: [ConfigError](configerror.md)

Defined in: src/errors.ts:44

## Properties

### fileName

• `Optional` **fileName**: *undefined* | *string*

Inherited from: [ConfigError](configerror.md).[fileName](configerror.md#filename)

Defined in: src/errors.ts:11

___

### message

• **message**: *string*

Inherited from: [ConfigError](configerror.md).[message](configerror.md#message)

Defined in: src/errors.ts:9

___

### name

• **name**: *string*= 'ConfigUnknownLoaderError'

Overrides: [ConfigError](configerror.md).[name](configerror.md#name)

Defined in: src/errors.ts:44

___

### originalError

• `Optional` **originalError**: *undefined* | Error

Inherited from: [ConfigError](configerror.md).[originalError](configerror.md#originalerror)

Defined in: src/errors.ts:10

___

### prepareStackTrace

• `Optional` **prepareStackTrace**: *undefined* | (`err`: Error, `stackTraces`: CallSite[]) => *any*

Optional override for formatting stack traces

**`see`** https://github.com/v8/v8/wiki/Stack%20Trace%20API#customizing-stack-traces

Defined in: node_modules/@types/node/globals.d.ts:11

___

### stack

• `Optional` **stack**: *undefined* | *string*

Inherited from: [ConfigError](configerror.md).[stack](configerror.md#stack)

Defined in: node_modules/typescript/lib/lib.es5.d.ts:975

___

### stackTraceLimit

• **stackTraceLimit**: *number*

Defined in: node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ **captureStackTrace**(`targetObject`: *object*, `constructorOpt?`: Function): *void*

Create .stack property on a target object

#### Parameters:

Name | Type |
------ | ------ |
`targetObject` | *object* |
`constructorOpt?` | Function |

**Returns:** *void*

Defined in: node_modules/@types/node/globals.d.ts:4
