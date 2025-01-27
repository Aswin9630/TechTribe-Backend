const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");


const createSendEmailCommand = (toAddress, fromAddress, body) => {
    return new SendEmailCommand({
      Destination: {
        CcAddresses: [
        ],
        ToAddresses: [
          toAddress,
        ],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `<h1>${body}</h1>`,
          },
          Text: {
            Charset: "UTF-8",
            Data: "This is text format",
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Message from TechTribe",
        },
      },
      Source: fromAddress,
      ReplyToAddresses: [
      ],
    });
  };

const run = async (body) => {
    const sendEmailCommand = createSendEmailCommand(
      "aswinkrishna005@gmail.com",
      "aswin@thetechtribe.xyz",
      body
    );
  
    try {
      return await sesClient.send(sendEmailCommand);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "MessageRejected") {
        const messageRejectedError = caught;
        return messageRejectedError;
      }
      throw caught;
    }
};

module.exports = { run }