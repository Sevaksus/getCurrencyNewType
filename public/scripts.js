async function getBtcUsdt(currency, params) {
  let a = document.getElementById("resInOne").innerHTML
  console.log(a)
  const { data } = await axios.get(`http://localhost:3012/${currency}`)
  if (data) {
    document.getElementById(params[0]).innerHTML = data.price
  }
  if (a == 0) {
    document.getElementById(params[1]).innerHTML = 0 + "%"
  } else {
    let b = document.getElementById(params[0]).innerHTML
    let c = Number(1 - a / b).toFixed(3)
    document.getElementById(params[1]).innerHTML = c + "%"
  }
}
