class Atachment {
	constructor ({ id, noteId, type, path, createdAt, isSynced=0 }) {
		this.id = id;
		this.noteId = noteId;
		this.type = type;
		this.path = path;
		this.createdAt = createdAt;
		this.isSynced = isSynced;
	}

	toPlainObject() {
		return {
			id: this.id,
			noteId: this.noteId,
			type: this.type,
			path: this.path,
			createdAt: this.createdAt,
			isSynced: this.isSynced
		};
	}
}

module.exports = Atachment;