// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Camera, Image, X, Bot, User, ShoppingCart, Heart, Share2, Bookmark, Smile, Paperclip } from 'lucide-react';

// const ChatInterface = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm your AI assistant. How can I help you today?",
//       sender: 'bot',
//       timestamp: new Date(Date.now() - 300000),
//       type: 'text'
//     }
//   ]);
//   const [inputText, setInputText] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const [showCamera, setShowCamera] = useState(false);
//   const [stream, setStream] = useState(null);
//   const [showQuickActions, setShowQuickActions] = useState(false);
//   const [attachments, setAttachments] = useState([]);
//   const messagesEndRef = useRef(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Simulate server response
//   const simulateServerResponse = async (userMessage, quickAction = null) => {
//     setIsTyping(true);
    
//     // Simulate network delay
//     await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
//     const responses = [
//       "That's interesting! Tell me more about that.",
//       "I understand what you're saying. How can I assist you further?",
//       "Thanks for sharing that with me. What would you like to know?",
//       "Great question! Let me help you with that.",
//       "I see. Is there anything specific you'd like me to help you with?",
//       "That sounds fascinating! I'd love to learn more.",
//       "I appreciate you telling me that. How else can I support you today?"
//     ];

//     const imageResponses = [
//       "I can see the image you've shared! That's quite interesting.",
//       "Thanks for sharing that image with me. What would you like to know about it?",
//       "Great photo! Is there anything specific you'd like me to help with regarding this image?",
//       "I've received your image. How can I assist you with it?"
//     ];

//     const quickActionResponses = {
//       'add-to-cart': "Great choice! I've added that item to your cart. Would you like to continue shopping or proceed to checkout?",
//       'save-for-later': "Perfect! I've saved this item to your wishlist. You can find it in your saved items.",
//       'share': "I've prepared a shareable link for you. You can copy it from your share menu.",
//       'get-info': "Here's the detailed information you requested. Let me know if you need anything else!"
//     };

//     let responseText;
//     if (quickAction && quickActionResponses[quickAction]) {
//       responseText = quickActionResponses[quickAction];
//     } else if (userMessage.type === 'image') {
//       responseText = imageResponses[Math.floor(Math.random() * imageResponses.length)];
//     } else {
//       responseText = responses[Math.floor(Math.random() * responses.length)];
//     }

//     const botMessage = {
//       id: Date.now(),
//       text: responseText,
//       sender: 'bot',
//       timestamp: new Date(),
//       type: 'text'
//     };

//     setMessages(prev => [...prev, botMessage]);
//     setIsTyping(false);
//   };

//   const handleSendMessage = async () => {
//     if (!inputText.trim() && attachments.length === 0) return;

//     const userMessage = {
//       id: Date.now(),
//       text: inputText,
//       sender: 'user',
//       timestamp: new Date(),
//       type: attachments.length > 0 ? 'mixed' : 'text',
//       attachments: [...attachments]
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputText('');
//     setAttachments([]);

//     await simulateServerResponse(userMessage);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleImageUpload = async (file) => {
//     const imageUrl = URL.createObjectURL(file);
    
//     const newAttachment = {
//       id: Date.now(),
//       type: 'image',
//       imageUrl: imageUrl,
//       fileName: file.name,
//       label: `📷 ${file.name}`,
//       preview: imageUrl
//     };

//     setAttachments(prev => [...prev, newAttachment]);
//   };

//   const startCamera = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({ 
//         video: { facingMode: 'user' } 
//       });
//       setStream(mediaStream);
//       setShowCamera(true);
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = mediaStream;
//       }
//     } catch (err) {
//       console.error('Error accessing camera:', err);
//       alert('Unable to access camera. Please check permissions.');
//     }
//   };

//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//     setShowCamera(false);
//   };

//   const capturePhoto = () => {
//     if (videoRef.current && canvasRef.current) {
//       const canvas = canvasRef.current;
//       const video = videoRef.current;
      
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
      
//       const ctx = canvas.getContext('2d');
//       ctx.drawImage(video, 0, 0);
      
//       canvas.toBlob(async (blob) => {
//         const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' });
//         await handleImageUpload(file);
//         stopCamera();
//       }, 'image/jpeg', 0.8);
//     }
//   };

//   const handleQuickAction = async (action, label) => {
//     const newAttachment = {
//       id: Date.now(),
//       type: 'quick-action',
//       action: action,
//       label: label,
//       barcodeId: `BC${Math.random().toString(36).substr(2, 8).toUpperCase()}`
//     };

//     setAttachments(prev => [...prev, newAttachment]);
//     setShowQuickActions(false);
//   };

//   const removeAttachment = (attachmentId) => {
//     setAttachments(prev => prev.filter(att => att.id !== attachmentId));
//   };

