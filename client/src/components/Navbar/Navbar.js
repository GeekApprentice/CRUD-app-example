import React, {useState, useEffect} from 'react'
import {useDispatch} from 'react-redux'
import {useHistory, useLocation, Link} from 'react-router-dom'
import decode from 'jwt-decode'
import {AppBar, Button, Toolbar, Typography, Avatar} from '@material-ui/core'

import useStyles from './styles'
import memories from '../../images/laughing.webp'

const Navbar = () => {
    const classes= useStyles()
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))//getting the user from localstorage
    //console.log(user);
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()

    const logout = () => {
        dispatch({type: 'LOGOUT'})

        history.push('/')

        setUser(null)
    }
    

    useEffect(() => {
        const token = user?.token
        if(token) {
            const decodedToken = decode(token)

            if(decodedToken.exp * 1000 < new Date().getTime()) logout();//logout the user when token expires
        }
        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location])

   


    return (
        <AppBar className={classes.appBar} position='static' color='inherit'>
            <Toolbar >
                <div className={classes.brandContainer}>
                    <Typography component={Link} to='/' className={classes.heading} variant='h2' align='center'>Let's Laugh</Typography>
                    <img className={classes.image} src={memories} alt="mouth laughing" height='60' width='60' style={{marginLeft:'10px'}} /> 
                </div>   
            </Toolbar>
            <Toolbar >
                {user ? (
                    <div className={classes.toolbar}>
                        <Avatar className={classes.purple} src={user.result?.picture} alt={user.result?.name}>{user.result?.name.charAt(0)}</Avatar>
                        <Typography variant='h6'>{user.result?.name}</Typography>
                        <Button variant='contained' className={classes.logout} color='secondary' onClick={logout}>Logout</Button>
                    </div>
                ) : (
                    <Button variant='contained' component={Link} to='/auth' color='primary'>Sign in</Button>
                )} 
            </Toolbar>   
        </AppBar>
    )
}

export default Navbar