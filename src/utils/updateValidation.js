
const validateEditProfileData =  (req)=>{

        const allowedProfileEdit = ["firstName","lastName","age","skills","gender"]
        const isValid = Object.keys(req.body).every((fields)=>allowedProfileEdit.includes(fields))
        return isValid
}

module.exports = validateEditProfileData;