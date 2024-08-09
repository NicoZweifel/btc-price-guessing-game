import { createPlayer } from "@/app/actions/player";
import Button from "@/components/Button";
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
          <form action={createPlayer}>
            <label
              htmlFor="player"
              className="text-xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
              Player name:
            </label>
            <input
              type="text"
              name="player"
              className="mt-2 border text-sm rounded-lg  block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-gray-900 focus:border-gray-900"
              placeholder="John"
              required
            />
            <div className="flex justify-end">
              <Button type="submit" className="mt-6 px-4 text-sm">
                Play
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default create;
