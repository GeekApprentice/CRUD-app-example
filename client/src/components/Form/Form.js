import React, {useState, useEffect} from "react";
import { TextField, Typography, Paper, Button } from "@material-ui/core";
import FileBase from 'react-file-base64'
import { useDispatch, useSelector } from "react-redux";
import {useHistory} from 'react-router-dom'
import useStyles from './styles'
import { createPost, updatePost } from "../../actions/posts";

//get the current id

const Form = ({currentId, setCurrentId}) => {
    const [postData, setPostData] = useState({
        name: '',
        title: '',
        message: '',
        tags: '',
        selectedFile: ''
    })
    const history = useHistory()
    const post = useSelector((state) => currentId ? state.posts.posts.find((p) => p._id === currentId) : null)

    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('profile'))

    useEffect(() => {
        if(post) setPostData(post)
    }, [post])

    const handleSubmit = (e) => {
        e.preventDefault()

        if(currentId) {
            dispatch(updatePost(currentId, {...postData, name: user?.result?.name }))//specify the user name
        } else {
            dispatch(createPost({...postData, name: user?.result?.name}, history))
        } 

        clear()  
    }
    
    const clear = () => {
        setCurrentId(null)
        setPostData({
            name: '',
            title: '',
            message: '',
            tags: '',
            selectedFile: ''
        })
    }

    const classes = useStyles()

    if(!user?.result?.name) {
        return (
            <Paper style={{height: '100px'}}>
                <Typography style={{textAlign: 'center', fontSize: '1.5rem'}}>
                    Sign in to post your favorite meme
                </Typography>
            </Paper>
        )
    }

    
    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{currentId ? 'Edit' : 'Upload'} your Meme</Typography>
                <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={({target}) => setPostData({...postData, title: target.value})}  />  
                <TextField name="message" variant="outlined" label="Description" fullWidth value={postData.message} onChange={({target}) => setPostData({...postData, message: target.value})}  />
                <TextField name="tags" variant="outlined" label="Tags" fullWidth value={postData.tags} onChange={({target}) => setPostData({...postData, tags: target.value.split(',')})}  /> 
                <div className={classes.fileInput}>
                    <FileBase 
                        type='files'
                        multiple={false}
                        onDone={({base64}) => setPostData({...postData, selectedFile: base64})}
                    />
                    <Button className={classes.buttonSubmit} variant='contained' color='primary' size='large' type="submit" fullWidth>Submit</Button>
                    <Button variant='contained' color='secondary' size='small' onClick={clear} fullWidth>Clear</Button>
                </div>
            </form>
        </Paper>
    )
}

export default Form