import React, { useContext, useEffect, useRef } from 'react'
import {Grid, Typography, Paper, Button } from "@material-ui/core";
import {makeStyles } from "@material-ui/core/styles";

import { SocketContext } from "../SocketContext";

import * as faceapi from "face-api.js";

// window.onload = (event) => {
//     Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//         faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//         faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//         faceapi.nets.faceExpressionNet.loadFromUri('/models')
// ])
// }


// console.log(faceapi.nets)



const useStyles = makeStyles((theme) => ({
    video: {
      width: '550px',
      [theme.breakpoints.down('xs')]: {
        width: '300px',
      },
    },
    gridContainer: {
      justifyContent: 'center',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    paper: {
      padding: '10px',
      border: '2px solid black',
      margin: '10px',
    },
    
  }));

const VideoPlayer = () => {
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);
    const classes = useStyles();
    const canvasRef = useRef();
    const canvasRef2 = useRef();
    // console.log(call);
    // const [initializing, setInitializing] = useState(false)
    // console.log(stream.active)
    
    useEffect(() => {
        const loadModels = () => {
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
                faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
                faceapi.nets.faceExpressionNet.loadFromUri('/models')
            ])
            .then()
            .catch(e=>console.log(e))
        };
        
        myVideo.current && loadModels();
    })
    var expression1obj = {
        angry: 0,
        disgusted: 0,
        fearful: 0,
        happy: 0,
        neutral: 0,
        sad: 0,
        surprised: 0,
    }
    var test = () => {
        setInterval(async() => {
            var video = document.getElementById('video')
            canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(video)
            canvasRef.current.style.right = myVideo.current.getBoundingClientRect().right+'px'
            canvasRef.current.style.left = myVideo.current.getBoundingClientRect().left+'px'
            // canvasRef.current.style.top = myVideo.current.getBoundingClientRect().top+'px'
            // canvasRef.current.style.bottom = myVideo.current.getBoundingClientRect().bottom+'px'
            const displaySize = {
                width: 720, height: 560
            }
            faceapi.matchDimensions(canvasRef.current, {width: 720, height: 560})
            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            const resizedDetections = faceapi.resizeResults(detections, {width: 720, height: 560})
            canvasRef.current.getContext('2d').clearRect(0, 0, 720, 560)
            faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections)
            if (detections.length > 0) {
                // console.log(detections[0].expressions);
                expression1obj.angry += detections[0].expressions.angry
                expression1obj.disgusted += detections[0].expressions.disgusted
                expression1obj.fearful += detections[0].expressions.fearful
                expression1obj.happy += detections[0].expressions.happy
                expression1obj.neutral += detections[0].expressions.neutral
                expression1obj.sad += detections[0].expressions.sad
                expression1obj.surprised += detections[0].expressions.surprised
                console.log(expression1obj)
                sessionStorage.setItem('myExpression', expression1obj)
            }
        }, 100)
        
    }

    var test2 = () => {
        setInterval(async() => {
            var video2 = document.getElementById('video2')
	        // console.log(video2)
            canvasRef2.current.innerHTML = faceapi.createCanvasFromMedia(video2)
            canvasRef2.current.style.right = userVideo.current.getBoundingClientRect().right+'px'
            canvasRef2.current.style.left = userVideo.current.getBoundingClientRect().left+'px'
            const displaySize = {
                width: 720, height: 560
            }
            faceapi.matchDimensions(canvasRef2.current, {width: 720, height: 560})
            const detections = await faceapi.detectAllFaces(video2, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
            const resizedDetections = faceapi.resizeResults(detections, {width: 720, height: 560})
            canvasRef2.current.getContext('2d').clearRect(0, 0, 720, 560)
            faceapi.draw.drawDetections(canvasRef2.current, resizedDetections)
            faceapi.draw.drawFaceLandmarks(canvasRef2.current, resizedDetections)
            faceapi.draw.drawFaceExpressions(canvasRef2.current, resizedDetections)
            console.log(detections)
        }, 50)
        
    }

    const video = document.createElement("VIDEO")
    // console.log(myVideo.current)
    console.log(video)

    video.addEventListener('play', () => {
        setInterval(async () => {
            console.log(111);
        }, 100)
    })


    
    return (
        <Grid container className={classes.gridContainer}>
        { stream && (
            <Paper className={classes.paper}>
                <Grid item xs = {12} md = {6}>
                    <Typography variant="h5" gutterBottom>
                        {name || ''}
                    </Typography>
                    <div className="display-flex justify-content-center">
                    <video id='video' playsInline muted ref={myVideo} 
                        autoPlay
                        width="720" height="560" 
                    />
                    <canvas ref={canvasRef} className="position-absolute"/>
                    </div>
                    <Button onClick={test} variant="contained" color="primary" fullWidth></Button>
                </Grid>
            </Paper>
        )}
            
        { callAccepted && !callEnded && (
            <Paper className={classes.paper}>
                <Grid item xs = {12} md = {6}>
                    <Typography variant="h5" gutterBottom>
                        {call.name || ''}
                    </Typography>
                    <video id='video2' playsInline ref={userVideo} 
                    autoPlay
                    width="720" height="560"
                    />
                    <canvas ref={canvasRef2} className="position-absolute"/>
                    <Button onClick={test2} variant="contained" color="primary" fullWidth></Button>
                </Grid>
            </Paper>
        )}
            
        </Grid>
    )
}

export default VideoPlayer