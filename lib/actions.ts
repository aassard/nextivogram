"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  BookmarkSchema,
  CreateComment,
  CreatePost,
  DeleteComment,
  DeletePost,
  FollowUser,
  LikeSchema,
  UpdatePost,
  UpdateUser,
} from "./schemas";

export async function createPost(values: z.infer<typeof CreatePost>) {
  const userId = await getUserId();

  const validatedFields = CreatePost.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Champs manquants. Échec de la création du message.",
    };
  }

  const { fileUrl, caption, location } = validatedFields.data;

  try {
    await prisma.post.create({
      data: {
        caption,
        location,
        fileUrl,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } catch (error) {
    return {
      message:
        "Erreur de base de données : échec de la création de la publication.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deletePost(formData: FormData) {
  const userId = await getUserId();

  const { id } = DeletePost.parse({
    id: formData.get("id"),
  });

  const post = await prisma.post.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!post) {
    throw new Error("Message introuvable");
  }

  try {
    await prisma.post.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Message supprimé." };
  } catch (error) {
    return {
      message:
        "Erreur de base de données : échec de la suppression de la publication.",
    };
  }
}

export async function likePost(value: FormDataEntryValue | null) {
  const userId = await getUserId();

  const validatedFields = LikeSchema.safeParse({ postId: value });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Champs manquants. Impossible de liker la publication.",
    };
  }

  const { postId } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Message introuvable");
  }

  const like = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (like) {
    try {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      revalidatePath("/dashboard");
      return { message: "Message non liké." };
    } catch (error) {
      return {
        message:
          "Erreur de base de données : échec de la conversion de la publication.",
      };
    }
  }

  try {
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Post liké." };
  } catch (error) {
    return {
      message:
        "Erreur de base de données : échec de la conversion de la publication.",
    };
  }
}

export async function bookmarkPost(value: FormDataEntryValue | null) {
  const userId = await getUserId();

  const validatedFields = BookmarkSchema.safeParse({ postId: value });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        "Champs manquants. Échec de la mise en signet de la publication.",
    };
  }

  const { postId } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Message introuvable.");
  }

  const bookmark = await prisma.savedPost.findUnique({
    where: {
      postId_userId: {
        postId,
        userId,
      },
    },
  });

  if (bookmark) {
    try {
      await prisma.savedPost.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
      revalidatePath("/dashboard");
      return { message: "Message sans signet." };
    } catch (error) {
      return {
        message:
          "Erreur de base de données : échec de la suppression de la publication dans vos favoris.",
      };
    }
  }

  try {
    await prisma.savedPost.create({
      data: {
        postId,
        userId,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Article marqué dans vos favoris." };
  } catch (error) {
    return {
      message:
        "Erreur de base de données : échec de la publication dans les favoris.",
    };
  }
}

export async function createComment(values: z.infer<typeof CreateComment>) {
  const userId = await getUserId();

  const validatedFields = CreateComment.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Champs manquants. Échec de la création du commentaire.",
    };
  }

  const { postId, body } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post) {
    throw new Error("Message introuvable");
  }

  try {
    await prisma.comment.create({
      data: {
        body,
        postId,
        userId,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Commentaire créé." };
  } catch (error) {
    return {
      message:
        "Erreur de base de données : échec de la création du commentaire.",
    };
  }
}

export async function deleteComment(formData: FormData) {
  const userId = await getUserId();

  const { id } = DeleteComment.parse({
    id: formData.get("id"),
  });

  const comment = await prisma.comment.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!comment) {
    throw new Error("Commentaire introuvable");
  }

  try {
    await prisma.comment.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Commentaire supprimé." };
  } catch (error) {
    return {
      message:
        "Erreur de base de données : échec de la suppression du commentaire.",
    };
  }
}

export async function updatePost(values: z.infer<typeof UpdatePost>) {
  const userId = await getUserId();

  const validatedFields = UpdatePost.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Champs manquants. Échec de la mise à jour du message.",
    };
  }

  const { id, fileUrl, caption } = validatedFields.data;

  const post = await prisma.post.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!post) {
    throw new Error("Message introuvable");
  }

  try {
    await prisma.post.update({
      where: {
        id,
      },
      data: {
        fileUrl,
        caption,
      },
    });
  } catch (error) {
    return { message: "Database Error: Échec de la mise à jour du message." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateProfile(values: z.infer<typeof UpdateUser>) {
  const userId = await getUserId();

  const validatedFields = UpdateUser.safeParse(values);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Champs manquants. Échec de la mise à jour du message.",
    };
  }

  const { bio, gender, image, name, username, website } = validatedFields.data;

  try {
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        name,
        image,
        bio,
        gender,
        website,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Profil mis à jour." };
  } catch (error) {
    return { message: "Champs manquants. Échec de la mise à jour du profil." };
  }
}

export async function followUser(formData: FormData) {
  const userId = await getUserId();

  const { id } = FollowUser.parse({
    id: formData.get("id"),
  });

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  const follows = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        // followerId is of the person who wants to follow
        followerId: userId,
        // followingId is of the person who is being followed
        followingId: id,
      },
    },
  });

  if (follows) {
    try {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: id,
          },
        },
      });
      revalidatePath("/dashboard");
      return { message: "Utilisateur non suivi." };
    } catch (error) {
      return {
        message:
          "Erreur de base de données : impossible de ne plus suivre l'utilisateur.",
      };
    }
  }

  try {
    await prisma.follows.create({
      data: {
        followerId: userId,
        followingId: id,
      },
    });
    revalidatePath("/dashboard");
    return { message: "Utilisateur suivi." };
  } catch (error) {
    return {
      message:
        "Erreur de base de données : impossible de suivre l'utilisateur.",
    };
  }
}
