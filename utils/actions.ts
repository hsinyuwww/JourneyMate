// utils/actions.ts
"use server";
import { profileSchema } from "./schemas";
import db from './db';
import { auth, clerkClient, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const createProfileAction = async (
  prevState: any,
  formData: FormData
) => {
  try {
    const user = await currentUser();
    if (!user) throw new Error('Please login to create a profile');
    console.log("User data:", {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      imageUrl: user.imageUrl,
    });

    const rawData = Object.fromEntries(formData);
    console.log("Raw form data:", rawData);

    const validatedFields = profileSchema.parse(rawData);
    console.log("Validated fields:", validatedFields);

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "",
        ...validatedFields,
      },
    });
    await clerkClient.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : 'An error occurred',
    };
  }
  redirect('/');
};