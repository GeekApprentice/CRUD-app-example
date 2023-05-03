import mongoose from 'mongoose'
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
    const {page} = req.query

    try {
        const LIMIT = 8;//items limit by page
        const startIndex = (Number(page) - 1) * LIMIT//get the starting index of every page
        const total = await PostMessage.countDocuments({})
        const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex)//using sort(_id: -1) you get the newest post first
        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)})
    } catch (error) {
        res.status(404).json({message: error.message})  
    }
}

export const getPost = async (req, res) => {
    const {id} = req.params

    try {
        const post = await PostMessage.findById(id)
        res.status(200).json(post)
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const getPostsBySearch = async (req, res) => {
    const {searchQuery, tags} = req.query
    try {
        const title = new RegExp(searchQuery, 'i')//with i, it makes the query no case sensitive, TEST, Test and test are the same
        //use $or:[] to find either the title or the tags of the post
        const posts = await PostMessage.find({ $or: [{title}, {tags: {$in: tags.split(',')}}] })
        res.json({data: posts})
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const createPost = async (req, res) => {
    const post = req.body

    const newPost = new PostMessage({...post, creator: req.userId})//set the creator of the post with req.userId

    try {
        await newPost.save()
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({message: error.message})
    }
}

export const updatePost = async (req, res) => {
    const {id: _id} = req.params;
    const post = req.body

    if(!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send('No post with that id')
    }

    const updatePost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true})
    res.json(updatePost)
}

export const deletePost = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No post with that id')
    }

    await PostMessage.findByIdAndRemove(id)

    res.json({message: 'Post deleted sucessfully'})
}

export const likePost = async (req, res) => {
    const {id} = req.params

    //return error if user in not authenticated
    if(!req.userId) return res.status(400).json({message: 'Unauthenticated'})


    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send('No post with that id')
    }

    const post = await PostMessage.findById(id)

    const index = post.likes.findIndex((id) => id === String(req.userId))

    if(index === -1) {
        post.likes.push(req.userId)//like the post
    } else {
         post.likes = post.likes.filter((id) => id !== String(req.userId))//dislike the post
    }

    const updatePost = await PostMessage.findByIdAndUpdate(id, post, {new: true})

    res.json(updatePost)
}

export const commentPost = async (req, res) => {
    const {id} = req.params
    const {value} = req.body

    const post = await PostMessage.findById(id)//getting the post from the database

    post.comments.push(value)//pushing the comment to the post

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true})//store the new value to the database

    res.json(updatedPost)
}