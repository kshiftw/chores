const { db } = require('../util/admin');

exports.getAllChores = (request, response) => {
	db.collection('chores')
		.where('username', '==', request.user.username)
		.orderBy('createdAt', 'desc')
		.get()
		.then((data) => {
			let chores = [];
			data.forEach((doc) => {
				chores.push({
					choreId: doc.id,
					title: doc.data().title,
					username: doc.data().username,
					body: doc.data().body,
					createdAt: doc.data().createdAt,
				});
			});
			return response.json(chores);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: err.code });
		});
};

exports.getOneChore = (request, response) => {
	db.doc(`/chores/${request.params.choreId}`)
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return response.status(404).json({
					error: 'Chore not found',
				});
			}
			if (doc.data().username !== request.user.username) {
				return response.status(403).json({ error: 'UnAuthorized' });
			}
			ChoreData = doc.data();
			ChoreData.choreId = doc.id;
			return response.json(ChoreData);
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({ error: error.code });
		});
};

exports.postOneChore = (request, response) => {
	if (request.body.body.trim() === '') {
		return response.status(400).json({ body: 'Must not be empty' });
	}

	if (request.body.title.trim() === '') {
		return response.status(400).json({ title: 'Must not be empty' });
	}

	const newChoreItem = {
		title: request.body.title,
		username: request.user.username,
		body: request.body.body,
		createdAt: new Date().toISOString(),
	};

	db.collection('chores')
		.add(newChoreItem)
		.then((doc) => {
			const responseChoreItem = newChoreItem;
			responseChoreItem.id = doc.id;
			return response.json(responseChoreItem);
		})
		.catch((error) => {
			console.error(error);
			response.status(500).json({ error: 'Something went wrong' });
		});
};

exports.deleteChore = (request, response) => {
	const document = db.doc(`/chores/${request.params.choreId}`);
	document
		.get()
		.then((doc) => {
			if (!doc.exists) {
				return response.status(404).json({
					error: 'Chore not found',
				});
			}
			if (doc.data().username !== request.user.username) {
				return response.status(403).json({ error: 'Unauthorized' });
			}
			return document.delete();
		})
		.then(() => {
			response.json({ message: 'Delete successful' });
		})
		.catch((err) => {
			console.error(err);
			return response.status(500).json({
				error: err.code,
			});
		});
};

exports.editChore = (request, response) => {
	if (request.body.choreId || request.body.createdAt) {
		response.status(403).json({ message: 'Not allowed to edit' });
	}
	let document = db.collection('chores').doc(`${request.params.choreId}`);
	document
		.update(request.body)
		.then((doc) => {
			response.json({ message: 'Updated successfully' });
		})
		.catch((error) => {
			if (error.code === 5) {
				response.status(404).json({ message: 'Not Found' });
			}
			console.error(error);
			return response.status(500).json({
				error: error.code,
			});
		});
};
