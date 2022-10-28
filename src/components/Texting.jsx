import React, { useContext, useState  } from 'react'
import {FormControl, Button, TextField, Container } from '@material-ui/core';

import {SocketContext} from '../SocketContext';
// import {exportP} from './DataPort.js'
// import { callbackify } from 'util';

const Texting = () => {
  const {receiveText, sendText, call, callAccepted, peerObj} = useContext(SocketContext);
	const [value, setValue] = useState('');


	function texting() {
		console.log(value)
		console.log(peerObj.current.connected)
		sendText(value);

		// receiveText();
	}
	console.log(sessionStorage.getItem('id'));
	// console.log(peerObj.current.connected)
	// peerObj.current.on('data', data => {
	// 	console.log(data)
	// })
	return (
		<>
			{callAccepted && (
				<FormControl>
					<TextField id="standard-basic" value={value} label="text" 
					variant="outlined" 
					onChange={(e) => {setValue(e.target.value);}}
					/>
					<Button type='submit' variant="contained" color="primary"
					onClick={texting}
					>Send</Button>
				</FormControl>
			)}
		</>
	)
}

export default Texting