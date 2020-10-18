const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth');

const {
	getMyChores,
	getPendingChores,
	getAcceptedChores,
	getOneChore,
	postOneChore,
	deleteChore,
	editChore,
	acceptChore,
	completeChore,
} = require('./APIs/chores');

const {
	loginUser,
	signUpUser,
	uploadProfilePhoto,
	getUserDetail,
	updateUserDetails,
} = require('./APIs/users');

app.get('/chores', auth, getMyChores);
app.get('/pending_chores', auth, getPendingChores);
app.get('/accepted_chores', auth, getAcceptedChores);
app.get('/chore/:choreId', auth, getOneChore);
app.post('/chore', auth, postOneChore);
app.delete('/chore/:choreId', auth, deleteChore);
app.put('/chore/:choreId', auth, editChore);
app.put('/accept_chore/:choreId', auth, acceptChore);
app.put('/complete_chore/:choreId', auth, completeChore);

app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
