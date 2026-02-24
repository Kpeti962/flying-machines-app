"use server";

import { createContactMessage } from "@/lib/api";
import { CreateContactMessageFormState } from "@/lib/types";
import { z } from "zod";

const ContactSchema = z.object({
    Name: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : value),
        z.string().min(1, "Name is required")
    ),
    Email: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : value),
        z.string().email("Invalid email")
    ),
    Message: z.preprocess(
        (value) => (typeof value === "string" ? value.trim() : value),
        z.string().min(1, "Message is required").max(1000, "Message is too long")
    ),
});

export async function createContactMessageAction(
    state: CreateContactMessageFormState,
    formData: FormData
) : Promise<CreateContactMessageFormState> {
    const validatedFields = await ContactSchema.safeParseAsync(
        {
            Name: formData.get("Name"),
            Email: formData.get("Email"),
            Message: formData.get("Message"),
        }
    );

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Bad request",
        };
    }

    try {
        await createContactMessage(validatedFields.data);
        return {
            success: "Message sent successfully",
        };
    } catch {
        return {
            message: "Failed to send message",
        };
    }
}