// import { Button } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { client } from "@/triplit/client";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@triplit/react";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const query = client.query("todos");

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function Index() {
  const { results, fetching } = useQuery(client, query);

  return (
    <div className="p-2 space-y-10">
      <h3 className="text-3xl font-bold">Welcome Home!</h3>
      {fetching ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {/* TODO: Remove ! */}
          {Array.from(results!).map(([id, todo]) => (
            <li key={id}>{todo.title}</li>
          ))}
        </ul>
      )}
      <Button
        onClick={async () => {
          await client.insert("todos", {
            title: `Random To Do #${getRandomInt(100)}`,
            description: "This is a random To Do",
          });
        }}
      >
        Add a random To Do
      </Button>
    </div>
  );
}
