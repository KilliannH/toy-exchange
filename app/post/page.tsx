import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PostToyForm from "./PostToyForm";

export default async function PostPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login"); // 🔒 si pas connecté
  }

  // passe l'id user au composant client
  return <PostToyForm userId={session.user.id} />;
}