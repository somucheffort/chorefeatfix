// Used if you want to discard your changes
const DEFAULT_CONFIG = {
    template_commit: '%s%s: %s',
    template_scope: '(%s)',
    template_closes: 'closes #%d'
}

module.exports = {
    /**
     * Template for the commit message
     * 
     * @example for the '%s%s: %s' template goes 'chore(deps): message'
     * @default '%s%s: %s'
     */
    template_commit: '!publish %s%s: %s',
    /**
     * Template for the scope of a commit
     * 
     * @example for the '(%s)' template goes '(deps)'
     * @default '(%s)'
     */
    template_scope: '(%s)',
    /**
     * Template for the close
     * Used to describe what issue this commit will close
     *  
     * 
     * @example for the 'closes #%d' template goes 'closes #13'
     * @example 'fixes #%d'
     * @default 'closes #%d'
     */
    template_closes: 'closes #%d'
}