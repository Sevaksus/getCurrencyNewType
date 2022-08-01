const axios = require("axios")

module.exports = {
  getCurrency: async function (a) {
    const res = await axios
      .get("https://api.binance.com/api/v3/avgPrice?symbol=" + a)
      .then((data) => {
        //console.log(data.data)
        return {
          price: data.data.price,
          currency: a,
        }
      })
      .catch((error) => {
        return error.message
      })
    return res
  },
}
