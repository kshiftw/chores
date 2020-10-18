const functions = require('firebase-functions');
const app = require('express')();
const auth = require('./util/auth');

const {
	getMyChores,
	getPendingChores,
	getOneChore,
	postOneChore,
	deleteChore,
	editChore,
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
app.get('/chore/:choreId', auth, getOneChore);
app.post('/chore', auth, postOneChore);
app.delete('/chore/:choreId', auth, deleteChore);
app.put('/chore/:choreId', auth, editChore);

app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);

exports.api = functions.https.onRequest(app);
