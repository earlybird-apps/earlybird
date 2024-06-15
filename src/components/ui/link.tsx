/**
 * TODO: Update this component to use your client-side framework's link
 * component. We've provided examples of how to do this for Next.js, Remix, and
 * Inertia.js in the Catalyst documentation:
 *
 * https://catalyst.tailwindui.com/docs#client-side-router-integration
 */

import * as Headless from "@headlessui/react";
import { Link as TanStackLink, type LinkProps } from "@tanstack/react-router";
import React from "react";

export const Link = React.forwardRef(function Link(
  props: {
    href: LinkProps["to"];
    className?: string;
    tabIndex?: number;
  } & Omit<LinkProps, "to">,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <TanStackLink {...props} to={props.href} ref={ref} />
    </Headless.DataInteractive>
  );
});
