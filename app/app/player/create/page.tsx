import { CreatePlayerForm } from "@/components";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "BTC-game | player creation",
  description: "Player creation of BTC price guessing game.",
};

function create() {
  const cookieStore = cookies();
  const player = cookieStore.get("player");

  if (player) redirect("/");

  return (
    <main className="flex flex-col grow items-center p-4">
      <div className="flex grow flex-col gap-2 items-center font-mono text-sm">
        <CreatePlayerForm />
      </div>
    </main>
  );
}

export default create;
