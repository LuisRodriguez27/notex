class Notebook {
	constructor({id, name, color, createdAt, updatedAt, isDeleted=0, isSynced=0, notebookNotes=[]}) {
		this.id = id;
		this.name = name;
		this.color = color;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.isDeleted = isDeleted;
		this.isSynced = isSynced;
		this.notebookNotes = notebookNotes;
	}

	toPlainObject() {
		return {
			id: this.id,
			name: this.name,
			color: this.color,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			isDeleted: this.isDeleted,
			isSynced: this.isSynced,
			notebookNotes: this.notebookNotes
		};
	}
};

module.exports = Notebook;