import express from "express";
import { MongoClient } from "mongodb";
import cors from 'cors';
import bodyParser from "body-parser";
import { v4 as generateID } from 'uuid';
import bcrypt from 'bcrypt';
import "dotenv/config";


const app = express();
const PORT = process.env.SERVER_PORT;
const DB_CONNECTION = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.CLUSTER_ID}.mongodb.net/`;

app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
const corsOptions = {
  origin: `http://localhost:${process.env.FRONT_PORT}`
};


app.use(express.json());
app.use(cors(corsOptions));

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}.`));

// users routes
// get all users
app.get('/users', async (req, res) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const data = await client.db('chat_palace').collection('users').find().toArray();
    res.send(data);
  } catch(err) {
    res.status(500).send({ error: err })
  } finally {
     client?.close();
  }
});

// checking backend function for user registration
const checkUniqueUser = async (req, res, next) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const sameUsername = await client.db('chat_palace').collection('users').findOne({ username: req.body.username });
   
    if(sameUsername){
      res.status(409).send({ errorMessage: 'Username already exists' });
    } else {
      next();
    }
} catch(err) {
  console.error(err);
  res.status(500).send({ error: err });
} finally {
  client?.close();
}
};

//post new user
app.post('/users',checkUniqueUser, async (req, res) => {
  // console.log("Request received!"); 
  // console.log(req.body);
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const { password, ...otherUserData } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const userToInsert ={
      ...otherUserData,
      password: hashedPassword,
      _id: generateID()
    };

    await client.db('chat_palace').collection('users').insertOne(userToInsert);
    res.send(userToInsert);
  } catch(err) {
    res.status(500).send({ error: err })
  } finally {
     client?.close();
  }
});

//login
app.post('/users/login', async (req, res) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    console.log(req.body);
    const data = await client.db('chat_palace').collection('users').findOne({ username: req.body.username });
    // console.log(data);
    if(data === null){ // netinkamas username
      res.status(401).send({ error: 'User does not exist with such username or password.' });
    } else { // buvo surastas pagal username
      const passCheck = bcrypt.compareSync(req.body.password, data.password);
      // console.log(passCheck);
      if(passCheck === false){ // tinkamas username, bet netinkamas password
        res.status(401).send({ error: 'User does not exist with such username or password.' });
      } else { // tinkamas username ir password
        res.status(200).json(data ); 
      }
    }
  } catch(err) {
    console.error(err);
    res.status(500).send({ error: err });
  } finally {
    client?.close();
  }
});