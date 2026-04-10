# Supabase 데이터베이스 (Togetall)

앱이 쓰는 주요 테이블: `profiles`, `posts`, `comments`, `info_posts`, `race_events` 등.  
스키마 SQL은 [`migrations/`](./migrations/)에 있으며, **파일 이름 순서대로** 적용합니다.

---

## 프로덕션 DB (새 Supabase 프로젝트)

### 1. Supabase에서 프로젝트 만들기

1. [Supabase 대시보드](https://supabase.com/dashboard) → **New project**
2. **Organization**, **Name**, **Database password**, **Region** 선택 후 생성  
3. 생성이 끝날 때까지 대기

**여기서 정해 두면 좋은 값**

| 항목 | 어디서 보는지 | 용도 |
|------|----------------|------|
| **Project URL** | Settings → **API** → Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| **anon public** 키 | Settings → **API** → Project API keys | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **service_role** 키 | 같은 화면 (절대 브라우저·Git에 노출 금지) | 로컬에서만 `SUPABASE_SERVICE_ROLE_KEY` (동기화 스크립트) |
| **Project ref** | URL에 포함 (`https://<ref>.supabase.co`) | CLI 링크, 수동 확인 |

### 2. 스키마(SQL) 적용 — 순서 고정

**SQL Editor**에서 아래 **세 파일을 위에서부터 순서대로** 열어 전체 실행하세요.

1. [`migrations/20250406120000_init_togetall.sql`](./migrations/20250406120000_init_togetall.sql) — `profiles`, `posts`, `comments`, RLS, 가입 트리거  
2. [`migrations/20250406130000_info_hub_race_events.sql`](./migrations/20250406130000_info_hub_race_events.sql) — `info_posts`, `race_events`, `profiles.is_admin`  
3. [`migrations/20250406140000_race_events_extend.sql`](./migrations/20250406140000_race_events_extend.sql) — `race_events` 확장 컬럼, `external_uid`, 지도용 nullable 좌표  

PRD 전체 초안 스키마는 [`legacy/20260331120000_initial_schema_prd_reference.sql`](./legacy/20260331120000_initial_schema_prd_reference.sql)에 **참고용**으로만 두었습니다. 위 3개와 **겹치므로** 같은 DB에 둘 다 넣지 마세요.

### 3. Auth (배포 도메인) — 반드시 설정

Vercel 등 실제 도메인으로 배포할 때:

1. **Authentication** → **URL Configuration**
2. **Site URL**: 프로덕션 사이트 주소 (예: `https://your-app.vercel.app`)
3. **Redirect URLs**에 다음 추가 (줄바꿈으로 여러 개 가능):
   - `https://your-app.vercel.app/**`
   - 로컬 개발 시: `http://localhost:3000/**`

앱에서 `NEXT_PUBLIC_SITE_URL`을 프로덕션 URL로 두면 이메일 확인 링크가 올바른 호스트로 갑니다.

### 4. Vercel 환경 변수 (프로덕션)

Vercel 프로젝트 → **Settings** → **Environment Variables**에 예시는 다음과 같습니다.

| 이름 | 필수 | 비고 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | anon public |
| `NEXT_PUBLIC_SITE_URL` | 강력 권장 | `https://배포도메인` (슬래시 없이 루트만) |
| `NEXT_PUBLIC_KAKAO_MAP_APP_KEY` | `/races` 지도용 | [Kakao Developers](https://developers.kakao.com/)에서 Web 플랫폼에 배포 도메인 등록 |

`SUPABASE_SERVICE_ROLE_KEY`는 **Vercel에 넣지 않는 것**을 권장합니다. odcloud·roadrun 동기화는 로컬에서만 실행하세요.

### 5. 관리자 지정 (한 번)

정보 허브·대회 일정 **작성/수정**은 `profiles.is_admin = true`인 계정만 가능합니다.

1. Supabase → **Authentication** → 사용자 행에서 **UUID** 복사  
2. **SQL Editor**에서 실행 (본인 UUID로 교체):

```sql
update public.profiles
set is_admin = true
where id = 'YOUR_USER_UUID';
```

### 6. (선택) 대회 데이터 넣기

로컬 `web/.env.local`에 `SUPABASE_SERVICE_ROLE_KEY`와 Supabase URL을 넣은 뒤:

```bash
cd web && npm run sync:marathon-roadrun
```

프로덕션 DB URL·서비스 롤을 가리키도록 `.env.local`을 맞추면 같은 DB로 동기화됩니다.

---

## Supabase CLI로 적용 (`db push`)

저장소 루트에서:

```bash
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db push
```

`migrations/`에 있는 위 **3개 파일만** 자동 적용됩니다 (레거시 PRD 파일은 `legacy/`에 있어 제외).

---

## 로컬·이미 테이블이 있는 경우

`20250406*` 마이그레이션은 가능한 한 **여러 번 실행해도 되도록** 작성되어 있습니다 (`IF NOT EXISTS`, 정책 `DROP IF EXISTS` 등).

그래도 오류가 나면 Table Editor에서 `posts` / `race_events` 제약·데이터를 확인하세요.

---

## 가입 시 프로필

`auth.users`에 사용자가 생기면 트리거가 `profiles`에 한 줄을 넣습니다. 회원가입 시 `display_name`은 `raw_user_meta_data`로 저장되며 트리거가 `profiles.display_name`으로 복사합니다.

## 마이그레이션 전에 이미 가입한 사용자가 있다면

스키마 적용 후 `profiles`가 비어 있는 기존 계정이 있으면 SQL Editor에서 한 번 실행할 수 있습니다.

```sql
insert into public.profiles (id, display_name)
select u.id, nullif(trim(coalesce(u.raw_user_meta_data->>'display_name', '')), '')
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);
```
