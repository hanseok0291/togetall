import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { signOut } from "@/lib/actions/auth";

const GET_USER_TIMEOUT_MS = 8_000;

export async function Header() {
  let user = null;
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const result = await Promise.race([
        supabase.auth.getUser(),
        new Promise<{ data: { user: null } }>((resolve) => {
          setTimeout(
            () => resolve({ data: { user: null } }),
            GET_USER_TIMEOUT_MS,
          );
        }),
      ]);
      user = result.data.user;
    } catch {
      user = null;
    }
  }

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Togetall
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm">
          <Link href="/posts" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            파트너·모집
          </Link>
          <Link href="/races" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
            대회일정
          </Link>
          {user ? (
            <>
              <Link
                href="/posts/new"
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                글쓰기
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
                로그인
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-full bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
