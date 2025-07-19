import express from 'express'


const app = express();
app.use(express.json())






const PORT:number = 3000;
app.listen(PORT, () => {
    console.log(`Server listen in port http://localhost:${PORT}`)
})