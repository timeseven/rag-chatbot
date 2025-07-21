import { BASE_URL } from '@env';
import { fetcher } from '~/lib/fetcher';
import { getOrCreateTenantId } from '~/lib/utils';

export const uploadFile = async (data: FormData, onProgress?: (progress: number) => void) => {
	const tenantId = await getOrCreateTenantId();
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('POST', `${BASE_URL}/rag/upload`);

		xhr.setRequestHeader('X-Tenant-ID', tenantId);

		xhr.upload.onprogress = (event) => {
			console.log('Upload progress event:', event, onProgress, event.lengthComputable);
			if (event.lengthComputable && onProgress) {
				const progress = Math.round((event.loaded / event.total) * 100);
				onProgress(progress);
			}
		};

		xhr.onload = () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				resolve(JSON.parse(xhr.responseText));
			} else {
				reject(new Error(xhr.statusText));
			}
		};

		xhr.onerror = () => reject(new Error('Upload failed'));
		xhr.onabort = () => reject(new Error('Upload aborted'));

		xhr.send(data);
	});
};

export const askQuestion = async (question: string) => {
	return await fetcher<{ answer: string }>(`/rag/ask`, {
		method: 'POST',
		body: JSON.stringify({ question }),
	});
};
