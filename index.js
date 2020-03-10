const express = require('express');

const shortid = require('shortid');

const server = express();

let users = [];

server.use(express.json());


// POST METHOD FOR USERS

server.post('/api/users', (req, res) => {
    const usersInfo = req.body;
    if( !usersInfo.name && !usersInfo.bio) {
        res
            .status(400)
            .json({ errorMessage: "Please provide name and bio for the user."})
    } else if (usersInfo.name || !usersInfo.bio){
        usersInfo.id = shortid.generate();
        users.push(usersInfo);
        res.status(201).json(usersInfo)
    } else {
        res
            .status(500)
            .json({ errorMessage: "There was an error while saving the user to the database."})
    }
});

// GET METHOD FOR USERS

server.get('/api/users', (req, res) => {
    if(!users) {
        res
            .status(500)
            .json({ errorMessage: "The users information could not be retrieved."})
    } else {
        res
            .status(200)
            .json(users)
    }
});

// GET METHOD FOR SPECIFIC USER

server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const user = users.filter(elem => id === elem.id)
    // console.log('this is id', id);
    if (user.length <= 0) {
        res
            .status(404)
            .json({ message: "The user with the specified ID does not exist."})

    } else if (user.length > 0) {
        res
            .status(200)
            .json(user)
    } else {
        res
            .status(500)
            .json({ message: "The user information could not be retrieved."})
    }
})

// DELETE METHOD FOR SPECIFIC USER

server.delete("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const user = users.filter(elem => id === elem.id);
    if (user.length <= 0) {
        res
        .status(404)
        .json({ message: "The user with the specified ID does not exist."})
    } else if (user.length > 0) {
        
        res
            .status(200)
            .json({message: "user deleted."});

        let newUsers = users.filter(elem => id !== elem.id);
        users = newUsers;
    } else {
        res
            .status(500)
            .json({message: "user could not be removed."})
    }
})

server.put("/api/users/:id", (req, res) => {
    const { id } = req.params;
    const user = users.filter(elem => id === elem.id);
    const userInfo = req.body;

    if (user.length <= 0) {
        res
            .status(404)
            .json({ message: "The user with the specified ID does not exist."})
    } else if (user.length > 0) {
        if (!userInfo.name || !userInfo.bio) {
            res
                .status(400)
                .json({message: "Please provide name and bio for the user." })
        } else if (userInfo.name && userInfo.bio) {
            users = users.map(elem => {
                if(`${elem.id}` === id) {
                    return req.body;
                }
                return user;
            });
            res
                .status(200)
                .json(req.body);
        }
    } else {
        res
            .status(500)
            .json({errorMessage: "The user information could not be retrieved."});
    }
})

const PORT = 5000;
server.listen(PORT, () => console.log(`\n ** API on http://localhost:${PORT} **\n`))