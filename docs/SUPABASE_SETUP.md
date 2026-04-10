# Supabase 설정 (Togetall)

상세한 **프로덕션 DB 순서·Vercel 변수·관리자 SQL**은 [supabase/README.md](../supabase/README.md)를 기준으로 하세요.

## 요약

1. **SQL**: [`supabase/migrations/`](../supabase/migrations/)의 `20250406120000` → `20250406130000` → `20250406140000` 순으로 SQL Editor에서 실행 (또는 `supabase db push`).
2. **Auth URL**: Site URL·Redirect URLs에 배포 도메인과 `/auth/callback` 경로 포함.
3. **환경 변수**: `web/.env.example` 참고. Vercel에 `NEXT_PUBLIC_SUPABASE_*` 등록.

PRD 참고용 전체 스키마는 [supabase/legacy/20260331120000_initial_schema_prd_reference.sql](../supabase/legacy/20260331120000_initial_schema_prd_reference.sql)에만 있으며, 위 3개 마이그레이션과 **동시에 적용하지 마세요**.

트리거 문법 오류가 나면(환경에 따라 `EXECUTE PROCEDURE` vs `EXECUTE FUNCTION`), Supabase Postgres 버전에 맞게 [공식 문서](https://supabase.com/docs/guides/auth/managing-user-data)의 트리거 예시를 참고하세요.

## 이메일 확인

이메일 가입 시 확인 메일을 끄려면 **Authentication → Providers → Email**에서 “Confirm email”을 비활성화할 수 있습니다 (개발용). 운영 시에는 켜 두는 것이 좋습니다.
