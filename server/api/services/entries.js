const axios = require("axios");

module.exports = {
  getAll: (channelId, token) =>
    axios(
      `https://slack.com/api/conversations.history?channel=${channelId}&token=${token}`
    ).then(result => {
      if (!result.data.ok) {
        throw result;
      }
      const channelEntries = result.data.messages.map((message, index) => {
        return {
          id: message.bot_id || index,
          title: `${message.type} @ ${message.ts}`,
          content: message.text
        };
      });
      return channelEntries;
    }),

  newPost: async data =>
    await axios({
      url: `https://hooks.slack.com/services/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`,
      method: "post",
      data: data
    }).then(result => {
      if (result.data === "ok") {
        return result.data;
      }
      throw result;
    })
};
