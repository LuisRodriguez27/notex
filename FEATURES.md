# 🗒️ Notex Roadmap & Features

## 🧱 FASE 1 — Core local (no dependen de nada)
*Estas son obligatorias para que tu app ya se sienta como una app de notas real.*

### 1. Editor de texto sólido (TipTap)
Ya casi lo tienes, pero asegúrate de:
- **Texto básico:** bold, italic, underline
- **Headings**
- **Listas**
- **Code block**
- **Highlight**
- **Imágenes** (aunque sea local por ahora)
- **Placeholder** limpio (“Empieza a escribir…”)

> 👉 Esto no depende de base de datos ni backend.

### 2. Modelo de nota (estructura interna)
Define cómo es una nota desde ya, aunque aún no la guardes en la nube.

**Ejemplo mental:**
```json
{
  "id": "uuid",
  "title": "string",
  "content": "JSON de TipTap",
  "createdAt": "ISOString",
  "updatedAt": "ISOString"
}
```
Esto te va a ahorrar muchísimo dolor después.

### 3. Guardado local automático
Sin backend todavía:
- Guardar automáticamente cada X segundos.
- Guardar al perder foco.
- Guardar al cerrar la app.

**Opciones de almacenamiento:**
- SQLite
- JSON
- IndexedDB
- Archivo local

> 👉 Aquí decides el formato base, no la sincronización.

### 4. Lista de notas (sidebar)
- Crear nota
- Seleccionar nota
- Eliminar nota
- Duplicar nota
- Ordenar por fecha

Esto es 100% frontend + estado local.

### 5. Título editable de la nota
- **Click:** editar
- **Enter:** guarda
- **Blur:** guarda

Pequeña feature, pero hace que se sienta pro.

### 6. Estado “sin notas”
UI decente cuando:
- No hay notas.
- Es la primera vez que se abre la app.

No dependes de nada más y suma UX.

## 🎨 FASE 2 — UX y calidad (siguen siendo independientes)
### 7. Atajos de teclado
Ejemplos:
- `Ctrl`/`Cmd` + `N` → nueva nota
- `Ctrl`/`Cmd` + `S` → guardar
- `Ctrl`/`Cmd` + `B` / `I` → formato

TipTap se lleva muy bien con esto.

### 8. Modo claro / oscuro
- Detectar sistema
- Toggle manual
- Guardar preferencia

No toca datos, solo UI.

### 9. Búsqueda local
- Buscar por título
- Buscar dentro del contenido (texto plano del JSON)

Esto será clave más adelante cuando tengas muchas notas.

### 10. Estado de guardado
Algo tipo: 
- ✅ **Guardado**
- ✏️ **Editando…**
- ⚠️ **Cambios sin guardar**

Pequeño detalle que da mucha confianza.

## 🧠 FASE 3 — Inteligencia del editor (semi-independiente)
*Aquí ya empiezas a usar TipTap a fondo, pero sin backend aún.*

### 11. Corrección ortográfica
**Opciones:**
- Spellcheck nativo del navegador
- Librería JS
- API después

Esto no depende de IA todavía.

### 12. Autocompletado básico
No IA aún:
- Detección de listas
- Markdown-like (`- `, `# `)
- Snippets simples

Esto es puro TipTap + lógica local.

### 13. Historial (undo/redo avanzado)
- Navegar versiones
- Volver a estados anteriores

Muy útil antes de sincronizar.

## 🌐 FASE 4 — Persistencia online (ya dependen de backend)
*Ahora sí entran dependencias.*

### 14. Sincronización con BD online
- Al abrir app → traer notas
- Al editar → sync en background
- Resolver conflictos (más adelante)

### 15. Modo offline
- Editar sin internet
- Sync cuando vuelva conexión

Electron aquí brilla.

### 16. Autenticación
- Usuario
- Token
- Cifrado si te pones fancy

## 🤖 FASE 5 — IA (lo último, y con cabeza)
### 17. Sugerencias mientras escribes
- Continuar frases
- Reformular
- Resumir párrafos

Esto sí depende de que todo lo anterior esté bien hecho.

### 18. Corrección inteligente (tipo Word)
- Acentos
- Gramática
- Estilo

Aquí ya usas modelos de lenguaje.
