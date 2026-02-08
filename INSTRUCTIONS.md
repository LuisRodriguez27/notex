# Notes Desktop App

Aplicación de notas de escritorio para Windows y Linux, enfocada en productividad, edición rica de texto y sincronización automática entre dispositivos.

## 🎯 Descripción

Esta aplicación permite crear y organizar notas dentro de cuadernos, utilizando un editor de texto avanzado con soporte para títulos, listas, bloques de código, imágenes y formato enriquecido.

El proyecto está diseñado bajo un enfoque **offline-first**, donde todas las notas se guardan localmente y se sincronizan automáticamente con una base de datos en la nube cuando hay conexión disponible.

---

## ✨ Características principales

- Cuadernos y notas jerárquicas
- Editor rich-text basado en bloques
- Guardado automático
- Funcionamiento sin conexión
- Sincronización automática en la nube
- Disponible para Windows y Linux

---

## 🧠 Arquitectura general

La aplicación está compuesta por tres capas principales:

### 1. Interfaz de usuario
- React + TypeScript
- Editor Tiptap (basado en ProseMirror)
- Manejo de atajos de teclado y botones de formato

### 2. Almacenamiento local
- SQLite
- Todas las notas se guardan localmente como JSON estructurado
- Permite trabajar sin conexión

### 3. Sincronización en la nube
- Supabase (PostgreSQL)
- Sincronización incremental
- Resolución de conflictos basada en timestamps

---

## ✍️ Editor de texto

El editor está construido con **Tiptap**, un framework de edición rich-text que utiliza una estructura de documento basada en nodos.

Esto permite:
- Listas anidadas
- Bloques de código reales
- Títulos estructurados (h1–h6)
- Formato consistente
- Guardar contenido como JSON

Ejemplo de contenido almacenado:
```json
{
  "type": "doc",
  "content": [
    { "type": "heading", "attrs": { "level": 1 }, "content": [{ "type": "text", "text": "Título" }] },
    { "type": "paragraph", "content": [{ "type": "text", "text": "Contenido de la nota" }] }
  ]
}
