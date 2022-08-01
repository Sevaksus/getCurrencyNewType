//создаём отдельный файл с конфигами config.js и пишем сюда конфиги
module.exports = {
  host: "localhost", // чтобы подключиться к локальной БД, надо host: "localhost" или 127.0.0.1   itgid.mysql.tools
  user: "root", // имя пользователя по умолчанию обычно - root
  database: "base", // имя БД, например, node_test                                  itgid_nodecourse
  password: "12345", // Пустая строка "" , если нет пароля
  insecureAuth: true,
}
