class Notebook {
	constructor({id, name, createdAt, updatedAt, isDeleted=0, isSynced=0, notebookNotes=[]}) {
		this.id = id;
		this.name = name;
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
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			isDeleted: this.isDeleted,
			isSynced: this.isSynced,
			notebookNotes: this.notebookNotes
		};
	}
};

module.exports = Notebook;