#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const colors = require('colors-cli/safe')
const config = require('../config')
require('string-format-js')

const cffPrefix = colors.xb232.red('cff')
const gitPrefix = colors.xb232.white('git')

const exec = require('child_process').exec;

// https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716
const types = {
    feat: 'new feature for the user, not a new feature for build script',
    fix: 'bug fix for the user, not a fix to a build script',
    docs: 'changes to the documentation',
    style: 'formatting, missing semi colons, etc; no production code change',
    refactor: 'refactoring production code, eg. renaming a variable',
    test: 'adding missing tests, refactoring tests; no production code change',
    chore: 'updating grunt tasks etc; no production code change',
    ci: 'changes to the ci'
}

const toCommitMessage = (type, scope, message, closes) => config.template_commit.format(
    type, 
    scope ? config.template_scope.format(scope) : '', 
    message, 
    closes ? config.template_closes.format(closes) : ''
) // `${type}${scope ? `(${scope})` : ''}: ${message}`

const toGitCommand = (message) => `git commit -m "${message}"`

const gitOnData = (msg) => {
    console.log(gitPrefix, msg)
}

const gitOnError = (msg) => {
    console.log(cffPrefix, 'Seems like something broke... Check the error below:')
    console.log(gitPrefix, msg)
}

const gitAdd = async () => {
    const gitAddProcess = exec('git add .')

    gitAddProcess.stdout.on('data', gitOnData)
    gitAddProcess.stderr.on('data', gitOnError)
}

const gitCommit = async (commitMessage) => {
    const gitCommand = toGitCommand(commitMessage)
    const gitProcess = exec(gitCommand)

    gitProcess.stdout.on('data', gitOnData)
    gitProcess.stderr.on('data', gitOnError)
}

const commitArgv = async (argv) => {
    const commitMessage = toCommitMessage(
        argv._[0], // command name, used as commit type
        argv.scope, 
        argv.message,
        argv.closes
    )

    if (commitMessage.length > 72) {
        throw new Error('Commit message is longer than 72 chars!')
    }

    if (argv.add || argv.a) 
        await gitAdd()

    await gitCommit(commitMessage)    
}

const commitYargs = (yargs) => {
    yargs
    .positional('message', {
        describe: 'Commit message. Use quotes.',
    })
    .required('message')
}

const cff = yargs(hideBin(process.argv))
    .scriptName('cff')
    .usage('Usage: $0 [options] <command>')
    .help('h')
    .alias('h', 'help')
    .epilog('by redcarti')
    .demandCommand()
    .option('scope', {
        alias: 's',
        type: 'string',
        description: 'Set scope of a commit'
    })
    .option('add', {
        alias: 'a',
        type: 'boolean',
        description: 'Perform `git add .` command'
    })
    .option('closes', {
        alias: ['close', 'c'],
        type: 'number',
        description: 'Close an issue'
    })

Object.entries(types).forEach(([type, msg]) => {
    cff
    .command(type + ' [message]', msg, commitYargs, commitArgv)
})
    
cff.argv