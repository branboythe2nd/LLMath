import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MessageInput from "@/components/chat/message-input";
import ResponseDisplay from "@/components/chat/response-display";
import { useState } from "react";
import { Message } from "@shared/schema";

export default function Home() {
  const [currentResponse, setCurrentResponse] = useState<Message | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              AI Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <MessageInput onResponse={setCurrentResponse} />
            <ResponseDisplay 
              response={currentResponse} 
              onResponse={setCurrentResponse}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}