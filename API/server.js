import express from 'express';
import cors from 'cors'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export { prisma }

const app = express() /* colocar a biblioteca numa variavel */
app.use(express.json()) /* expressão p/ o express ativar o json */
app.use(cors())

app.post('/users', async (req,res) => {

    await prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
            age: Number(req.body.age)
        }
    })

    res.status(201).json(req.body)
})

/* app.post('/users', (req, res) => {  requisição é enviada pro POST
    console.log(req.body) exibe as informações do body 
    users.push(req.body) salva os dados na variavel 
    res.status(201).json(req.body) retorna status e usuario criado 
}) */

app.get('/users', async (req, res) => {
    /* res.send('Ok, deu bom') */
    console.log(req)
    let users = []
    if (req.query){
        users = await prisma.user.findMany({
            where: {
                name: req.query.name,
                email: req.query.email,
                age: req.query.age ? Number(req.query.age) : undefined
            }
        })
    } else {
        users = await prisma.user.findMany()
    }

    res.status(200).json(users) /* listagem de usuarios e código de sucesso*/
})

app.put('/users/:id', async (req,res) => {

    await prisma.user.update({
        where: {
            id: req.params.id
        },
        data: {
            email: req.body.email,
            name: req.body.name,
            age: Number(req.body.age)
        }
    })
    res.status(201).json(req.body)
})

app.delete('/users/:id', async (req, res) => {
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({message: "Usuário deletado com sucesso!!"})
})

app.listen(3000) /* a porta do computador escolhida para comunicação */



/*
    o navegador por padrão, quando acessa um endereço ele sempre usa com o GET
    1) tipo de rota / método HTTP (GET, POST, PUT, DELETE)
    2) Endereço

    HTTP métodos:
    GET - > LISTAR
    POST - > CRIAR
    PUT - > EDITAR VÁRIOS
    PATCH - > EDITAR 1
    DELETE - > DELETAR

    Para enviar informações para o servidor pode ser de 3 formas:

    QUERY PARAMS (GET) CONSULTAS (parametros por URL)
    - servidor.com/usuarios?estado=bahia&cidade=salvador
    - informações que não são delicadas, para pesquisas e etc

    ROUTE PARAM (GET/PUT/DELETE)
    - buscar, deletar ou editar algo especifico 

    ex: get servidor.com/users/22 (lista o usuario)
        put servidor.com/users/22 (edita o usuario)
        delete servidor.com/users/22 (delete o user)

    - normalmente é o ID

    BODY PARAMS (POST e PUT)
    - enviar informações pelo BODY, podendo enviar tudo, como informações
    sigilosas, sobre o usuario, etc

    HTTP STATUS DE RESPOSTA (CÓDIGO DEVOLVIDO PELO BACKEND QUE MOSTRA O STATUS)
    2xx -> SUCESSO (códigos que começam com 2)
    4XX -> ERRO CLIENTE (códigos que começam com 4, ex: erro 404, erro no FRONTEND)
    5XX -> ERRO SERVIDOR (erro no backend)
*/