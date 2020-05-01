import React, { useState, useEffect } from 'react';
import { Link, Redirect, useHistory  } from "react-router-dom";
import { render } from 'react-dom';

import './screenHome.css';
import logo from './../public/icons/Logo.svg';

import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'; 
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

import HomeService from './../service/HomeService';

function Index() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState(false);
    const [errorPassword, setErrorPassword] = useState(false);
    const [messageEmail, setMessageEmail] = useState("");
    const [messagePassword, setMessagePassword] = useState("");
    
    const [open, setOpen] = React.useState(false);
    

    const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    }));

    const classes = useStyles();

    const login = async (e) => {
        let eEmail = false, ePassword = false;
        e.preventDefault();

        setMessageEmail("");
        setErrorEmail(false);
        setMessagePassword("");
        setErrorPassword(false);
        
        if(!email){
            eEmail = true;
            setErrorEmail(true);
            setMessageEmail("É obrigatorio preencher email")
        }
        else if((email+'').indexOf('@') == -1 ){
            eEmail = true;
            setErrorEmail(true);
            setMessageEmail("Formato de email invalido")
        }

        if(!password){
            ePassword = true;
            setErrorPassword(true);
            setMessagePassword("É obrigatorio preencher password")
        }
        else if( (password+'').length < 8 ){
            ePassword = true;
            setErrorPassword(true);
            setMessagePassword("No minimo 8 caracteres")
        }

        if(eEmail || ePassword){
            return null;
        }

        handleOpen()
        
        const result = await HomeService.login({ email, password });
        handleClose();

        if(result && result.error){
            if(result.error === `"email" must be a valid email`){
                setErrorEmail(true);
                setMessageEmail("Formato de email invalido")
            }
            else if(result.error === "Not found"){
                setErrorEmail(true);
                setMessageEmail("Email não existe")
            }
            else if(result.error === "Password Invalid or User not exists"){
                setErrorPassword(true);
                setMessagePassword("Senha Invalida")
            }

            return null;
        }

        let cargo;
            
        cargo = result && result.level_user === 1 ? "Mestre" : cargo;
        cargo = result && result.level_user === 2 ? "Administrador" : cargo;
        cargo = result && result.level_user === 3 ? "Atendente" : cargo;

        sessionStorage.setItem("user",JSON.stringify({
            nome:result.name_user,
            cargo:cargo,
        }) );

        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("level", result.level_user);

        history.push("/Menu");
        
    }

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const verificaSeEstaLogado = ()=>{
        if(sessionStorage.getItem("token"))
            history.push("/Menu");
    }

    verificaSeEstaLogado()

    return (
        <div id="container">

            <div id="content-logo">
                <img  src={logo} id='logo' alt="Bubble System Logo" />
            </div>

            <div id="content-form">
                <div id="container-forms">
                    <div id='titles'>
                        <h1>Bem vindo ao </h1>
                        <h1 style={{fontSize: '-webkit-xxx-large'}} id='title'>Bubble System</h1>
                    </div>
                    <form id="forms"  noValidate autoComplete="off">
                        
                        <TextField id="outlined-basic" error={errorEmail} label="Email" onChange={e => setEmail(e.target.value)} variant="outlined" helperText={messageEmail} />
                        
                        <TextField id="outlined-basic" error={errorPassword} label="Senha" onChange={e => setPassword(e.target.value)} type="password" helperText={messagePassword} variant="outlined"  />

                        <Button variant="contained" size='large' id='btn_login'  onClick={e => login(e)} > Entrar </Button>
                    </form>

                </div>
                
            </div>
            <Modal aria-labelledby="transition-modal-title" aria-describedby="transition-modal-description"
                    className={classes.modal} open={open} onClose={handleClose} closeAfterTransition BackdropComponent={Backdrop} BackdropProps={{ timeout: 500, }} >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <CircularProgress />
                        <label style={{marginTop:'20px'}}>Carregando</label>
                    </div>
                </Fade>
            </Modal>
        </div>
    );

}

export default Index;