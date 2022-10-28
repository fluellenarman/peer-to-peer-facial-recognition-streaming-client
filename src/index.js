import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import './styles.css';

import { ContextProvider } from "./SocketContext";
// import {ContextProvider2 } from "./socketHelper";

ReactDOM.render(
	<ContextProvider>
		{/* <ContextProvider2> */}
		<App />
		{/* </ContextProvider2> */}
	</ContextProvider>
, 

document.getElementById('root'));