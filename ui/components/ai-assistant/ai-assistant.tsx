'use client';

import {useMemo, useState} from 'react';
import {useChat} from '@ai-sdk/react';
import type {FileUIPart} from 'ai';
import {DefaultChatTransport} from 'ai';
import {PlusIcon, Sparkles, Square} from 'lucide-react';

// ---- CORE IMPORTS ---- //
import {withBasePath} from '@/lib/core/path/base-path';
import {Button} from '@/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/components/dialog';
import {TooltipProvider} from '@/ui/components/tooltip';

// ---- LOCAL IMPORTS ---- //
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from '@/ui/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/ui/components/ai-elements/message';
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from '@/ui/components/ai-elements/prompt-input';
import {
  Attachment,
  AttachmentInfo,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from '@/ui/components/ai-elements/attachments';

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;

function DraftAttachments() {
  const attachments = usePromptInputAttachments();

  if (attachments.files.length === 0) {
    return null;
  }

  return (
    <PromptInputHeader className="border-b px-3 pb-2 pt-3">
      <Attachments className="w-full" variant="inline">
        {attachments.files.map(file => (
          <Attachment
            data={file}
            key={file.id}
            onRemove={() => attachments.remove(file.id)}>
            <AttachmentPreview />
            <AttachmentInfo />
            <AttachmentRemove />
          </Attachment>
        ))}
      </Attachments>
    </PromptInputHeader>
  );
}

function MessageAttachments({files}: {files: FileUIPart[]}) {
  if (files.length === 0) {
    return null;
  }

  return (
    <Attachments
      className="group-[.is-user]:ml-auto group-[.is-user]:justify-end"
      variant="grid">
      {files.map((file, index) => (
        <Attachment data={{...file, id: `${file.url}-${index}`}} key={index}>
          <AttachmentPreview />
        </Attachment>
      ))}
    </Attachments>
  );
}

function AssistantInputActions({
  disabled,
  hasText,
  onStop,
  status,
}: {
  disabled: boolean;
  hasText: boolean;
  onStop: () => void;
  status: ReturnType<typeof useChat>['status'];
}) {
  const attachments = usePromptInputAttachments();
  const canSubmit = hasText || attachments.files.length > 0;

  return (
    <PromptInputFooter className="border-t px-2 py-2">
      <PromptInputTools>
        <PromptInputActionMenu>
          <PromptInputActionMenuTrigger
            aria-label="Add image"
            disabled={disabled}
            tooltip="Add image"
            className="!z-[60]">
            <PlusIcon className="size-4" />
          </PromptInputActionMenuTrigger>
          <PromptInputActionMenuContent>
            <PromptInputActionAddAttachments label="Upload image" />
            <PromptInputActionAddScreenshot />
          </PromptInputActionMenuContent>
        </PromptInputActionMenu>
      </PromptInputTools>
      <PromptInputSubmit
        className="rounded-full"
        disabled={!(disabled || canSubmit)}
        onStop={onStop}
        status={status}>
        {status === 'streaming' ? <Square className="size-4" /> : undefined}
      </PromptInputSubmit>
    </PromptInputFooter>
  );
}

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const {messages, sendMessage, status, error, stop} = useChat({
    // AOS persists chat/message ids as UUIDs; useChat's default nanoid ids make
    // the endpoint return an empty stream. generateId covers both the chat id
    // and per-message ids.
    generateId: () => crypto.randomUUID(),
    // Throttle UI repaints during streaming (ms) so fast token bursts render
    // smoothly instead of in one jump.
    experimental_throttle: 50,
    transport: new DefaultChatTransport({
      api: withBasePath('/api/ai/chat'),
    }),
  });

  const isBusy = status === 'submitted' || status === 'streaming';
  const hasDraft = inputText.trim().length > 0;

  // Show a typing indicator from the moment a message is sent until the
  // assistant's first token arrives (AOS takes a few seconds to respond).
  const lastMessage = messages[messages.length - 1];
  const lastAssistantText =
    lastMessage?.role === 'assistant'
      ? lastMessage.parts
          .filter(part => part.type === 'text')
          .map(part => part.text)
          .join('')
      : '';
  const showLoader = isBusy && lastAssistantText.length === 0;

  const messageViews = useMemo(
    () =>
      messages.map(message => {
        const files = message.parts.filter(
          (part): part is FileUIPart => part.type === 'file',
        );

        return (
          <Message from={message.role} key={message.id}>
            <MessageContent className="group-[.is-user]:bg-muted group-[.is-user]:text-foreground">
              <MessageAttachments files={files} />
              {message.parts.map((part, i) =>
                part.type === 'text' ? (
                  <MessageResponse key={`${message.id}-${i}`}>
                    {part.text}
                  </MessageResponse>
                ) : null,
              )}
            </MessageContent>
          </Message>
        );
      }),
    [messages],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="AI assistant">
          <Sparkles className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[70vh] max-h-[700px] w-full max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b px-4 py-3 text-left">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4" /> Assistant
          </DialogTitle>
          <DialogDescription className="sr-only">
            Chat with the Axelor AI assistant
          </DialogDescription>
        </DialogHeader>

        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                icon={<Sparkles className="size-5" />}
                title="How can I help?"
              />
            ) : (
              messageViews
            )}
            {showLoader && (
              <Message from="assistant">
                <MessageContent>
                  <div className="flex items-center gap-1 py-1">
                    <span className="bg-muted-foreground/50 size-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
                    <span className="bg-muted-foreground/50 size-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
                    <span className="bg-muted-foreground/50 size-2 animate-bounce rounded-full" />
                  </div>
                </MessageContent>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t bg-background p-3">
          {(error || inputError) && (
            <p className="text-destructive px-1 pb-2 text-sm">
              {inputError ?? 'Something went wrong. Please try again.'}
            </p>
          )}

          <TooltipProvider>
            <PromptInput
              accept="image/*"
              className="rounded-lg"
              maxFileSize={MAX_IMAGE_SIZE}
              multiple
              onError={err => setInputError(err.message)}
              onSubmit={async ({text, files}) => {
                const trimmedText = text.trim();
                if (isBusy || (!trimmedText && files.length === 0)) {
                  return;
                }

                setInputError(null);
                await sendMessage(
                  trimmedText ? {files, text: trimmedText} : {files},
                );
                setInputText('');
              }}>
              <DraftAttachments />
              <PromptInputBody>
                <PromptInputTextarea
                  disabled={isBusy}
                  onChange={e => setInputText(e.currentTarget.value)}
                  placeholder="Ask the assistant..."
                  rows={2}
                />
              </PromptInputBody>
              <AssistantInputActions
                disabled={isBusy}
                hasText={hasDraft}
                onStop={stop}
                status={status}
              />
            </PromptInput>
          </TooltipProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
