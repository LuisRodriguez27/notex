import '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    focus: {
      /**
       * Focus the editor.
       */
      focus: (
        position?: 'start' | 'end' | 'all' | number | boolean | null,
        options?: { scrollIntoView?: boolean }
      ) => ReturnType
    }
  }
}
