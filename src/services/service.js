const axios = require('axios');

// const api = axios.create({
// 	baseURL: 'http://localhost:5000',
// 	timeout: 1000,
// })
const api = axios.create({
	baseURL: 'https://facial-streaming-peer-to-peer.herokuapp.com/',
	timeout: 1000,
})

// async function getSignalId(userData) {
// 	console.log(userData)
// 		const res = api.get("/video/getUser", {params: {
// 			name: userData.name
// 		}})
// 		return res
// }

export default {
	userSignalIdSubmit(userData) {
		return api.post("/video/postUser", userData)
	},
	userSignaldUpdate(userData) {
		return api.put('/updateUser', userData)
	},
	getSignalId(userData) {
		console.log(userData)
		const res = api.get("/video/getUser", {params: {
			name: userData.name
		}})
		sessionStorage.setItem('otherName', userData.name)
		return res
	},
	userSessionSubmit(sessionData) {
		return api.post("/video/postSession", sessionData)
	},
	// getSignalId,
	
	testAPI() {
		return api.get('/video/test2',)
	}
}