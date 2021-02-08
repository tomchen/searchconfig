---
id: "defaultconfiggetstrategy"
title: "Function: defaultConfigGetStrategy"
sidebar_label: "defaultConfigGetStrategy"
hide_title: true
---

# Function: defaultConfigGetStrategy

▸ `Const`**defaultConfigGetStrategy**(`packageName`: *string*, `options?`: { `before?`: *undefined* | [*ConfigGetStrategyType*](../types/configgetstrategytype.md) | [*ConfigGetStrategyFilepathType*](../types/configgetstrategyfilepathtype.md) | [*ConfigGetStrategyFilenameType*](../types/configgetstrategyfilenametype.md) ; `fromDir?`: *undefined* | *string* ; `hasYaml?`: *undefined* | *boolean*  }): [*ConfigGetStrategyType*](../types/configgetstrategytype.md)

Construct a default configGetStrategy (to be used in [mergeConfig](mergeconfig.md))

**`example`** 

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`packageName` | *string* | The name of the package   |
`options?` | { `before?`: *undefined* | [*ConfigGetStrategyType*](../types/configgetstrategytype.md) | [*ConfigGetStrategyFilepathType*](../types/configgetstrategyfilepathtype.md) | [*ConfigGetStrategyFilenameType*](../types/configgetstrategyfilenametype.md) ; `fromDir?`: *undefined* | *string* ; `hasYaml?`: *undefined* | *boolean*  } | options. \{   |

**Returns:** [*ConfigGetStrategyType*](../types/configgetstrategytype.md)

Defined in: src/util.ts:39
