import React, {useState} from "react";
import { useDispatch } from "react-redux";
import {Card, CardActions, CardContent, CardMedia, Button, Typography} from '@material-ui/core'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt'
import ThumbUpAltOutlined from "@material-ui/icons/ThumbUpAltOutlined";
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import moment from 'moment'
import {useHistory} from 'react-router-dom'
import useStyles from './styles'

import { deletePost, likePost } from "../../../actions/posts";

const Post = ({post, setCurrentId}) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const [likes, setLikes] = useState(post?.likes)

    const user = JSON.parse(localStorage.getItem('profile'))
    const userId = user?.result?.sub || user?.result?._id
    const hasLikedPost = post.likes.find((like) => like === userId)

    const handleLike = async () => {
        dispatch(likePost(post._id))

        if(hasLikedPost) {
            setLikes(post.likes.filter((id) => id !== userId))
        } else {
            setLikes([...post.likes, userId])
        }
    }

    const Likes = () => {
        if (likes.length > 0) {
          return likes.find((like) => like === userId)
            ? (
              <><ThumbUpAltIcon fontSize="small" />&nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} laugh${likes.length > 1 ? 's' : ''}` }</>
            ) : (
              <><ThumbUpAltOutlined fontSize="small" />&nbsp;{likes.length} {likes.length === 1 ? 'Laugh' : 'Laughs'}</>
            );
        }
    
        return <><ThumbUpAltOutlined fontSize="small" />&nbsp;Laugh</>;
      };

      const openPost = () => history.push(`/posts/${post._id}`)

    return (
        <Card className={classes.card} raised elevation={6}>
            <div className={classes.openpost} onClick={openPost}>
                <div style={{display: 'flex', justifyContent: 'space-around',  alignItems: 'center', marginBlock: '10px'}}>
                    <Typography variant="h6">{post.name}</Typography>
                    <Typography variant="body2">{moment(post.createAt).fromNow()}</Typography>
                </div>
                <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
                
                <div className={classes.details}>
                    <Typography variant='body2' color='textSecondary'>{post.tags.map((tag) => `#${tag} `)}</Typography>
                </div>
                <CardContent style={{display: 'flex', flexDirection: 'column',alignItems: 'center'}}>
                    <Typography className={classes.title} variant='h6' gutterBottom >{post.title}</Typography>
                </CardContent>
                </div>
                    <CardActions className={classes.cardActions}>
                <Button size="small" color='primary' disabled={!user?.result} onClick={handleLike} >
                    <Likes />
                </Button>
                {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && (
                    <div>
                    <Button 
                    color='primary'
                    size="small" 
                    onClick={() => setCurrentId(post._id)}>
                        <EditIcon fontSize="medium" />
                        Edit
                    </Button> 
                </div> )}
                {(user?.result?.sub === post?.creator || user?.result?._id === post?.creator) && (
                <Button size="small" color='secondary' onClick={() => dispatch(deletePost(post._id))} >
                    <DeleteIcon fontSize='small' />
                    Delete
                </Button>
                )}
            </CardActions> 
        </Card>
    )
}

export default Post