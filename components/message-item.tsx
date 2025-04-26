import { deleteMessage } from "@/lib/actions/messages"
import { toast } from "sonner"
import { Button } from "./ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Trash2, Reply } from "lucide-react"
import { MessageForm } from "./message-form"
import { useState } from "react"

interface Message {
  id: string
  content: string
  created_at: string
  sender_id: string
  recipient_id: string
  read: boolean
  sender: {
    username: string
  }
  receiver: {
    username: string
  }
}

interface MessageItemProps {
  message: Message
  currentUserId: string
  onDelete: (messageId: string) => void
  isDeleting?: boolean
}

export function MessageItem({ message, currentUserId, onDelete, isDeleting = false }: MessageItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const handleDelete = () => {
    onDelete(message.id)
  }

  const isUnread = !message.read && message.recipient_id === currentUserId
  const isReceived = message.recipient_id === currentUserId

  return (
    <div className={`flex flex-col gap-4 p-4 border-b ${isUnread ? 'bg-zinc-900/50' : ''}`}>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              {message.sender_id === currentUserId ? "You" : message.sender.username}
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="font-medium">
              {message.recipient_id === currentUserId ? "You" : message.receiver.username}
            </span>
            {isUnread && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-[#00517c] text-white rounded-full">
                New
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{message.content}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(message.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          {isReceived && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <Reply className="h-4 w-4" />
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Message</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this message? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      {showReplyForm && isReceived && (
        <div className="pl-4 border-l-2 border-zinc-800">
          <MessageForm 
            recipientId={message.sender_id} 
            recipientName={message.sender.username} 
          />
        </div>
      )}
    </div>
  )
} 