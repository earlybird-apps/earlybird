import { useQueryOne } from "@triplit/react";

import { client } from "@db/client";

export const useAssignment = (props: {
  categoryId: string;
  year: number;
  month: number;
}) => {
  const assignmentQuery = client
    .query("assignments")
    .where("category_id", "=", props.categoryId)
    .where(["year", "=", props.year], ["month", "=", props.month]);

  return useQueryOne(client, assignmentQuery);
};
