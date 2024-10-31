import { MongoClient } from "mongodb";
import express from "express";
import { v4 as generateID } from 'uuid';
import bcrypt from 'bcrypt';

const DB_CONNECTION = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.CLUSTER_ID}.mongodb.net/`;


// get all users
router.get('/users', async (req, res) => {
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
  router.post('/users',checkUniqueUser, async (req, res) => {
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
        console.error(err);
      res.status(500).send({ error: "Failed to register user due to a server error." })
    } finally {
       client?.close();
    }
  });
  
  //login
  router.post('/users/login', async (req, res) => {
    const client = await MongoClient.connect(DB_CONNECTION);
    try {
      const { username, password} = (req.body);
      // console.log(req.body);
      const user = await client.db('chat_palace').collection('users').findOne({ username });
  
      console.log(user);
      if(!user){ // netinkamas username
        res.status(401).send({ error: 'User does not exist with such username or password.' });
      } 
      
     // buvo surastas pagal username
        const passCheck = bcrypt.compareSync(password, user.password);
        // console.log(passCheck);
        if(!passCheck){ // tinkamas username, bet netinkamas password
          return res.status(401).send({ error: 'User does not exist with such username or password.' });
        } 
        
        // tinkamas username ir password
        res.status(200).json(user ); 
      
      
    } catch(err) {
      console.error(err);
      res.status(500).send({ error: err });
    } finally {
      client?.close();
    }
  });
  
  // edit user
  router.patch('/edit-user/:id', async (req, res) => {
    const client = await MongoClient.connect(DB_CONNECTION);
    try {
      const { username, profileImage, password } = req.body;
      const id = req.params.id;
      console.log(req.body)
  
      // Fetch the current user from the database to get the existing password
      const currentUser = await client
        .db('chat_palace')
        .collection('users')
        .findOne({ _id: id });
  
  
      // Prepare the fields to update (username and email)
      let updateFields = { username, profileImage };
  
      // Check if a new password is provided and is not empty
      if (password && password.trim()) {
        console.log(password)
        const hashedPassword = bcrypt.hashSync(password, 10);  // Hash the password
        updateFields.password = hashedPassword;  // Update hashed password
      } 
      // Log updateFields for debugging
      console.log("Updating user with fields:", updateFields);
  
      // Update the user document in MongoDB
      const editResponse = await client
        .db('chat_palace')
        .collection('users')
        .updateOne({ _id: id }, { $set: updateFields });
  
         // Log the MongoDB update response
      console.log("MongoDB Update Response:", editResponse);
  
      if (editResponse.modifiedCount === 0) {
        return res.status(500).send({ error: "Failed to update user." });
      }
  
      res.send({ success: "User updated successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Server error. Please try again later." });
    } finally {
      client?.close(); // Close the DB connection
    }
  });
  
  // Get a specific user by ID
  router.get('/users/:id', async (req, res) => {
    const client = await MongoClient.connect(DB_CONNECTION);
    try {
      const { id } = req.params;
      const user = await client.db('chat_palace').collection('users').findOne({ _id: id });
  
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
  
      res.send(user);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Failed to fetch user data due to a server error." });
    } finally {
      client?.close();
    }
  });

  export default router;
  