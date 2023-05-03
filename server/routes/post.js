import express from "express";

import {getPosts, getPost, getPostsBySearch, createPost, updatePost, deletePost, likePost, commentPost} from '../controllers/post.js'
import {auth} from '../middleware/auth.js'//use to give the user access to realize certain actions

const router = express.Router()

router.get('/', getPosts)
router.get('/search', getPostsBySearch)
router.get('/:id', getPost)
router.post('/', auth, createPost) 
router.patch('/:id',auth, updatePost)//done  in frontend
router.delete('/:id', auth, deletePost)//done in frontend
router.patch('/:id/likePost', auth, likePost)//done in backend
router.post('/:id/commentPost', auth, commentPost)

export default router