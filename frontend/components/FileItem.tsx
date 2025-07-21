import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '~/components/ui/card';
import { Progress } from '~/components/ui/progress';
import { Text } from '~/components/ui/text';

const formatFileSize = (bytes: number) => {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileIcon = (type: string) => {
	if (type.includes('pdf')) return 'document-text';
	if (type.includes('word') || type.includes('document')) return 'document';
	if (type.includes('text')) return 'document-text-outline';
	return 'folder';
};
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FileItem = ({ file, removeFile }: { file: any; removeFile: (id: string) => void }) => {
	return (
		<Card key={file.id} className='mb-3'>
			<CardContent className='p-3'>
				<View className='flex-row items-start justify-between'>
					<View className='mr-2 flex-1 flex-row items-center'>
						{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
						<Ionicons name={getFileIcon(file.type) as any} size={20} color='#6b7280' />
						<View className='ml-2 flex-1'>
							<Text className='text-sm font-medium' numberOfLines={1}>
								{file.name}
							</Text>
							<Text className='text-xs text-gray-500'>{formatFileSize(file.size)}</Text>
						</View>
					</View>
					<TouchableOpacity onPress={() => removeFile(file.id)} className='p-1'>
						<Ionicons name='close' size={16} color='#6b7280' />
					</TouchableOpacity>
				</View>

				{file.status === 'uploading' && (
					<View className='mt-2'>
						<Progress value={file.progress} className='h-1' />
						<Text className='mt-1 text-xs text-gray-500'>Uploading... {Math.round(file.progress)}%</Text>
					</View>
				)}

				{file.status === 'processing' && (
					<View className='mt-2 flex-row items-center'>
						<Ionicons name='sync' size={12} color='#6b7280' />
						<Text className='ml-1 text-xs text-gray-500'>Processing...</Text>
					</View>
				)}

				{file.status === 'ready' && (
					<View className='mt-2 flex-row items-center'>
						<Ionicons name='checkmark-circle' size={12} color='#10b981' />
						<Text className='ml-1 text-xs text-green-600'>Ready</Text>
					</View>
				)}

				{file.status === 'error' && (
					<View className='mt-2 flex-row items-center'>
						<Ionicons name='alert-circle' size={12} color='#ef4444' />
						<Text className='ml-1 text-xs text-red-600'>Processing failed</Text>
					</View>
				)}
			</CardContent>
		</Card>
	);
};
