// backend.js
import express from "express";
import cors from 'cors';

const app = express();
const port = 8000;
const users = { 
   users_list :
   [
      { 
         id : 'xyz789',
         name : 'Charlie',
         job: 'Janitor',
      },
      {
         id : 'abc123', 
         name: 'Mac',
         job: 'Bouncer',
      },
      {
         id : 'ppp222', 
         name: 'Mac',
         job: 'Professor',
      }, 
      {
         id: 'yat999', 
         name: 'Dee',
         job: 'Aspring actress',
      },
      {
         id: 'zap555', 
         name: 'Dennis',
         job: 'Bartender',
      }
   ]
}

function generateId() {
   return Math.random().toString(36).substr(2, 6);
}

app.use(express.json());
app.use(cors());


app.get('/users', (req, res) => {
   const name = req.query.name;
   if (name != undefined){
       let result = findUserByName(name);
       result = {users_list: result};
       res.send(result);
   }
   else{
       res.send(users);
   }
});
app.get('/users/:id', (req, res) => {
   const id = req.params['id']; //or req.params.id
   let result = findUserById(id);
   if (result === undefined || result.length == 0)
       res.status(404).send('Resource not found.');
   else {
       result = {users_list: result};
       res.send(result);
   }
});

app.post('/users', (req, res) => {
   const userToAdd = req.body;
   userToAdd.id = generateId(); 
   console.log("New User with ID:", userToAdd);
   addUser(userToAdd);
   res.status(201).send(userToAdd);  
});

function addUser(user){
   users['users_list'].push(user);
}

function findUserById(id) {
   return users['users_list'].find( (user) => user['id'] === id); // or line below
   //return users['users_list'].filter( (user) => user['id'] === id);
}

const findUserByName = (name) => { 
   return users['users_list'].filter( (user) => user['name'] === name); 
}

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.delete('/users/:id', (req, res) => {
   const id = req.params.id;
   const userIndex = users['users_list'].findIndex(user => user['id'] === id);

   if (userIndex !== -1) {
       users['users_list'].splice(userIndex, 1);
       res.status(204).end(); // Successful delete with no content returned
   } else {
       res.status(404).send('User not found'); // User not found
   }
});

app.get('/users', (req, res) => {
   const name = req.query.name;
   const job = req.query.job;

   let result = findUserByNameAndJob(name, job);
   
   if (result.length) {
       res.send({ users_list: result });
   } else {
       res.status(404).send('No matching users found');
   }
});

const findUserByNameAndJob = (name, job) => {
   return users['users_list'].filter(user => {
       return (!name || user['name'] === name) && (!job || user['job'] === job);
   });
};


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
