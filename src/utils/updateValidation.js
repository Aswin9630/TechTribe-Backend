
const validateEditProfileData =  (req)=>{

        const allowedProfileEdit = ["firstName","lastName","age","gender","designation"]
        const isValid = Object.keys(req.body).every((fields)=>allowedProfileEdit.includes(fields))
        return isValid
}

module.exports = validateEditProfileData;