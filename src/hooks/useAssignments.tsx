import { client } from "@db/client";
import { and, or } from "@triplit/db";
import { useQuery } from "@triplit/react";

export const useAssignments = (props: {
  categoryId: string;
  year: number;
  month: number;
}) => {
  const assignmentQuery = client
    .query("assignments")
    .where("category_id", "=", props.categoryId)
    .where(
      or([
        ["year", "<", props.year],
        and([
          ["year", "=", props.year],
          ["month", "<=", props.month],
        ]),
      ])
    );

  return useQuery(client, assignmentQuery);
};
