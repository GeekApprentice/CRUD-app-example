import React, {useState} from 'react'
import jwtDecode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import {useHistory} from 'react-router-dom'
import {Container, Typography, Paper, Grid, Avatar, Button} from '@material-ui/core'
import {GoogleLogin} from '@react-oauth/google'
import VpnKey from '@material-ui/icons/VpnKey'
import Input from './Input'
import {signin, signup} from '../../actions/auth'

import useStyles from './styles'


const initialState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
}


const Auth = () => {
    const [showPasword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(initialState)
    const classes = useStyles()
    const [isSignUp, setIsSignUp] = useState(false)
    const dispatch = useDispatch()
    const history = useHistory()

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)//toggle password visibility

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if(isSignUp) {
            dispatch(signup(formData, history))
        } else {
            dispatch(signin(formData, history))
        }
    }

    //handle onChange of all inputs base on their name
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }


    const googleSucess = async (res) => {
        const result = jwtDecode(res?.credential)
        const token = await res?.credential
        //console.log(token);
        try {
            dispatch({type: 'AUTH', data: {result, token }})
            history.push('/')
        } catch (error) {
            console.log(error);
        }
    }

    const googleFailure = (error) => {
        console.log(error);
    }

    const switchMode = () => {
        setIsSignUp((prevIsSignUp) => !prevIsSignUp)//toggle sign in/sign up form
        setShowPassword(false)
    }

  return (
    <Container component='main' maxWidth="xs">
        <Paper className={classes.paper} elevation={3}>
            <Avatar className={classes.avatar}>
                <VpnKey />
            </Avatar>
            <Typography variant='h6'>{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
            <form className={classes.form} onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {
                        isSignUp && (
                            <>
                            <Input name='firstName' label="First Name" handleChange={handleChange} autoFocus half />
                            <Input name='lastName' label="Last Name" handleChange={handleChange} half />
                            </>
                        )
                    } 
                    <Input name='email' label='Email Adress' handleChange={handleChange} type='email' />  
                    <Input name='password' label='Password' handleChange={handleChange} type={showPasword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                    {isSignUp && <Input name='confirmPassword' label='Repeat Password' type='password' handleChange={handleChange} />}  
                </Grid>
                <Button type='submit' fullWidth variant='contained' color={isSignUp ? 'secondary' : 'primary'} className={classes.submit}>
                    {isSignUp ? 'Sign Up' : 'Sign in'}
                </Button>
                <GoogleLogin 
                    onSuccess={googleSucess}
                    onError={googleFailure}
                />
                <Grid container justifyContent='flex-end'>
                    <Grid item>
                        <Button onClick={switchMode}>
                           {isSignUp ? " Already have an account?" : "Don't have an account?" }
                           <span style={{color: 'blue', marginLeft: 2}}>
                           {isSignUp ? "Sing in " : "Sign Up" }
                           </span>
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </Container>
  )
}

export default Auth