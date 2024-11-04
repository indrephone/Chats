import express from "express";
import { MongoClient } from "mongodb";
import cors from 'cors';

import { v4 as generateID } from 'uuid';
import bcrypt from 'bcrypt';
import "dotenv/config";


const app = express();
const PORT = process.env.SERVER_PORT;
const DB_CONNECTION = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.${process.env.CLUSTER_ID}.mongodb.net/`;


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

// checks if a username is unique during registration
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
      console.error(err);
    res.status(500).send({ error: "Failed to register user due to a server error." })
  } finally {
     client?.close();
  }
});

//login
app.post('/users/login', async (req, res) => {
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
app.patch('/edit-user/:id', async (req, res) => {
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
app.get('/users/:id', async (req, res) => {
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

// conversations routes
// auth middleware
// Basic authentication middleware using _id in headers
const authMiddleware = (req, res, next) => {
  const userId = req.headers['_id'];

  if (!userId) {
    return res.status(401).send({ error: "Unauthorized: _id not provided" });
  }

  req._id = userId; // Attach _id to the request object for access in routes
  next(); // Proceed to the route
};


// get all conversations of logged in user
app.get('/conversations', authMiddleware, async (req, res) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const data = await client.db('chat_palace').collection('conversations').find({
      $or: [{ user1: req._id }, { user2: req._id }]
    }).toArray();

    res.send(data);
  } catch (err) {
    res.status(500).send({ error: err });
  } finally {
    client?.close();
  }
});

// get a specific conversation by ID
app.get('/conversations/:id', authMiddleware, async (req, res) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const conversationId = req.params.id;
    const conversation = await client.db('chat_palace').collection('conversations').findOne({
      _id: conversationId,
      $or: [{ user1: req._id }, { user2: req._id }]
    });

    if (!conversation) {
      return res.status(404).send({ error: "Conversation not found or unauthorized access" });
    }

    res.send(conversation);
  } catch (err) {
    res.status(500).send({ error: err });
  } finally {
    client?.close();
  }
});

// create a new conversation
app.post('/conversations', authMiddleware, async (req, res) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    // Extract the second user (user2) from the request body
    const { user2 } = req.body;

    // Create a new chatroom object with the logged-in user as user1
    const newConversation = {
      _id: generateID(), // Generate a unique ID for the new chatroom
      user1: req._id, // Set the logged-in user as user1
      user2: user2, // Set the other user as user2 from the request body
      hasUnreadMessages: false // Initial state of unread messages
    };

    // Insert the new chatroom into the database
    await client.db('chat_palace').collection('conversations').insertOne(newConversation);

    // Respond with the created chatroom
    res.status(201).send(newConversation);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to create conversation due to a server error." });
  } finally {
    client?.close();
  }
});

// delete a conversation
app.delete('/conversations/:id', authMiddleware, async (req, res) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const conversationId = req.params.id;

    // Find and delete the  conversation only if the logged-in user is either user1 or user2
    const result = await client.db('chat_palace').collection('conversations').deleteOne({
      _id: conversationId,
      $or: [{ user1: req._id }, { user2: req._id }]
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Chatroom not found or unauthorized access" });
    }

    res.send({ success: "Conversation deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to delete conversation due to a server error." });
  } finally {
    client?.close();
  }
});

// messages routes
// get all messages with user info info which belongs to conversation, which id is passed through params

app.get('/conversations/:id/messages', authMiddleware, async (req, res) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const conversationId = req.params.id;
    const userId = req._id;

    // Aggregate messages with sender info
    const messages = await client.db('chat_palace').collection('messages').aggregate([
      { $match: { conversationId: conversationId } }, // Match by conversationId
      {
        $lookup: {
          from: 'users',
          localField: 'senderId',
          foreignField: '_id',
          as: 'senderInfo'
        }
      },
      { $unwind: '$senderInfo' }, // Unwind senderInfo to get user details
      { $sort: { timestamp: 1 } } // Sort messages by timestamp (oldest to newest)
    ]).toArray();

     // Mark the conversation as read by user2
     await client.db('chat_palace').collection('conversations').updateOne(
      { _id: conversationId, user2: userId }, // Ensure user2 is the logged-in user
      { $set: { hasUnreadMessages: false } }
    );

    res.status(200).send(messages);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
    res.status(500).send({ error: "Failed to fetch messages due to a server error." });
  } finally {
    client?.close();
  }
});




// POST route to add a new message to a specific conversation
app.post('/conversations/:id/messages', authMiddleware, async (req, res) => {
  const client = await MongoClient.connect(DB_CONNECTION);
  try {
    const conversationId = req.params.id;
    const senderId = req._id; // Get the authenticated user ID from middleware
    const { content } = req.body; // Expecting `content` in the request body

     // Debugging logs
     console.log("Conversation ID:", conversationId);
     console.log("Sender ID:", senderId);

    // Create a new message object
    const newMessage = {
      _id: generateID(),
      conversationId,
      senderId,
      content,
      timestamp: new Date().toISOString(), // Current timestamp
      likes: [] // Initial empty array for likes
    };

    // Insert the new message into the database
    await client.db('chat_palace').collection('messages').insertOne(newMessage);

     // Set `hasUnreadMessages` to true for the conversation if sender is `user1`
     const updateResult = await client.db('chat_palace').collection('conversations').updateOne(
      { _id: conversationId, user2: { $ne: senderId } }, // Ensure user2 is the recipient
      { $set: { hasUnreadMessages: true } }
    );

      // Debugging log to check the result of the update operation
      console.log("Update Result:", updateResult);

    res.status(201).send(newMessage); // Respond with the newly created message
  } catch (err) {
    console.error("Failed to add message:", err);
    res.status(500).send({ error: "Failed to add message due to a server error." });
  } finally {
    client?.close();
  }
});


