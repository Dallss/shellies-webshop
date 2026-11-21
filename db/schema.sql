-- Perle & Co. shop schema. Safe to run more than once (npm run db:migrate).
--
-- The app talks to Postgres directly from the server as the owner role. Row level security is
-- switched on with no policies so Supabase's public REST API (anon key) can't read or write these
-- tables; the owner role bypasses RLS.

create table if not exists products (
  id          text primary key,
  name        text not null,
  hex         text not null,
  tint        text not null,
  price       integer not null check (price >= 0),
  stock       integer not null default 0 check (stock >= 0),
  shown       boolean not null default false,
  description text not null default '',
  image       text,
  sort        integer not null default 0,
  created_at  timestamptz not null default now()
);

create sequence if not exists order_number start 1001;

create table if not exists orders (
  id          text primary key default ('PC-' || nextval('order_number')),
  user_email  text not null,
  name        text not null,
  phone       text not null,
  city        text not null,
  address     text not null,
  payment     text not null check (payment in ('GCash', 'Cash on delivery')),
  status      text not null default 'new'
              check (status in ('new', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')),
  note        text not null default '',
  -- Snapshot of what was bought, so later price or name changes don't rewrite old orders:
  -- [{ "productId": "tide", "name": "Tide", "hex": "#4C8EF0", "price": 149, "qty": 1 }]
  items       jsonb not null,
  total       integer not null,
  created_at  timestamptz not null default now()
);
create index if not exists orders_user_email_idx on orders (user_email, created_at desc);
create index if not exists orders_created_idx on orders (created_at desc);

create table if not exists posts (
  id           text primary key default ('p-' || substr(md5(random()::text), 1, 10)),
  title        text not null default '',
  category     text not null check (category in ('News', 'New drop', 'Tips')),
  status       text not null check (status in ('published', 'draft')),
  body         text not null default '',
  published_at timestamptz,
  created_at   timestamptz not null default now()
);

alter table products enable row level security;
alter table orders   enable row level security;
alter table posts    enable row level security;

-- Seed: the six listings already in the shop, and the existing posts. Only inserted if missing.
insert into products (id, name, hex, tint, price, stock, shown, description, sort) values
  ('classic',  'Honey',    '#A1773B', '#F3E8DA', 149, 42, true, 'Golden cord with the original shell-shaped NFC tag.', 1),
  ('flamingo', 'Petal',    '#D500B4', '#FBE0F5', 149, 18, true, 'Bright pink cord, our best seller.', 2),
  ('tide',     'Tide',     '#4C8EF0', '#DCE8FD', 149, 35, true, 'Ocean-blue cord.', 3),
  ('honey',    'Sol',      '#FFD23F', '#FFF4CC', 149,  7, true, 'Sunny yellow cord.', 4),
  ('onyx',     'Onyx',     '#4A4A4A', '#E4E4E4', 149, 26, true, 'Charcoal cord that goes with everything.', 5),
  ('pearl',    'Pearl',    '#D4D4D4', '#F1F1F1', 149,  0, true, 'Soft white cord.', 6)
on conflict (id) do nothing;

insert into posts (id, title, category, status, body, published_at, created_at) values
  ('p1', 'Set up your Shellie in 2 minutes', 'Tips', 'published',
   'Open the app, tap the + button, and hold your phone to the bracelet. Then switch on the details you want a helper to see.',
   '2026-11-03 10:00+08', '2026-11-03 10:00+08'),
  ('p2', 'Meet the Signature Collection', 'New drop', 'published',
   'Six colors, one for every kind of kid. Honey, Petal, Tide, Sol, Onyx and Pearl are all ₱149 and come with the NFC tag ready to set up.',
   '2026-11-10 10:00+08', '2026-11-10 10:00+08'),
  ('p3', 'Holiday orders: last day to order', 'News', 'draft',
   'Want a Shellie under the tree? Order by [DATE] so it arrives before Christmas.',
   null, '2026-11-15 10:00+08')
on conflict (id) do nothing;

-- Listing photos: public bucket, written only by the server with the service key.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-photos', 'product-photos', true, 4194304, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Places an order atomically: checks each item is listed and in stock, takes it out of stock,
-- snapshots name/color/price, and inserts the order. Raises OUT_OF_STOCK:<productId> otherwise.
-- p_items: [{ "productId": "tide", "qty": 2 }, ...]
create or replace function place_order(
  p_email text, p_name text, p_phone text, p_city text, p_address text,
  p_payment text, p_note text, p_items jsonb
) returns text
language plpgsql
as $$
declare
  it      jsonb;
  qty     integer;
  p       products%rowtype;
  snap    jsonb := '[]'::jsonb;
  amount  integer := 0;
  new_id  text;
begin
  if jsonb_array_length(coalesce(p_items, '[]'::jsonb)) = 0 then
    raise exception 'EMPTY_CART';
  end if;

  for it in select * from jsonb_array_elements(p_items) loop
    qty := (it->>'qty')::integer;
    if qty is null or qty < 1 or qty > 50 then
      raise exception 'BAD_QTY:%', it->>'productId';
    end if;

    update products set stock = stock - qty
     where id = it->>'productId' and shown and stock >= qty
    returning * into p;
    if not found then
      raise exception 'OUT_OF_STOCK:%', it->>'productId';
    end if;

    snap := snap || jsonb_build_object('productId', p.id, 'name', p.name, 'hex', p.hex, 'price', p.price, 'qty', qty);
    amount := amount + p.price * qty;
  end loop;

  insert into orders (user_email, name, phone, city, address, payment, note, items, total)
  values (lower(p_email), p_name, p_phone, p_city, p_address, p_payment, coalesce(p_note, ''), snap, amount)
  returning id into new_id;

  return new_id;
end;
$$;

-- Only the server (service role) may call it, never the public anon key.
revoke all on function place_order(text, text, text, text, text, text, text, jsonb) from public, anon, authenticated;
grant execute on function place_order(text, text, text, text, text, text, text, jsonb) to service_role;

-- Let Supabase's REST API see the new tables and function right away.
notify pgrst, 'reload schema';

-- Until the first real order exists, keep order numbers starting at PC-1001
-- (test orders during setup used up a few numbers).
select setval('order_number', 1001, false) where not exists (select 1 from orders);
