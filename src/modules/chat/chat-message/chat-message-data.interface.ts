import { ChatMessageType } from './chat-message-type.enum';

export interface ChatMessageData {
  type: ChatMessageType;
  body: string;
  id?: string;
  date?: string;
}
