const { randomUUID } = require("crypto");
const db = require('./db');

function seed() {
	console.log('Initializing database...');

	// Limpiar datos existentes
	db.exec(`
		DELETE FROM note_versions;
		DELETE FROM attachments;
		DELETE FROM notes;
		DELETE FROM notebooks;
		DELETE FROM settings;
	`);

	const now = new Date().toISOString();

	const notebooks = [
		{ id: randomUUID(), name: '📓 Personal' },
		{ id: randomUUID(), name: '💼 Trabajo' },
		{ id: randomUUID(), name: '💡 Ideas' },
		{ id: randomUUID(), name: '📚 Estudios' }
	];

	const insertNotebook = db.prepare('INSERT INTO notebooks (id, name, createdAt, updatedAt) VALUES (?, ?, ?, ?)');
	const insertNote = db.prepare('INSERT INTO notes (id, notebookId, title, content, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)');

	console.log('Inserting notebooks and notes...');

	notebooks.forEach(nb => {
		insertNotebook.run(nb.id, nb.name, now, now);

		// Insertar algunas notas para cada libreta
		const noteTemplates = [
			{ title: `Bienvenida a ${nb.name}`, content: `Esta es tu primera nota en la libreta ${nb.name}.` },
			{ title: 'Tareas pendientes', content: '- [ ] Revisar correos\n- [ ] Actualizar documentación' },
			{ title: 'Notas de reunión', content: 'Asistentes: Juan, Maria, Pedro.\nAcuerdos: Seguir trabajando.' }
		];

		noteTemplates.forEach(template => {
			insertNote.run(
				randomUUID(),
				nb.id,
				template.title,
				template.content,
				now,
				now
			);
		});
	});

	console.log('Database seeded successfully!');
}

seed();
process.exit(0);
