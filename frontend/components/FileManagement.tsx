import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent, CardHeader } from '~/components/ui/card';
import { Text } from '~/components/ui/text';
import { useIsMobile } from '~/hooks/use-mobile';
import { FileItem } from './FileItem';

export const FileManagement = ({
	handleFileUpload,
	uploadedFiles,
	removeFile,
}: {
	handleFileUpload: () => void;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	uploadedFiles: any[];
	removeFile: (id: string) => void;
}) => {
	const isMobile = useIsMobile();
	return (
		<Card className='shadow-lg'>
			<CardHeader className='border-b border-gray-200 bg-white/50'>
				<View className='flex-row items-center'>
					<Ionicons name='folder' size={20} color='#10b981' />
					<Text className='ml-2 text-lg font-semibold'>Document Manager</Text>
				</View>
			</CardHeader>
			<CardContent className='p-0'>
				<View className='gap-y-4 p-4'>
					{/* Upload Area */}
					<TouchableOpacity
						onPress={handleFileUpload}
						className='items-center rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 p-6'
					>
						<Ionicons name='cloud-upload' size={32} color='#2563eb' />
						<Text className='mt-2 text-center text-sm text-gray-600'>Drag files here or tap to upload</Text>
						<Text className='mt-1 text-center text-xs text-gray-500'>Choose Files</Text>
					</TouchableOpacity>

					{/* Alert */}
					<View className='flex-row items-center rounded-lg border border-blue-200 bg-blue-50 p-3'>
						<Ionicons name='information-circle' size={16} color='#2563eb' />
						<Text className='ml-2 flex-1 text-xs text-blue-700'>Supports PDF, DOC, DOCX, TXT formats</Text>
					</View>
				</View>

				{/* Files List */}
				<View className='border-t border-gray-200'>
					<ScrollView
						className={isMobile ? 'max-h-96' : 'max-h-80'}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ padding: 16 }}
					>
						{uploadedFiles.length === 0 ? (
							<View className='items-center py-8'>
								<Ionicons name='folder-open' size={48} color='#9ca3af' />
								<Text className='mt-2 text-sm text-gray-500'>No files uploaded yet</Text>
							</View>
						) : (
							uploadedFiles.map((file) => <FileItem key={file.id} file={file} removeFile={(id) => removeFile(id)} />)
						)}
					</ScrollView>
				</View>
			</CardContent>
		</Card>
	);
};
