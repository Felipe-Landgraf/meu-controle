import { useSyncExternalStore } from "react";

const locationChange = "meu-controle:location";

function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener(locationChange, callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener(locationChange, callback);
  };
}

export function useLocation() {
  return new URL(useSyncExternalStore(subscribe, () => window.location.href));
}

export function usePathname() {
  return useLocation().searchParams.get("tela") === "movimentacoes" ? "/movimentacoes" : "/";
}

export function publicHref(href: string) {
  const target = new URL(href, window.location.origin);
  if (target.pathname === "/movimentacoes") target.searchParams.set("tela", "movimentacoes");
  return window.location.pathname + target.search + target.hash;
}

function navigate(href: string, replace: boolean, scroll: boolean) {
  const target = publicHref(href);
  if (target === window.location.pathname + window.location.search + window.location.hash) return;
  if (replace) window.history.replaceState(null, "", target);
  else window.history.pushState(null, "", target);
  window.dispatchEvent(new Event(locationChange));
  if (scroll) window.scrollTo(0, 0);
}

const router = {
  push(href: string) { navigate(href, false, true); },
  replace(href: string, options?: { scroll?: boolean }) { navigate(href, true, options?.scroll ?? true); },
  refresh() { window.dispatchEvent(new Event(locationChange)); },
};

export function useRouter() { return router; }
