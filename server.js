// Подключаем библиотеку express из папки node_modules написав команду:
const express = require("express")

// создаём переменную являющуюся веб.сервером
const app = express()

//позволяет генерировать абсолютные пути, которые необходимы для передачи статических файлов
const path = require("path")
const { getCurrency } = require("./getCurrency.js")
const cron = require("node-cron")
// const mysql = require("mysql")
const config = require("./config.js")
const config2 = require("./config2.js")
const mysql = require("mysql2/promise")

app.use(express.static(path.join(__dirname, "public")))
// path.join получает два аргумента:

// Текущую рабочую директорию (cwd).
// Вторую директорию, которую нужно объединить с cwd.

// настроем сервер на определённом порту
app.listen(3012, function () {
  console.log("Server was started")
})

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.get("/:pr", async function (req, res) {
  // вызвать функцию, которая лезет в mysql и ищет соответствующий кнопке нажатия req.params.pr
  // и ищет тот, у кого время максимальное, а если ничего не возвращается, то выполняем функцию getCurrency

  console.log(req.params.pr)
  //   const btcUsdt = await getFromDatabase(req.pr) - это будет с БД-шкой
  if ((await getFromDatabase(req.params.pr)) !== undefined) {
    res.send(getFromDatabase(req.params.pr))
  } else {
    const btcUsdt = await getCurrency(req.params.pr)
    res.send(btcUsdt)
  }

  // добавляем в ответ доступ из разных источников
  res.set("Access-Control-Allow-Origin", "*")
})
//
//
//
//
//
// ответ на любой другой get запрос
app.get("/*", function (req, res) {
  res.send("Something wrong")
})

//
//
//
//
// напишем вызов последнего записанного значения валюты
async function getFromDatabase(currency) {
  const conn = await mysql.createConnection(config2) // вернуть сюда из майскл последнего значения
  const [rows, fields] = await conn.execute(
    "select * from currencies where id = (SELECT MAX(id) FROM currencies WHERE currency='BTCUSDT')"
  )
  conn.end()
  console.log("Enter")
  return rows[0]
}

// Удалить. просто проверка
// async function f() {
//   let a = await getFromDatabase()
//   // проверяем, что а - это теперь переменная, а не promise
//   return a[0]["price"]
// }

// f()

//
//
//
//
// сделали массив с вызываемыми парам-ми
const currencies = ["BTCUSDT", "ETHUSDT", "BNBBTC"]

cron.schedule("*/1 * * * *", async () => {
  //Promise.all принимает массив промисов и выполняет их одновременно/параллельно
  const resValues = await Promise.all(
    // map - это метод вызова каждого элем-а
    currencies.map((value) => {
      // вызвали getCurrency с параметром value для каждого элемента массива, который и передали в качестве value
      return getCurrency(value)
    })
  )
  const createdDate = String(parseInt((new Date().getTime() / 1000).toFixed(0)))
  const sql = "INSERT INTO currencies (currency, value, created) VALUES ?"
  const queryValues = resValues.map((value) => {
    return [value.currency, value.price, createdDate]
  })
  conn.query(sql, [queryValues], function (err, result) {
    if (err) throw err
    console.log("Number of records inserted: " + result.affectedRows)
  })
})

// async function cronFunction () {
//   const btcUsdt = await getCurrency("BTCUSDT")
//   // записать майскл
// }

// const currencies = ["BTCUSDT", "ETHUSDT", "BNBBTC"]

// cron.schedule("*/1 * * * *", async () => {
//   //Promise.all принимает массив промисов и выполняет их одновременно/параллельно
//   const resValues = await Promise.all(
//     // map - это метод вызова каждого элем-а
//     currencies.map((value) => {
//       // вызвали getCurrency с параметром value для каждого элемента массива, который и передали в качестве value
//       return getCurrency(value)
//     })
//   )
//   const createdDate = String(parseInt((new Date().getTime() / 1000).toFixed(0)))
//   const sql = "INSERT INTO currencies (currency, value, created) VALUES ?"
//   const queryValues = resValues.map((value) => {
//     return [value.currency, value.price, createdDate]
//   })
//   conn.query(sql, [queryValues], function (err, result) {
//     if (err) throw err
//     console.log("Number of records inserted: " + result.affectedRows)
//   })
// })
