const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db.js")

//cofigurar pasta publica
server.use(express.static("public"))

//habilitar o uso do req.body na aplicação
server.use(express.urlencoded( {extended:true} ))

//utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    nocache: true
})



//configurar caminhos da minha aplicação
//pagina inicial
// req: requisição (pedido)
//res: resposta

server.get("/", (req, res) => {
    return res.render("index.html")

})

server.get("/create-point", (req, res) => {
    //req.query: query strings da URL
    

    return res.render("create-point.html")

})

server.post("/savepoint", (req, res) => {
    
    //req.body é o corpo do formulario
    //console.log(req.body)

    //inserir dados no banco de dados
    const query = `
    INSERT INTO places(
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (
        ?,?,?,?,?,?,?);
    `
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
        ]

    function afterInsertData(err){
        if(err){
        console.log(err)
        return res.send("Erro no cadastro!")
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html",{saved:true})
    }

     db.run(query, values, afterInsertData)
  

})

server.get("/search-results", (req, res) => {

    const search = req.query.search

    if(search ==""){
        //pesquisa vazia
        return res.render("search-results.html",{total:0})

    }
    
    // pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city like'%${search}%'`, function(err,rows){ //aqui tras a busca no formado de um array
                if(err) {
                    return console.log(err)
                }

                const total = rows.length //cont numero de elementos

                //mostrar a pagina html com os dados do banco de dados
                return res.render("search-results.html",{places: rows, total})
            })



    
})

// ligar o servidor
server.listen(3000)