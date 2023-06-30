const {execSync} = require('child_process')

const exec = (command)=>{
    console.log(command)
    return execSync(command).toString().trim()
}

module.exports.getCurrentBranch = ()=>{
    return exec('git rev-parse --abbrev-ref HEAD').toString().trim()
}

module.exports.clearStage=()=>{
    return exec('git reset .').toString().trim()
}

module.exports.createCommit = (message)=>{
    return exec(`git commit --allow-empty -m"${message}"`).toString().trim()
}

module.exports.pushWithSetUpstream = (name)=>{
    exec(`git push --set-upstream origin ${name}`)
}

module.exports.push = (name)=>{
    exec(`git push origin ${name}`)
}

module.exports.deleteLocalTag = (name)=>{
    return exec(`git tag -d ${name}`)
}

module.exports.deleteRemoteTag = (name)=>{
    return exec(`git push --delete origin ${name}`)
}

module.exports.addTag = (name)=>{
    return exec(`git tag ${name}`)
}

module.exports.findTag=(pattern)=>{
    const lines = exec('git log --format="%D"').toString().split('\n')
    const tags = lines.map(l=>l.split(',')
            .filter(ref=>ref.trim()
            .indexOf('tag:')!=-1)
            .map(ref=>ref.split(':')[1].trim())
        ).flat()
    return tags.find(t=>!!t.match(pattern))
}

const getRefNamesFor = (commit, prefix)=>{
    const output = exec(`git for-each-ref --points-at ${commit} --format=%(refname:short) ${prefix}`).toString()
    return output.split('\n')
}

module.exports.getLocalHeadsFor = (commit)=>{
    return getRefNamesFor(commit, 'refs/heads')
}

module.exports.getLocalTagsFor = (commit)=>{
    return getRefNamesFor(commit, 'refs/tags')
}