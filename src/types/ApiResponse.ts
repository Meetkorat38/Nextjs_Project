import { Message } from "@/models/User.model";

export interface Apiresponse {
  success: boolean;
  message: string;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
}