//   const formatTime = (date) => {
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Header */}
//       <div className="bg-white shadow-lg border-b border-gray-200 p-4">
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//             <Bot className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-xl font-semibold text-gray-800">AI Assistant</h1>
//             <p className="text-sm text-gray-500">Online • Always ready to help</p>
//           </div>
//         </div>
//       </div>

//       {/* Messages Container */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.map((message) => (
//           <div
//             key={message.id}
//             className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//           >
//             <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
//               message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
//             }`}>
//               {/* Avatar */}
//               <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                 message.sender === 'user' 
//                   ? 'bg-gradient-to-r from-green-400 to-blue-500' 
//                   : 'bg-gradient-to-r from-purple-400 to-pink-500'
//               }`}>
//                 {message.sender === 'user' ? (
//                   <User className="w-4 h-4 text-white" />
//                 ) : (
//                   <Bot className="w-4 h-4 text-white" />
//                 )}
//               </div>

//               {/* Message Bubble */}
//               <div className={`rounded-2xl px-4 py-2 shadow-md ${
//                 message.sender === 'user'
//                   ? message.type === 'quick-action'
//                     ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
//                     : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
//                   : 'bg-white text-gray-800 border border-gray-200'
//               }`}>
//                 {message.type === 'image' ? (
//                   <div className="space-y-2">
//                     <img 
//                       src={message.imageUrl} 
//                       alt="Shared image" 
//                       className="rounded-lg max-w-full h-auto"
//                       style={{ maxHeight: '200px' }}
//                     />
//                     {message.text && <p className="text-sm">{message.text}</p>}
//                   </div>
//                 ) : message.type === 'mixed' ? (
//                   <div className="space-y-2">
//                     {message.text && <p className="text-sm">{message.text}</p>}
//                     {message.attachments && message.attachments.map((attachment) => (
//                       <div key={attachment.id} className="space-y-1">
//                         {attachment.type === 'image' ? (
//                           <div className="space-y-1">
//                             <img 
//                               src={attachment.imageUrl} 
//                               alt={attachment.fileName} 
//                               className="rounded-lg max-w-full h-auto"
//                               style={{ maxHeight: '200px' }}
//                             />
//                             <p className="text-xs opacity-75">{attachment.fileName}</p>
//                           </div>
//                         ) : attachment.type === 'quick-action' ? (
//                           <div className="bg-black bg-opacity-10 rounded-lg p-2">
//                             <p className="text-xs font-mono">ID: {attachment.barcodeId}</p>
//                             <p className="text-sm">{attachment.label}</p>
//                           </div>
//                         ) : null}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-sm">{message.text}</p>
//                 )}
//                 <p className={`text-xs mt-1 ${
//                   message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
//                 }`}>
//                   {formatTime(message.timestamp)}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}

//         {/* Typing Indicator */}
//         {isTyping && (
//           <div className="flex justify-start">
//             <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
//               <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
//                 <Bot className="w-4 h-4 text-white" />
//               </div>
//               <div className="bg-white rounded-2xl px-4 py-2 shadow-md border border-gray-200">
//                 <div className="flex space-x-1">
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* Camera Modal */}
//       {showCamera && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold">Take a Photo</h3>
//               <button
//                 onClick={stopCamera}
//                 className="p-1 hover:bg-gray-100 rounded-full"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               className="w-full rounded-lg mb-4"
//             />
//             <button
//               onClick={capturePhoto}
//               className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
//             >
//               Capture Photo
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Quick Actions Bar */}
//       {showQuickActions && (
//         <div className="bg-white border-t border-gray-200 p-4">
//           <div className="flex flex-wrap gap-2 mb-2">
//             <button
//               onClick={() => handleQuickAction('add-to-cart', '🛒 Add to Cart')}
//               className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               <ShoppingCart className="w-4 h-4" />
//               <span>Add to Cart</span>
//             </button>
//             <button
//               onClick={() => handleQuickAction('save-for-later', '❤️ Save for Later')}
//               className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               <Heart className="w-4 h-4" />
//               <span>Save for Later</span>
//             </button>
//             <button
//               onClick={() => handleQuickAction('share', '📤 Share')}
//               className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               <Share2 className="w-4 h-4" />
//               <span>Share</span>
//             </button>
//             <button
//               onClick={() => handleQuickAction('get-info', 'ℹ️ Get More Info')}
//               className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               <Bookmark className="w-4 h-4" />
//               <span>Get Info</span>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Beautiful Input Footer */}
//       <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-t border-gray-200 p-4">
//         <div className="max-w-4xl mx-auto">
//           {/* Input Container */}
//           <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
//             <div className="flex items-end">
//               {/* Left Action Buttons - 2x2 Grid */}
//               <div className="p-2">
//                 <div className="grid grid-cols-2 gap-1">
//                   {/* Top Row */}
//                   <button
//                     onClick={() => setShowQuickActions(!showQuickActions)}
//                     className={`p-2 rounded-lg transition-all duration-200 ${
//                       showQuickActions 
//                         ? 'bg-blue-500 text-white shadow-md' 
//                         : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
//                     }`}
//                     title="Quick Actions"
//                   >
//                     <div className="w-5 h-5 flex items-center justify-center">
//                       <div className="grid grid-cols-2 gap-0.5">
//                         <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
//                         <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
//                         <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
//                         <div className="w-1.5 h-1.5 bg-current rounded-sm"></div>
//                       </div>
//                     </div>
//                   </button>
                  
