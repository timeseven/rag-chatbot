import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export async function getOrCreateTenantId(): Promise<string> {
	if (Platform.OS === 'web') {
		const stored = localStorage.getItem('tenantId');
		if (stored) return stored;

		const newTenantId = uuidv4();
		localStorage.setItem('tenantId', newTenantId);
		return newTenantId;
	} else {
		const stored = await AsyncStorage.getItem('tenantId');
		if (stored) return stored;

		const newTenantId = uuidv4();
		await AsyncStorage.setItem('tenantId', newTenantId);
		return newTenantId;
	}
}
