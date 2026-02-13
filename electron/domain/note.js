class Note {
	constructor ({ id, notebookId, title, content, color, createdAt, updatedAt, isDeleted=0, isSynced=0 }) {
		this.id = id;
		this.notebookId = notebookId;
		this.title = title;
		this.content = content;
		this.color = color;
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
			color: this.color,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			isDeleted: this.isDeleted,
			isSynced: this.isSynced
		};
	}
}

module.exports = Note;