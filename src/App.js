import React, { useContext } from 'react'
import { Typography, AppBar, FormControl, Button, TextField, Container } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";

import VideoPlayer from './components/VideoPlayer';
import Notifications from './components/Notifications';
import Options from './components/Options';
import Texting from './components/Texting';

import {SocketContext} from './SocketContext';

import services from "./services/service"

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
	},
	appBar: {
		borderRadius: 15,
		margin: '30px 100px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '600px',
		border: '2px solid black',

		[theme.breakpoints.down('xs')]: {
			width: '90%',
		},
	},
	image: {
		marginLeft: '15px',
	},
	wrapper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		width: '100%',
	},
}));

const App = () => {
	const {myVideo} = useContext(SocketContext);
	const classes = useStyles();
	
	async function test () {
		var test1 = (
			await services.testAPI()
		).data
		console.log(test1)
	}

	return (
		<div className={classes.wrapper}>
			<AppBar className = {classes.appBar} position="static" color="inherit">
				<Typography variant="h2" align="center">
					Powered by webRTC
				</Typography>
			</AppBar>

			<VideoPlayer />
			
			<Options>
				<Notifications />
			</Options>
			<Button variant="contained" color="primary" onClick={test}>
				test
			</Button>
			{/* {callAccepted && (
					<Texting />
			)} */}
			{/* <FormControl>
					<TextField id="standard-basic" label="text" variant="outlined" />
					<Button type='submit' variant="contained" color="primary">Send</Button>
			</FormControl> */}
			
		</div>
	)
}


export default App;
