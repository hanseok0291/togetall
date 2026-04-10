import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { redirect } from "next/navigation";

type HomeProps = {
  searchParams: Promise<{ code?: string; next?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const sp = await searchParams;
  if (typeof sp.code === "string" && sp.code.length > 0) {
    const qs = new URLSearchParams({ code: sp.code });
    if (typeof sp.next === "string" && sp.next.length > 0) {
      qs.set("next", sp.next);
    }
    redirect(`/auth/callback?${qs.toString()}`);
  }

  let user: { id: string } | null = null;
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user: u },
    } = await supabase.auth.getUser();
    user = u;
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">Togetall</h1>
      <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
        함께 운동할 파트너와 러닝 크루를 찾고, 운동 이야기를 나누는 커뮤니티입니다.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/posts"
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          글 보기
        </Link>
        <Link
          href="/races"
          className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          대회 일정
        </Link>
        {user ? (
          <Link
            href="/posts/new"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            글쓰기
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            로그인
          </Link>
        )}
      </div>
    </div>
  );
}
