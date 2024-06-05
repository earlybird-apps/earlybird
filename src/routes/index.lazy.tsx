// import { Button } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { client } from "../../triplit/client";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useQuery } from "@triplit/react";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const query = client.query("budgets");

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
          {Array.from(results!).map(([id, budget]) => (
            <li key={id}>{budget.name}</li>
          ))}
        </ul>
      )}
      <Button
        onClick={async () => {
          await client.insert("budgets", {
            name: `Random Budget #${getRandomInt(100)}`,
            user_id: import.meta.env.VITE_USER_ID,
          });
        }}
      >
        Add a random Budget
      </Button>
    </div>
  );
}
