create table if not exists public.business_posts (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  content     text not null,
  image_url   text,
  source      text not null default 'manual',
  created_at  timestamptz not null default now()
);

create index if not exists business_posts_business_id_idx on public.business_posts(business_id);
create index if not exists business_posts_created_at_idx on public.business_posts(created_at desc);
