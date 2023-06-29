const {execSync} = require('child_process')

module.exports.getCurrentBranch = ()=>{
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
}

module.exports.clearStage=()=>{
    return execSync('git reset .').toString().trim()
}

module.exports.createCommit = (message)=>{
    return execSync(`git commit --allow-empty -m'${message}'`).toString().trim()
}

module.exports.push = (name)=>{
    if(name){
        execSync(`git push origin ${name}`)
    }else{
        execSync(`git push`)
    }
}

module.exports.addTag = (name)=>{
    return execSync(`git tag ${name}`)
}

module.exports.findTag=(pattern)=>{
    const lines = execSync('git log --format="%D"').toString().split('\n')
    const tags = lines.map(l=>l.split(',')
            .filter(ref=>ref.trim()
            .indexOf('tag:')!=-1)
            .map(ref=>ref.split(':')[1].trim())
        ).flat()
    return tags.find(t=>!!t.match(pattern))
}