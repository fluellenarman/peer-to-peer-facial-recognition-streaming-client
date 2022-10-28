import React, { useContext, useState  } from 'react'
import {Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled} from '@material-ui/icons';

import {SocketContext } from "../SocketContext";

import service from "../services/service";

// import { SocketHelper } from "../socketHelper";

const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    gridContainer: {
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    container: {
      width: '600px',
      margin: '35px 0',
      padding: 0,
      [theme.breakpoints.down('xs')]: {
        width: '80%',
      },
    },
    margin: {
      marginTop: 20,
    },
    padding: {
      padding: 20,
    },
    paper: {
      padding: '10px 20px',
      border: '2px solid black',
    },
   }));

const Options = ( {children} ) => {
    const {me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('');
    const classes = useStyles();

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    console.log(today)

    // const {peerConnect} = useContext(SocketHelper);

    async function double() {
		sessionStorage.setItem('t0', new Date().getTime());
        console.log(idToCall);
		let signalId = ""
		try {
			const nameToCall = idToCall;
			console.log(nameToCall);
			signalId = await service.getSignalId({
				name: nameToCall,
				signalId: me,
			});
			console.log(signalId.data);
            sessionStorage.setItem('otherSignalId', signalId.data)
        } catch(error) {
			error = error.response.data.error;
		}
        callUser(signalId.data)
        // peerConnect()
    }

    async function sendId () {
        console.log(111)
        console.log(me)
        console.log(name)
		sessionStorage.setItem('myName', name);
		sessionStorage.setItem('mySignalId', me);
        try {
            await service.userSignalIdSubmit({
                name: name,
                signalId: me,
            });
        } catch (error) {
            error = error.response.data.error;
        }
    }

    return (
        <Container className = {classes.container}>
            <Paper elevation={10} className={classes.paper}>
                <form className={classes.root} noValidate autoComplete="off">
                    <Grid container className={classes.gridContainer}>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant='h6'>
                                Account Info
                            </Typography>
                            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
                            {console.log(me)}
                            <CopyToClipboard className={classes.margin}>
                                <Button onClick={sendId} variant="contained" color="primary" fullWidth>
                                    Set Id and Name
                                </Button>
                            </CopyToClipboard>
                        </Grid>

                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant='h6'>
                                Make a call
                            </Typography>
                            <TextField label="Name to Call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
                            {callAccepted && !callEnded ? (
                                <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize='large' />}
                                fullWidth
                                onClick={leaveCall}
                                className={classes.margin}
                                >
                                    Hang Up
                                </Button>
                            ) : (
                                <Button variant="contained" color="primary" startIcon={<Phone fontSize='large' />}
                                fullWidth
                                onClick={double}
                                className={classes.margin}>
                                    Call
                                </Button>
                            )}
                        </Grid>
                    </Grid> 
                </form>
                { children }
            </Paper>
        </Container>
    )
}

export default Options