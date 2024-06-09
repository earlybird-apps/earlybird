import { useQuery } from "@triplit/react";
import { client } from "@db/client";

interface QueryAssignmentsProps {
  categoryId: string;
  month: number;
  year: number;
}

export const useAssignment = (props: QueryAssignmentsProps) => {
  return useQuery(
    client,
    client
      .query("assignments")
      .where("category_id", "=", props.categoryId)
      .where("month", "=", props.month)
      .where("year", "=", props.year)
  );
};
