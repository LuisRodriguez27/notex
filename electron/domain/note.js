class Note {
	constructor ({ id, notebookId, title, content, createdAt, updatedAt, isDeleted=0, isSynced=0 }) {
		this.id = id;
		this.notebookId = notebookId;
		this.title = title;
		this.content = content;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.isDeleted = isDeleted;
		this.isSynced = isSynced;
	}

	toPlainObject() {
		return {
			id: this.id,
			notebookId: this.notebookId,
			title: this.title,
			content: this.content,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			isDeleted: this.isDeleted,
			isSynced: this.isSynced
		};
	}
}

module.exports = Note;