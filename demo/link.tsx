import type { ComponentProps } from "react";
import { publicHref, useRouter } from "./navigation";

export default function Link({ href, ...props }: Omit<ComponentProps<"a">, "href"> & { href: string }) {
  const router = useRouter();
  return <a {...props} href={publicHref(href)} onClick={(event) => {
    props.onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    router.push(href);
  }} />;
}
