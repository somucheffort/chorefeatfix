const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const colors = require('colors-cli/safe')

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
}

const toCommitMessage = (type, scope, message) => `${type}${scope ? `(${scope})` : ''}: ${message}`

const gitAdd = () => {
    const gitAddProcess = exec(`git add .`)

    gitAddProcess.stdout.on('data', (msg) => {
        console.log(gitPrefix, msg)
    })
    gitAddProcess.stderr.on('data', (msg) => {
        console.log(cffPrefix, 'Seems like something broke... Check the error below:')
        console.log(gitPrefix, msg)
    })
}

const gitCommit = (commitMessage) => {
    const gitCommand = toGitCommand(commitMessage)
    const gitProcess = exec(gitCommand)

    gitProcess.stdout.on('data', (msg) => {
        console.log(gitPrefix, msg)
    })
    gitProcess.stderr.on('data', (msg) => {
        console.log(cffPrefix, 'Seems like something broke... Check the error below:')
        console.log(gitPrefix, msg)
    })
}

const commitArgv = async (argv) => {
    const commitMessage = toCommitMessage(argv._[0], argv.scope, argv.message.join(' '))

    if (argv.add || argv.a) 
        await gitAdd()

    await gitCommit(commitMessage)    
}

const commitYargs = (yargs) => {
    yargs
    .positional('message', {
        describe: 'Commit message'
    })
    .required('message')
}

const toGitCommand = (message) => `git commit -m "${message}"`

yargs(hideBin(process.argv))
    .scriptName('cff')
    .usage('Usage: $0 [options] <command>')
    .help('h')
    .alias('h', 'help')
    .epilog('by redcarti')
    .demandCommand()
    .command('chore [message..]', types['chore'], commitYargs, commitArgv)
    .command('feat [message..]', types['feat'], commitYargs, commitArgv)
    .command('fix [message..]', types['fix'], commitYargs, commitArgv)
    .command('docs [message..]', types['docs'], commitYargs, commitArgv)
    .command('style [message..]', types['style'], commitYargs, commitArgv)
    .command('refactor [message..]', types['refactor'], commitYargs, commitArgv)
    .command('test [message..]', types['test'], commitYargs, commitArgv)
    .option('scope', {
        alias: 's',
        type: 'string',
        description: 'Set scope of a commit'
    })
    .option('add', {
        alias: 'a',
        type: 'boolean',
        description: 'Perform `git add` command'
    })
    .argv