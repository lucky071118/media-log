import { AuthCard } from "@/components/auth-card";
import { signIn } from "../actions";

export default function AdminPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 py-10 md:px-10">
      <AuthCard action={signIn} />
    </div>
  );
}
