import { Button } from "../components/ui/button";
import { Avatar } from "../components/ui/avatar";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 shadow bg-white">
      <h1 className="text-xl font-semibold">My Classroom</h1>
      <div className="flex gap-4 items-center">
        <Button variant="outline">Join Class</Button>
        <Avatar>
          {/* Avatar user */}
        </Avatar>
      </div>
    </header>
  );
}