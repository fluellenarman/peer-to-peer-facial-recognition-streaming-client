// import * as faceapi from "face-api.js";
// import React, { useContext, useEffect } from 'react'

// import { SocketContext } from "../SocketContext";

// console.log('defer')

// const VideoHelper = () => {
// 	const { myVideo, userVideo } = useContext(SocketContext);
// 	Promise.all([
// 		faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
// 		faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
// 		faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
// 		faceapi.nets.faceExpressionNet.loadFromUri('/models')
// 	]).then(console.log('here'))

// 	const video = document.getElementById('video')
// 	console.log(myVideo.current)
// 	video.addEventListener('play', () => {
// 		console.log(1111)
// 		const canvas = faceapi.createCanvasFromMedia(video)
// 		document.body.append(canvas)
// 		const displaySize = {width: 720, height: 560}
// 		faceapi.matchDimensions(canvas, {width: 720, height: 560})
// 		setInterval(async () => {
// 			const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
// 			console.log(detections);
// 			const resizedDetections = faceapi.resizeResults(detections, {width: 720, height: 560})
// 			canvas.getContext('2d').clearRect(0, 0, 720, 560)
// 			// faceapi.draw.drawDetections(canvas, resizedDetections)
// 			faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
// 			// faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
// 		}, 100 )
// 	})

// }

// function test() {
// 	VideoHelper()
// }
// test()

// export default VideoHelper