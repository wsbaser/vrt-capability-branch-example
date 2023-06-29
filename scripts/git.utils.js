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

module.exports.push = (name)=>{
    if(name){
        exec(`git push origin ${name}`)
    }else{
        exec(`git push`)
    }
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