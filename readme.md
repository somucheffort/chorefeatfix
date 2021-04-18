# chorefeatfix

CLI app that will help you to create semantic commit messages

# Installing

## `npm`

```console
$ npm i https://github.com/redcarti/chorefeatfix -g
```

## `yarn`

```console
$ yarn global add https://github.com/redcarti/chorefeatfix
```

# Usage

```console
$ cff
Usage: cff [options] <command>

Commands:
  cff chore [message..]     updating grunt tasks etc; no production code change 
  cff feat [message..]      new feature for the user, not a new feature for     
                            build script
  cff fix [message..]       bug fix for the user, not a fix to a build script   
  cff docs [message..]      changes to the documentation
  cff style [message..]     formatting, missing semi colons, etc; no production 
                            code change
  cff refactor [message..]  refactoring production code, eg. renaming a variable
  cff test [message..]      adding missing tests, refactoring tests; no
                            production code change

Options:
      --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
  -s, --scope    Set scope of a commit                                  [string]

by redcarti
```