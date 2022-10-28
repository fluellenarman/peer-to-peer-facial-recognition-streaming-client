import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
// import { setMaxListeners } from 'events';

const SocketHelper = createContext();

// const socket = io("http://localhost:5000");
const socket = io("https://facial-streaming-peer-to-peer.herokuapp.com/:5000");

const ContextProvider2 = ({ children }) => {
    
	const [me, setMe] = useState('');

	const [call, setCall] = useState({});
	const [connectionAccepted, setConnectionAccepted] = useState(false)
	const [callEnded, setCallEnded] = useState(false);
	const [name, setName] = useState('')

	const connectionRef = useRef();

	// var peer1 = new Peer({initiator: true, trickle: false})
	var peer1;
	const peer2 = new Peer({initiator: false, trickle: false})

	useEffect(() => {
		socket.on('me2', (id) => setMe(id));

		socket.on('calluser2', ( {from, name: callerName, signal }) => {
			console.log(33333);
			setCall({ isReceivedCall: true, from, name: callerName, signal })
		
	})
}, []);

	const peerConnect = () => {
		peer1 = new Peer({initiator: true, trickle: false})
		console.log(2222222);
		peer1.on('signal', (data) => {
			var id = sessionStorage.getItem('id');
			console.log('flag');
			console.log(id)
			socket.emit('calluser2', {userToCall: sessionStorage.getItem('id'), signalData: data, from: me, name })
		})

		socket.on('connectionAccepted', (signal) => {
			setConnectionAccepted(true);

			peer1.signal(signal);
		});

		connectionRef.current = peer1;
	}

	const acceptConnect = () => {
		setConnectionAccepted(true)
		
		peer2.on("signal", (data) => {
				socket.emit('answercall2', {signal: data, to: call.from });
		});

		console.log(peer2.connected);

		peer2.signal(call.signal);
		connectionRef.current = peer2;
	}

	const testing = () => {
		console.log(111111);
	}
    

    return(
        <SocketHelper.Provider value={{
				testing,
				peerConnect
        }}>
            {children}
        </SocketHelper.Provider>
    )
}

export {ContextProvider2, SocketHelper}