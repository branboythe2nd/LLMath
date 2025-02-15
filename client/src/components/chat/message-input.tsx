import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMessageSchema, type Message } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { ImageIcon, SendIcon } from "lucide-react";
import { useState } from "react"; // <-- Import useState
import { useForm } from "react-hook-form";

interface MessageInputProps {
  onResponse: (message: Message) => void;
}

export default function MessageInput({ onResponse }: MessageInputProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertMessageSchema),
    defaultValues: {
      prompt: "",
      imageUrl: null,
    },
    mode: "onChange", // Ensures prompt validation only happens when needed
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("POST", "/api/chat", {
        prompt: data.get("prompt") || (imagePreview ? "Describe the image." : ""),
        imageUrl: imagePreview || null,
      });
      return res.json();
    },
    onSuccess: (data) => {
      onResponse(data);
      form.reset();
      setImagePreview(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data: { prompt: string }) => {
    const formData = new FormData();

    if (data.prompt.trim()) {
      formData.append("prompt", data.prompt);
    } else if (imagePreview) {
      formData.append("prompt", "Extract the text");
    } else {
      toast({
        title: "Error",
        description: "Please enter a prompt or upload an image.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Enter your prompt here (optional)..."
                  className="min-h-[100px] resize-none"
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(form.getValues());
                    }
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={handleImageUpload}
            />
            <Button type="button" variant="outline" size="icon" asChild>
              <label htmlFor="image-upload" className="cursor-pointer">
                <ImageIcon className="h-4 w-4" />
              </label>
            </Button>
          </div>

          <Button
            type="submit"
            className="ml-auto"
            disabled={mutation.isPending}
            onClick={(e) => {
              e.preventDefault(); // Prevent focusing the prompt box
              handleSubmit(form.getValues());
            }}
          >
            {mutation.isPending ? (
              "Processing..."
            ) : (
              <>
                Send
                <SendIcon className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-h-48 rounded-md object-contain"
            />
          </div>
        )}
      </form>
    </Form>
  );
}
