import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Message } from "@shared/schema";
import { Bot, ThumbsUp, ThumbsDown } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ResponseDisplayProps {
  response: Message | null;
  onResponse?: (message: Message) => void;
}

export default function ResponseDisplay({ response, onResponse }: ResponseDisplayProps) {
  const { toast } = useToast();

  const regenerateMutation = useMutation({
    mutationFn: async (data: { prompt: string; imageUrl: string | null }) => {
      const res = await apiRequest("POST", "/api/chat", data);
      return res.json();
    },
    onSuccess: (data) => {
      if (onResponse) {
        onResponse(data);
      }
      toast({
        title: "Response Regenerated",
        description: "A new response has been generated",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to regenerate response",
        variant: "destructive",
      });
    },
  });

  const sendFeedback = async (approved: boolean) => {
    if (!response) return;

    if (!approved) {
      // If disapproved, regenerate response with the same prompt
      regenerateMutation.mutate({
        prompt: response.prompt,
        imageUrl: response.imageUrl,
      });
    } else {
      // If approved, show success message
      toast({
        title: "Success",
        description: "Response approved",
        variant: "default",
      });
    }
  };

  if (!response) return null;

  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="space-y-4 flex-1">
            <p className="text-sm text-foreground/90 leading-relaxed">
              {response.response}
            </p>
            {response.imageUrl && (
              <img
                src={response.imageUrl}
                alt="Uploaded content"
                className="max-h-48 rounded-md object-contain"
              />
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendFeedback(true)}
                className="hover:bg-green-100"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendFeedback(false)}
                className="hover:bg-red-100"
                disabled={regenerateMutation.isPending}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                {regenerateMutation.isPending ? "Regenerating..." : "Disapprove"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}