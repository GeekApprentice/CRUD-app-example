import React, {useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import {Container, Grid, Grow, Paper, AppBar, TextField, Button} from '@material-ui/core'
import {useHistory, useLocation} from 'react-router-dom'
import ChipInput from 'material-ui-chip-input'//to manage tags

import Pagination from '../Pagination'
import Posts from '../Posts/Posts'
import Form from '../Form/Form'


import { getPosts, getPostBySearch } from '../../actions/posts'

import useStyles from './styles'


//creating useQuery function to use it as a hook with useLocation
const useQuery = () => {
    return new URLSearchParams(useLocation().search)
}

const Home = () => {
    const [currentId, setCurrentId] = useState(null)
    const [search, setSearch] = useState('')
    const [tags, setTags] = useState([])
    const classes = useStyles()
    const dispatch = useDispatch()
    const query = useQuery()
    const history = useHistory()//to navigate to different locations
    const page = query.get('page') || 1;
    //const searchQuery = query.get('searchQuery')

    /*useEffect(() => {
        dispatch(getPosts())
    }, [currentId, dispatch])*/

   

    const handleChipAdd = (tag) => setTags([...tags, tag]) //add a tag

    const handleChipDel = (tagToDelete) => setTags(tags.filter((tag) =>  tag !== tagToDelete))//delete a tag

    const searchPost = () => {
        if(search.trim() || tags) {
            dispatch(getPostBySearch({search, tags: tags.join(',')}))//tags.join because tags are inside an array
            history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`)//change the url to the specific query title and tags
        } else {
            history.push('/')//go back to posts if no search term matches
        }
    }

    const handleEnterPress = (e) => {
        if(e.keyCode === 13) {
            searchPost();
        }
    }

  return (
      <Grow in>
          <Container maxWidth='xl'>
              <Grid container justifyContent='space-between' spacing={3} className={classes.gridContainer}>
                  <Grid item xs={12} sm={6} md={9}>
                      <Posts setCurrentId={setCurrentId} />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3} >
                    <AppBar position='static' color='inherit' className={classes.appBarSearch}>
                        <TextField
                         name='search'
                         variant='outlined'
                         label='Search meme'
                         onKeyDown={handleEnterPress}
                         fullWidth
                         value={search}
                         onChange={({target}) => setSearch(target.value)}
                        />
                        <ChipInput 
                        style={{margin: '10px 0'}}
                        value={tags}
                        onAdd={handleChipAdd}
                        onDelete={handleChipDel}
                        label='Search by tag'
                        variant='outlined'
                        />
                        <Button onClick={searchPost} color='primary' variant='contained' children='Search'></Button>
                    </AppBar>
                      <Form currentId={currentId} setCurrentId={setCurrentId} />
                      <Paper elevation={6}>
                      <Pagination page={page}/>
                      </Paper>
                  </Grid>
              </Grid>
          </Container>
      </Grow>
  )
}

export default Home