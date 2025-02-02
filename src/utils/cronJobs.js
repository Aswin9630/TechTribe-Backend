const cron = require("node-cron");
const {subDays, startOfDay, endOfDay} = require("date-fns");
const ConnectionRequest = require("../model/connectionRequestModel");
const sendEmail = require("../utils/sendEmail")

cron.schedule("30 11 * * *", async()=>{
    try {
        const yesterday = subDays(new Date(),0);
        const yesterdayStart = startOfDay(yesterday)
        const yesterdayEnd = endOfDay(yesterday);
        const pendingRequest = await ConnectionRequest.find({
            status:"interested",
            createdAt:{
                $gte:yesterdayStart,
                $lte:yesterdayEnd
            }
        }).populate("fromUserId toUserId");
        const listOfEmails = [...new Set(pendingRequest.map((req)=>req.toUserId.email))];

        for(const email of listOfEmails){
            try {
            const response = await sendEmail.run("New Friend Request from "+email)
            } catch (error) {
                console.error(error.message)
            }
        }
    } catch (error) {
        console.error(error.message)
    }
})