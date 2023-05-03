import React, {useEffect, useState, useRef} from 'react'
import { Typography, TextField, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import {commentPost} from '../../actions/posts'

import useStyles from './styles'

const CommentSection = ({post}) => {
    const classes = useStyles()
    const [comments, setComments] = useState(post?.comments)
    const [comment, setComment] = useState('')
    const user = JSON.parse(localStorage.getItem('profile'))
    const dispatch = useDispatch()
    const commentsRef = useRef()

    const handleClick = async () => {
        const finalComment = `${user.result.name}: ${comment}`
        const newComment = dispatch(commentPost(finalComment, post._id))
        setComments(newComment)
        setComment('')

        commentsRef.current.scrollIntoView({behavior: 'smooth'})
    }

  return (
    <div>
        <div className={classes.commentOuterContainer}>
            <div className={classes.commentsInnerContainer}>
                <Typography gutterBottom variant='h6'> {post?.comments.lenght > 0 ? 'Comments' : 'No comments yet'}</Typography>
                {comments.map((c, i) => (
                    <Typography key={i} gutterBottom variant='subtitle1'>
                        <strong>{c.split(':')[0]}:</strong>
                        {c.split(': ')[1]}
                    </Typography>
                ))}
                <div ref={commentsRef} />
            </div>
            {user?.result?.name && (
            <div style={{width: '70%'}}>
                <Typography gutterBottom variant='h6'>Write a comment</Typography>
                <TextField 
                fullWidth
                maxRows={4}
                variant='outlined'
                label='Comment'
                multiline
                value={comment}
                onChange={({target}) => setComment(target.value)}
                />
            <Button style={{marginTop: '10px'}} children='Comment' color='primary' fullWidth disabled={!comment} variant='contained' onClick={handleClick}>
            </Button>
            </div>
            )}
        </div>
    </div>
  )
}

export default CommentSection