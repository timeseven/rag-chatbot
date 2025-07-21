import { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { Badge } from '~/components/ui/badge';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { useIsMobile } from '~/hooks/use-mobile';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Text } from '~/components/ui/text';
import { Message } from '~/components/Message';
import { FileManagement } from '~/components/FileManagement';
import { ChatArea } from '~/components/ChatArea';
import { MobileTabNavigation } from '~/components/MobileTabNavigation';

interface Message {
	id: string;
	content: string;
	role: 'user' | 'assistant';
	timestamp: Date;
	sources?: Source[];
	relatedFiles?: string[];
}

interface Source {
	title: string;
	content: string;
	score?: number;
	fileName?: string;
}

interface UploadedFile {
	id: string;
	name: string;
	size: number;
	type: string;
	uri: string;
	status: 'uploading' | 'processing' | 'ready' | 'error';
	progress: number;
	uploadedAt: Date;
}

export default function RagChatbot() {
	const isMobile = useIsMobile();
	const [activeTab, setActiveTab] = useState('chat'); // For mobile tab switching
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			content:
				"Hello! I'm your AI assistant. You can upload documents and I'll answer questions based on those documents. Please upload some files first, or start asking questions directly!",
			role: 'assistant',
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

	const scrollViewRef = useRef<ScrollView>(null);

	// Mock RAG response data
	const mockSources: Source[] = [
		{
			title: 'User Document Excerpt',
			content: 'Based on your uploaded document content, here is the relevant information snippet...',
			fileName: 'document.pdf',
			score: 0.95,
		},
		{
			title: 'Related Document Content',
			content: 'Relevant information found in another document...',
			fileName: 'guide.docx',
			score: 0.87,
		},
	];

	const scrollToBottom = () => {
		scrollViewRef.current?.scrollToEnd({ animated: true });
	};

	useEffect(() => {
		setTimeout(scrollToBottom, 100);
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage: Message = {
			id: Date.now().toString(),
			content: input,
			role: 'user',
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput('');
		setIsLoading(true);

		// Simulate API call delay
		setTimeout(() => {
			const relatedFiles = uploadedFiles
				.filter((file) => file.status === 'ready')
				.slice(0, 2)
				.map((file) => file.name);

			const assistantMessage: Message = {
				id: (Date.now() + 1).toString(),
				content:
					uploadedFiles.length > 0
						? `Based on your uploaded documents, I'll answer your question about "${input}". I found relevant information in your documents that might be helpful.`
						: `Regarding your question about "${input}", I'll answer based on my general knowledge. If you upload relevant documents, I can provide more accurate and specific answers.`,
				role: 'assistant',
				timestamp: new Date(),
				sources: uploadedFiles.length > 0 ? mockSources : undefined,
				relatedFiles: relatedFiles.length > 0 ? relatedFiles : undefined,
			};

			setMessages((prev) => [...prev, assistantMessage]);
			setIsLoading(false);
		}, 2000);
	};

	const handleFileUpload = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: [
					'application/pdf',
					'application/msword',
					'text/plain',
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				],
				multiple: false,
			});

			if (!result.canceled) {
				result.assets.forEach((asset) => {
					const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
					const newFile: UploadedFile = {
						id: fileId,
						name: asset.name,
						size: asset.size || 0,
						type: asset.mimeType || '',
						uri: asset.uri,
						status: 'uploading',
						progress: 0,
						uploadedAt: new Date(),
					};

					setUploadedFiles((prev) => [...prev, newFile]);

					// Simulate file upload and processing
					let progress = 0;
					const uploadInterval = setInterval(() => {
						progress += Math.random() * 30;
						if (progress >= 100) {
							progress = 100;
							clearInterval(uploadInterval);

							// Simulate processing stage
							setUploadedFiles((prev) =>
								prev.map((f) => (f.id === fileId ? { ...f, status: 'processing', progress: 100 } : f))
							);

							// Simulate processing completion
							setTimeout(() => {
								setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: 'ready' } : f)));
							}, 2000);
						} else {
							setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, progress } : f)));
						}
					}, 200);
				});
			}
		} catch (error) {
			console.error('File upload error:', error);
			Alert.alert('Error', 'Failed to upload file');
		}
	};

	const removeFile = (fileId: string) => {
		setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
	};

	return (
		<SafeAreaView className='flex-1 bg-gradient-to-br from-slate-50 to-slate-100'>
			<KeyboardAvoidingView
				className='flex-1'
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
			>
				{!isMobile ? (
					// Large screen: Side by side layout
					<View className='flex-1 p-4'>
						<View className='h-full flex-row gap-4'>
							{/* File Management Sidebar */}
							<View className='w-80'>
								{
									<FileManagement
										handleFileUpload={handleFileUpload}
										uploadedFiles={uploadedFiles}
										removeFile={removeFile}
									/>
								}
							</View>

							{/* Chat Area */}
							<View className='flex-1'>
								{
									<ChatArea
										messages={messages}
										isLoading={isLoading}
										input={input}
										setInput={setInput}
										handleSend={handleSend}
										uploadedFiles={uploadedFiles}
										scrollViewRef={scrollViewRef}
									/>
								}
							</View>
						</View>
					</View>
				) : (
					// Small screen: Tab layout
					<View className='flex-1'>
						{/* Header */}
						<View className='border-b border-gray-200 bg-white px-4 py-3'>
							<View className='flex-row items-center justify-between'>
								<View className='flex-row items-center'>
									<FontAwesome5 name='robot' size={24} color='black' />
									<Text className='ml-2 text-lg font-semibold'>RAG Chatbot</Text>
								</View>
								<Badge variant='secondary'>
									<Text className='text-xs'>{uploadedFiles.filter((f) => f.status === 'ready').length} docs ready</Text>
								</Badge>
							</View>
						</View>

						{/* Tab Navigation */}
						{<MobileTabNavigation uploadedFiles={uploadedFiles} activeTab={activeTab} setActiveTab={setActiveTab} />}

						{/* Tab Content */}
						<View className='flex-1 p-4'>
							{activeTab === 'chat' ? (
								<View className='flex-1'>
									{/* Messages */}
									<ScrollView
										ref={scrollViewRef}
										className='mb-4 flex-1'
										showsVerticalScrollIndicator={false}
										contentContainerStyle={{ paddingBottom: 20 }}
									>
										{messages.map((message) => (
											<Message key={message.id} message={message} />
										))}

										{isLoading && (
											<View className='mb-4 items-start'>
												<View className='max-w-[85%] flex-row items-start'>
													<Avatar className='mr-2 mt-1 h-8 w-8' alt='Assistant Avatar'>
														<AvatarFallback className='bg-blue-100'>
															<FontAwesome5 name='robot' size={16} color='#2563eb' />
														</AvatarFallback>
													</Avatar>
													<View className='rounded-lg border border-gray-200 bg-white px-4 py-2'>
														<View className='flex-row items-center'>
															<Ionicons name='sync' size={16} color='#2563eb' />
															<Text className='ml-2 text-sm text-gray-500'>Analyzing documents and thinking...</Text>
														</View>
													</View>
												</View>
											</View>
										)}
									</ScrollView>

									{/* Input Area */}
									<View className='rounded-lg border border-gray-200 bg-white px-4 py-3'>
										<View className='flex-row items-end'>
											<View className='mr-2 flex-1'>
												<TextInput
													value={input}
													onChangeText={setInput}
													placeholder={
														uploadedFiles.filter((f) => f.status === 'ready').length > 0
															? 'Ask questions based on your documents...'
															: 'Enter your question or upload documents first...'
													}
													multiline
													maxLength={500}
													className='max-h-24 rounded-lg border border-gray-300 px-3 py-2 text-sm'
													editable={!isLoading}
												/>
											</View>
											<TouchableOpacity
												onPress={handleSend}
												disabled={!input.trim() || isLoading}
												className={`h-10 w-10 items-center justify-center rounded-lg ${
													!input.trim() || isLoading ? 'bg-gray-300' : 'bg-blue-600'
												}`}
											>
												{isLoading ? (
													<Ionicons name='sync' size={16} color='white' />
												) : (
													<Ionicons name='send' size={16} color='white' />
												)}
											</TouchableOpacity>
										</View>
										<Text className='mt-2 text-center text-xs text-gray-500'>
											Powered by RAG • {uploadedFiles.filter((f) => f.status === 'ready').length} documents available
										</Text>
									</View>
								</View>
							) : (
								// Files tab content
								<FileManagement
									handleFileUpload={handleFileUpload}
									uploadedFiles={uploadedFiles}
									removeFile={removeFile}
								/>
							)}
						</View>
					</View>
				)}
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
