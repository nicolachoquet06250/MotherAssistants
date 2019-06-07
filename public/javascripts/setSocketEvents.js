function setSocketEvents(socket, actived) {
	if(actived) socket.on('parent_messages',
		(json, user) => console.log(json),
		(err, user) => console.error(err, 'error'))
		.on('family_messages',
			(json, user) => console.log(json),
			(err, user) => console.error(err, 'error'))
		.on('parent_medias',
			(json, user) => console.log(json),
			(err, user) => console.error(err, 'error'))
		.on('family_medias',
			(json, user) => console.log(json),
			(err, user) => console.error(err, 'error'));
}