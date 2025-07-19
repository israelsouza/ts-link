import express from 'express'
import shortRoute from './routes/shortRoutes.js'

const app = express();
app.use(express.json())

app.use('/api/short', shortRoute)




const PORT:number = 3000;
app.listen(PORT, () => {
    console.log(`Server listen in port http://localhost:${PORT}`)
})