//                   <button
//                     onClick={() => fileInputRef.current?.click()}
//                     className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
//                     title="Upload Image"
//                   >
//                     <Image className="w-5 h-5" />
//                   </button>
                  
//                   {/* Bottom Row */}
//                   <button
//                     onClick={startCamera}
//                     className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
//                     title="Take Photo"
//                   >
//                     <Camera className="w-5 h-5" />
//                   </button>

//                   <button
//                     className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
//                     title="Attach File"
//                   >
//                     <Paperclip className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Text Input Area with Attachments */}
//               <div className="flex-1 px-2 py-2">
//                 <div className="relative">
//                   {/* Attachment Ribbons */}
//                   {attachments.length > 0 && (
//                     <div className="flex flex-wrap gap-2 p-2 mb-2 bg-gray-50 rounded-lg border border-gray-200">
//                       {attachments.map((attachment) => (
//                         <div
//                           key={attachment.id}
//                           className="flex items-center space-x-2 bg-white border border-gray-300 rounded-full px-3 py-1 shadow-sm"
//                         >
//                           {attachment.type === 'image' ? (
//                             <>
//                               <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100">
//                                 <img 
//                                   src={attachment.preview} 
//                                   alt="preview" 
//                                   className="w-full h-full object-cover"
//                                 />
//                               </div>
//                               <span className="text-sm text-gray-700 max-w-20 truncate">
//                                 {attachment.fileName}
//                               </span>
//                             </>
//                           ) : attachment.type === 'quick-action' ? (
//                             <>
//                               <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                                 <div className="w-3 h-3 border border-white rounded-sm bg-white bg-opacity-20"></div>
//                               </div>
//                               <div className="flex flex-col">
//                                 <span className="text-xs text-gray-600 font-mono leading-tight">
//                                   {attachment.barcodeId}
//                                 </span>
//                                 <span className="text-sm text-gray-700 leading-tight">
//                                   {attachment.label.replace(/^[🛒❤️📤ℹ️]\s/, '')}
//                                 </span>
//                               </div>
//                             </>
//                           ) : null}
                          
//                           <button
//                             onClick={() => removeAttachment(attachment.id)}
//                             className="w-4 h-4 bg-gray-400 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors duration-200 ml-1"
//                           >
//                             <X className="w-2.5 h-2.5" />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   <textarea
//                     value={inputText}
//                     onChange={(e) => setInputText(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     placeholder={attachments.length > 0 ? "Add a message..." : "Type your message..."}
//                     className="w-full px-4 py-3 pr-12 border-0 resize-none focus:outline-none bg-gray-50 rounded-xl text-gray-800 placeholder-gray-500 transition-all duration-200 focus:bg-white focus:shadow-inner"
//                     rows="1"
//                     style={{ 
//                       minHeight: '48px', 
//                       maxHeight: '120px',
//                       fontSize: '16px',
//                       lineHeight: '1.4'
//                     }}
//                   />
                  
//                   {/* Emoji Button */}
//                   <button
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
//                     title="Add Emoji"
//                   >
//                     <Smile className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Send Button */}
//               <div className="p-2">
//                 <button
//                   onClick={handleSendMessage}
//                   disabled={!inputText.trim() && attachments.length === 0}
//                   className={`p-3 rounded-xl transition-all duration-200 ${
//                     (inputText.trim() || attachments.length > 0)
//                       ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
//                       : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   }`}
//                   title="Send Message"
//                 >
//                   <Send className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>
            
//             {/* Status Bar */}
//             <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
//               <div className="flex items-center justify-between text-xs text-gray-500">
//                 <span>
//                   {attachments.length > 0 
//                     ? `${attachments.length} attachment${attachments.length > 1 ? 's' : ''} • Press Enter to send`
//                     : 'Press Enter to send, Shift+Enter for new line'
//                   }
//                 </span>
//                 <div className="flex items-center space-x-2">
//                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
//                   <span>AI Assistant is online</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Hidden File Input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         accept="image/*"
//         onChange={(e) => {
//           const file = e.target.files?.[0];
//           if (file) {
//             handleImageUpload(file);
//           }
//         }}
//         className="hidden"
//       />

//       {/* Hidden Canvas for Camera */}
//       <canvas ref={canvasRef} className="hidden" />
//     </div>
//   );
// };

// export default ChatInterface;