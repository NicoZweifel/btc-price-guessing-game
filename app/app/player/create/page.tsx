import { CreatePlayerForm } from "@/components";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function create() {
  const cookieStore = cookies();
  const player = cookieStore.get("player");

  if (player) redirect("/");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex grow w-full flex-col gap-2 max-w-5xl items-center justify-between font-mono text-sm">
        <div className="block max-w-sm p-6 border rounded-lg shadow bg-gray-800 border-gray-700">
          <CreatePlayerForm />
        </div>
      </div>
    </main>
  );
}

export default create;
