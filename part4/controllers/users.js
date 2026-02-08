const bcrypt = require('bcrypt')
const usersRouter = require('express').Router();
const User = require('../models/user')
const Blog = require('../models/blog')




usersRouter.post('/', async (request, response)=>{

    const {username, name, password } = request.body;
    if(username.length < 3 || password.length < 3){
        return response.status(401).json({error: 'username or password must be at least 3 characters long'})
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User(
        {username: username,
            name: name,
            passwordHash: passwordHash
        }
    )

    const savedUser = await user.save();
    response.status(201).json(savedUser);
})

usersRouter.get('/', async(req, resp) => {
    const users = await User.find({}).populate('blogs')
    if(users){
        resp.json(users)
    }
})

module.exports = usersRouter