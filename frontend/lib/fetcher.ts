import { BASE_URL } from '@env';
import { getOrCreateTenantId } from './utils';
export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
	console.log('Base URL:', BASE_URL);
	const fullUrl = `${BASE_URL}${url}`;

	const isFormData = options?.body instanceof FormData;
	const tenantId = await getOrCreateTenantId();

	const res = await fetch(fullUrl, {
		method: options?.method || 'GET',
		headers: {
			...(isFormData ? {} : { 'Content-Type': 'application/json' }),
			...options?.headers,
			'X-Tenant-ID': tenantId,
		},
		body: options?.body,
	});

	if (!res.ok) {
		const message = await res.text();
		throw new Error(`Error ${res.status}: ${message}`);
	}

	if (res.status === 204) {
		return null as T;
	}

	return res.json();
}
