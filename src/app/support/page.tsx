"use client";

import { useLanguage } from "@/lib/i18n";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitSupportRequest } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(2, "Subject is required."),
  message: z.string().min(10, "Message must be at least 10 characters long."),
});

type FormValues = z.infer<typeof formSchema>;

export default function SupportPage() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      subject: "",
      message: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: FormValues) {
    const result = await submitSupportRequest(values);

    if (result.success) {
      toast({
        title: "Request Submitted!",
        description: "We've received your message and will get back to you soon.",
      });
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: result.error || "An unknown error occurred.",
      });
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-headline font-bold tracking-tight">{t('support')}</h1>
        <p className="text-muted-foreground">{t('supportDescription')}</p>
      </div>
      <Card className="shadow-lg border-white/40">
        <CardHeader>
            <CardTitle className="font-headline">{t('contactSupport')}</CardTitle>
            <CardDescription>{t('contactSupportDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email')}</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('subject')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('subjectPlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('message')}</FormLabel>
                    <FormControl>
                      <Textarea rows={6} placeholder={t('messagePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('sendMessage')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
