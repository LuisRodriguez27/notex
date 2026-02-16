import type { Attachment } from "@/shared/types";

export const AttachmentsApiService = {
	saveAttachment: async (noteId: string, filePath: string): Promise<Attachment> => {
		return window.api.saveAttachment(noteId, filePath);
	},

	saveAttachmentFromBuffer: async (noteId: string, buffer: ArrayBuffer, fileName: string): Promise<Attachment> => {
		return window.api.saveAttachmentFromBuffer(noteId, buffer, fileName);
	},

	getAttachments: async (noteId: string): Promise<Attachment[]> => {
		return window.api.getAttachments(noteId);
	},
	
	deleteAttachment: async (id: string): Promise<boolean> => {
		return window.api.deleteAttachment(id);
	}
};
