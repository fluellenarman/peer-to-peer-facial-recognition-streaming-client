import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
// import { setMaxListeners } from 'events';
import * as faceapi from "face-api.js";
import { v4 as uuidv4 } from 'uuid';

import service from "./services/service";

const SocketContext = createContext();

// const socket = io("http://localhost:5000");
const socket = io("https://facial-streaming-peer-to-peer.herokuapp.com/:5000");

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState();
    const [me, setMe] = useState('');

    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('')

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;
    console.log(today)
    

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
            setStream(currentStream);
            
            myVideo.current.srcObject = currentStream;
        })

        socket.on('me', (id) => setMe(id));

        socket.on('calluser', ( {from, name: callerName, signal }) => {
            
            setCall({ isReceivedCall: true, from, name: callerName, signal })
        })
        console.log(222);
        socket.on('getUid', (uid) => {
            console.log(uid);
            sessionStorage.setItem('sessionUid', uid);
        })
}, []);


    var peer 
    var peer2 = new Peer({ initiator: false , trickle: false, stream });
    
    const answerCall = () => {
        setCallAccepted(true)
        sessionStorage.setItem('userType', 'called')

        // peer2 = new Peer({ initiator: false , trickle: false, stream });
        
        peer2.on("signal", (data) => {
            socket.emit('answercall', {signal: data, to: call.from });
            console.log(call.from)
            console.log(data);
        });

        peer2.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        })

        console.log(peer2.connected);

        peer2.signal(call.signal);
        connectionRef.current = peer2;
    }

    const callUser = (id) => {
        peer = new Peer({initiator: true, trickle: false, stream })

        peer.on('signal', (data) => {
            socket.emit('calluser', {userToCall: id, signalData: data, from: me, name});
            console.log(id);
            console.log(name);
            const uid = uuidv4();
            console.log(uid);
            sessionStorage.setItem('sessionUid', uid);
            socket.emit('getUid', {userToCall: id, payload: uid})
        });
        console.log(id)

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        })

        socket.on('callaccepted', (signal) => {
            setCallAccepted(true);
            sessionStorage.setItem('userType', 'caller')
            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    async function sendUserSession() {
        try {
            await service.userSessionSubmit({
                uuid: sessionStorage.getItem('sessionUid'),
                time: (sessionStorage.getItem('t1') - sessionStorage.getItem('t0')) / 1000,
                user1Name: sessionStorage.getItem('myName'),
                user2Name: sessionStorage.getItem('otherName'),
                user1Expression: "TEST",
                user2Expression: "TEST",
                user1Signal_id: sessionStorage.getItem('mySignalId'),
                user2Signal_id: sessionStorage.getItem('otherSignalId'),

            });
        } catch (error) {
            error = error.response.data.error;
        }
    }

    const leaveCall = () => {
        sessionStorage.setItem('t1', new Date().getTime());
        alert((sessionStorage.getItem('t1') - sessionStorage.getItem('t0')) / 1000);
        setCallEnded(true);

        sendUserSession();

        connectionRef.current.destroy();
        console.log(sessionStorage.getItem('userType'));
        // window.location.reload();
    }

    //Below is sending text now
    const sendText = (data) => {
        console.log(connectionRef.current.connected)
        console.log(connectionRef.current)
        connectionRef.current.send(data);
    }

    const peerObj = connectionRef
    // if (callAccepted == true) {
    //     connectionRef.current.on('data', data => {
    //         console.log(data);
    //     })
    // }
    const receiveText = () => {
        connectionRef.current.on('data', data => {
            console.log(data);
        })
    }

    // socket.on('chat-message', data => {
    //     console.log(data)
    //     console.log('remember to delete me!');
    // })

    return(
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall,
            sendText,
            receiveText,
            peerObj
        }}
        connectionRef={connectionRef}
        >
            {children}
        </SocketContext.Provider>
    )
}

export {ContextProvider, SocketContext}