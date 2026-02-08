const blogsRouter = require('express').Router();
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await  Blog.find({}).populate('user', {username:1, name:1})
 
  response.json(blogs)
  
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)
  if(!user){
    return response.status(400).json({error: 'userId missing or not valid'})
  }

  if(!body.title || !body.url){return response.status(400).json({ error: 'title or url missing' })}
 

  const blog = new Blog({
    title: body.title,
    author: body.author, 
    likes: body.likes || 0,
    url: body.url,
    user: user.id 
  })

  try{
    const savedBlog = await blog.save();
    console.log(savedBlog)
    user.blogs = user.blogs.concat(savedBlog.id)
    await user.save()
    response.status(201).json(savedBlog);
  }catch (exception) {
    
    response.status(400).json({ error: exception.message })
  }

  
})


blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const id = request.params.id

    const result = await Blog.findByIdAndDelete(id)
    
    if (result) {
      
      response.status(204).end()
    } else {
      
      response.status(404).json({ error: "Blog wasn't found" })
    }
  } catch (error) {
    
    next(error) 
   
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  
  const { title, author, likes, url } = request.body

  const blogToUpdate = {
    title,
    author,
    likes,
    url
  }

  try {
    // 2. Ejecutamos la actualización con await
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id, 
      blogToUpdate, 
      { new: true, runValidators: true, context: 'query' }
    )

    
    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error) 
  }
})

module.exports = blogsRouter