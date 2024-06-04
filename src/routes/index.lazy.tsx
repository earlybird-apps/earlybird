import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2 space-y-10">
      <h3 className="text-3xl font-bold">Welcome Home!</h3>
      <Input placeholder="Enter your name" />
      <Button>Say Hello</Button>
    </div>
  );
}
