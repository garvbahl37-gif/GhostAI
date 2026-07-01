"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

/**
 * Nav auth control: a "Sign in" button (opens the Clerk modal) when signed out,
 * and the Clerk user avatar/menu when signed in. Replaces the old UserMenu.
 */
export function AuthButtons() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <span className="h-9 w-9 animate-pulse rounded-xl bg-slate-100" aria-hidden />;
  }

  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <button className="rounded-xl px-3.5 py-2 text-sm font-medium text-black transition hover:bg-slate-100">
          Sign in
        </button>
      </SignInButton>
    );
  }

  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "h-9 w-9 rounded-xl",
          userButtonPopoverCard:
            "rounded-2xl border border-slate-200 shadow-[0_20px_70px_-25px_rgba(30,20,70,0.18)]",
        },
      }}
    />
  );
}
