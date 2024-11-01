import express from "express";
import "dotenv/config";
import cors from 'cors';

import usersRoutes from './routes/users.js';


const app = express();
const PORT = process.env.SERVER_PORT;
const corsOptions = {
  origin: `http://localhost:${process.env.FRONT_PORT}`,
  optionsSuccessStatus: 200
};

app.use(express.json());
app.use(cors(corsOptions));


// users 
app.use('/api/users', usersRoutes);

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}.`));


