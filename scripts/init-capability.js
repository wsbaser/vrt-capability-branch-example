const {getCurrentBranch,findTag,createCommit, push, clearStage, addTag} = require('./git.utils')

const CAPABILITY_BRANCH_PREFIX = 'capability/'
const CAPABILITY_TAG_PREFIX = 'capability-tag/'
//==================================================================================
// 0. Verify that capability branch prefix and capability tag prefix are not the same
//==================================================================================
if(CAPABILITY_BRANCH_PREFIX===CAPABILITY_TAG_PREFIX){
    throw Error("Capability branch prefix and capability tag prefix are equal. This will lead to creating tag with the same name as branch and make git confused by ambiguous references.")
}
//==================================================================================
// 1. Check if we are on the capability branch
//==================================================================================
const currentBranch = getCurrentBranch()
if(!currentBranch.startsWith(CAPABILITY_BRANCH_PREFIX)){
    console.log('This is not a capability branch.')
    return
}
//==================================================================================
// 2. Check if capability tag exists
//==================================================================================
let capabilityTag = findTag(CAPABILITY_TAG_PREFIX)
if(capabilityTag){
    console.log(`This is a capability branch, but capability tag already exists: ${capabilityTag}.`)
    return
}
//==================================================================================
// 3. Get capability name from capability branch name
//==================================================================================
const capabilityName = currentBranch.substring(CAPABILITY_BRANCH_PREFIX.length)
console.log(`You have just checked out branch for capability '${capabilityName.toUpperCase()}'.`)
//==================================================================================
// 4. Create initial empty commit for capability branch
//==================================================================================
console.log(`Clearing staged changes...`)
clearStage()   // Since we need to create empty commit, we need to clear the stage
console.log(`Creating initial commit for capability branch...`)
createCommit(`Initial commit for capability ${capabilityName}`)
//==================================================================================
// 5. Push commit
//==================================================================================
console.log(`Pushing initial commit...`)
//push()
//==================================================================================
// 6. Add tag for initial commit
//==================================================================================
console.log(`Creating capability tag...`)
capabilityTag =`${CAPABILITY_TAG_PREFIX}${capabilityName}` 
addTag(capabilityTag)
//==================================================================================
// 7. Push tag to origin
//==================================================================================
console.log(`Pushing capability tag...`)
push(capabilityTag)
//==================================================================================
console.log(`All set! Now your capability branch has capability tag. Please, configure passing capabilityBranchName option for VRT.`)