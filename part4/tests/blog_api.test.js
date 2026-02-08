const {test,describe, after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const app = require('../app')
const listHelper = require('../utils/list_helper');
const supertest = require('supertest');
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)
const bcrypt = require('bcrypt')
beforeEach(async () => {
await Blog.deleteMany({})
for(let blog of listHelper.initialBlogs){
let blogObject = new Blog(blog)
await blogObject.save();
}
})

describe('when there is only one user', ()=>{

  beforeEach(async ()=>{
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({
      username: 'root',
      password: passwordHash
    })
    await user.save()
  })

  test('creation succeeds with a fresh username', async()=>{
    const usersAtStart = await listHelper.usersInDb();
    const newUser = {username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',}
    
    await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
  test('creation fails with proper status code and message if username is already taken', async ()=>{
    const usersAtStart = await listHelper.usersInDb();
    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api.post('/api/users').send(newUser).expect(400).expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb();
    assert(result.body.error.includes('expected `username` to be unique'))

    assert(usersAtStart.length, usersAtEnd.length)
  })

  test('creation fails if the username or password has less than 3 characters', async ()=> {
    const usersAtStart = await listHelper.usersInDb();
    const newUser = {username: 'as', name:'je', password:'li'}
    const result = await api.post('/api/users').send(newUser).expect(401).expect('Content-Type', /application\/json/)
    const usersAtEnd = await listHelper.usersInDb();
    assert(result.body.error.includes('username or password must be at least 3 characters long'))
    assert(usersAtStart.length, usersAtEnd.length)
  })
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('dummy  returns one', ()=> {
    const blogs = [];
    const result = listHelper.dummy(blogs);
    assert.strictEqual(result, 1);
})

describe('total likes', ()=>{
    const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]
     const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog', ()=>{
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5)
  })

  test('when list has 0 blogs', ()=>{
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  })

  test('when list has more than 1 blog', ()=>{
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 36)
  })

})

describe('favorite blog', ()=>{
    test('when there is multiple blogs', ()=>{
        const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]
        const result = listHelper.favoriteBlog(blogs);
        assert.deepStrictEqual(result, blogs[2])
    })

    test('when there is one blog', ()=>{
        const result = listHelper.favoriteBlog([]);
        assert.strictEqual(result, null);
    })
})

test("all blogs are returned", async ()=>{

const response =  await api.get(`/api/blogs`)
const blogsAtEnd = await listHelper.blogsInDb();
assert.strictEqual(response.body.length, blogsAtEnd.length)
})

test("unique identifier is id", async()=>{

const response = await api.get('/api/blogs');
response.body.forEach(blog => assert.ok(blog.id, `Blog con titulo "${blog.title}" no tiene propiedad id`));


})

test("a valid blog can be added", async () => {
  const newBlog = {
    title: 'titleeeeee',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 10
  }

  
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

 
  const blogsAtEnd = await listHelper.blogsInDb()
  
  
  assert.strictEqual(blogsAtEnd.length, listHelper.initialBlogs.length + 1)
})

test("a blog without likes can be added", async ()=>{
const newBlogWithoutLikes = {
  title: 'This blog has no likes property',
  author: 'Test Author',
  url: 'http://testurl.com',
}

const response = await api.post('/api/blogs').send(newBlogWithoutLikes).expect(201).expect('Content-Type', /application\/json/)

assert.strictEqual(response.body.likes, 0)

const blogsAtEnd = await listHelper.blogsInDb();
const addedBlog = blogsAtEnd.find(b => b.title === newBlogWithoutLikes.title);

assert.strictEqual(addedBlog.likes, 0)

})

test("blog without title and url is not added", async () => {
  const newBlogInvalid = {
    author: 'Test Author',
    likes: 5
   
  }

 
  await api
    .post('/api/blogs') 
    .send(newBlogInvalid)
    .expect(400)       

  
  const blogsAtEnd = await listHelper.blogsInDb()
  
 
  assert.strictEqual(blogsAtEnd.length, listHelper.initialBlogs.length)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await listHelper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await listHelper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, listHelper.initialBlogs.length - 1)

  const contents = blogsAtEnd.map(r => r.title)
  assert.ok(!contents.includes(blogToDelete.title))
})

test('a blog can be updated', async () => {
  const blogsAtStart = await listHelper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const changes = { likes: 20 }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(changes)
    .expect(200)

  const blogsAtEnd = await listHelper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  
  assert.strictEqual(updatedBlog.likes, 20)
})





