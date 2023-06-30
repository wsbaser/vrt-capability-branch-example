const {
    getCurrentBranch,
    findTag,
    createCommit,
    clearStage,
    addTag,
    push,
    pushWithSetUpstream,
    getLocalHeadsFor,
} = require('./git.utils')
//==================================================================================
// ARGUMENTS
//==================================================================================
const commitHash = process.argv[2]
//==================================================================================
// CONFIGURATION: Set branch prefix and capability tag prefix to values that suite your project.
//==================================================================================
const CAPABILITY_BRANCH_PREFIX = 'capability/'
const CAPABILITY_TAG_PREFIX = 'capability-tag/'
const IGNORE_BRANCHES = [/^main$/,/^master$/]
//==================================================================================
const log = (message)=>{
    console.log(`>>>>> ${message}`)
}
//==================================================================================
// 0. Verify that capability branch prefix and capability tag prefix are not the same
//==================================================================================
if(CAPABILITY_BRANCH_PREFIX===CAPABILITY_TAG_PREFIX){
    throw Error("Capability branch prefix and capability tag prefix are equal. This will lead to creating tag with the same name as branch and make git confused by ambiguous references.")
}
//==================================================================================
// 1. Check if we are on the branch based on capability branch
//==================================================================================
const currentBranch = getCurrentBranch()
if(IGNORE_BRANCHES.some(b=>currentBranch.match(b))){
    log(`'${currentBranch}' is not a feature branch.`)
    return
}
const commitHeads = getLocalHeadsFor(commitHash)
commitHeads.forEach((h)=>{console.log(h)})
const capabilityBranches = commitHeads.filter(h=>h.startsWith(CAPABILITY_BRANCH_PREFIX))
if(capabilityBranches.length>1){
    throw new Error(`There are several capability branches based on commit ${commitHash}. Unable to define which capability current branch belongs to.`)
}
if(capabilityBranches.length==0){
    log('This feature branch is not based on the capability branch.')
    return
}
const capabilityBranch = capabilityBranches[0]
if(capabilityBranch===currentBranch){
    log(`'${currentBranch}' is a capability branch.`)
    return
} 
log(`'${currentBranch}' is a feature branch based on the capability branch '${capabilityBranch}'.`)

//==================================================================================
// 2. Check if capability tag exists
//==================================================================================
let capabilityTag = findTag(CAPABILITY_TAG_PREFIX)
if(capabilityTag){
    log(`Capability tag already exists: ${capabilityTag}.`)
    return
}
//==================================================================================
// 3. Get capability name from capability branch name
//==================================================================================
const capabilityName = capabilityBranch.substring(CAPABILITY_BRANCH_PREFIX.length).trim()
if(!capabilityName){
    throw new Error(`Capability branch '${capabilityBranch}' does not contain capability name.`)
}
log(`Capability name: '${capabilityName.toUpperCase()}'.`)
//==================================================================================
// 4. Create initial empty commit for capability branch
//==================================================================================
log(`Clearing staged changes...`)
clearStage()   // Since we need to create empty commit, we need to clear the stage
log(`Creating initial commit for capability (required for capability tag)...`)
createCommit(`Initial commit for capability ${capabilityName.toUpperCase()} in '${currentBranch}'`)
//==================================================================================
// 5. Push commit
//==================================================================================
log(`Pushing initial commit...`)
pushWithSetUpstream(currentBranch)
//==================================================================================
// 6. Add tag for initial commit
//==================================================================================
log(`Creating capability tag...`)
const tagId = Math.floor(Math.random() * 1000000000)
capabilityTag =`${CAPABILITY_TAG_PREFIX}${capabilityName}.${tagId}` 
addTag(capabilityTag)
//==================================================================================
// 7. Push tag to origin
//==================================================================================
log(`Pushing capability tag...`)
push(capabilityTag)
//==================================================================================
log(`All set! Now your capability branch has a capability tag. Please, configure passing capabilityBranchName option to VRT.`)