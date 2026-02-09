class NoteVersion {
	constructor ({ id, noteId, versionNumber, content, createdAt }) {
		this.id = id;
		this.noteId = noteId;
		this.versionNumber = versionNumber;
		this.content = content;
		this.createdAt = createdAt;
	}

	toPlainObject() {
		return {
			id: this.id,
			noteId: this.noteId,
			versionNumber: this.versionNumber,
			content: this.content,
			createdAt: this.createdAt
		};
	}
}