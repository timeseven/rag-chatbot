import { useMutation } from '@tanstack/react-query';
import { uploadFile, askQuestion } from '~/features/rag/services/ragApi';

interface UploadParams {
	formData: FormData;
	onProgress?: (progress: number) => void;
}

export const useUploadFile = () => {
	return useMutation({
		mutationFn: ({ formData, onProgress }: UploadParams) => uploadFile(formData, onProgress),
	});
};

export const useAskQuestion = () => {
	return useMutation({
		mutationFn: (question: string) => askQuestion(question),
	});
};
