const Blog = require("../models/blog")
const User = require("../models/user")

const dummy = (blogs)=> {
    return 1
}

const totalLikes = (blogs)=> {
    return blogs.reduce((sum, blog)=> sum + blog.likes, 0)

}

const favoriteBlog = (blogs)=> {
    if(blogs.length === 0) return null;
    return blogs.reduce((prev, cur) => {
        return (prev.likes > cur.likes ? prev : cur)
    })
}


const initialBlogs = [
  {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        id: "69715b3125798453414b85e3"
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        id: "69715b744da5e1156192756b"
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        id: "69715ba94da5e1156192756d"
    }
]

const blogsInDb = async () =>{
    const  blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async ()=> {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}
module.exports = { dummy, totalLikes, favoriteBlog, initialBlogs, blogsInDb, usersInDb}