import express from 'express'
import crawlerRoutes from './crawlerRoutes'

const app = express()

app.use(express.json())
app.use(crawlerRoutes)

app.listen(5050)