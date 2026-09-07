-- Allow uploads to the public "product-images" bucket.
-- Admin (authenticated) uploads product photos; guests (anon) may attach review photos.
-- Downloads are public (bucket is public). Update/Delete stay owner/authenticated only.

alter table storage.objects enable row level security;

do $$
begin
  if not exists (select 1 from pg_policy where polname = 'product_images_read' and polrelid = 'storage.objects'::regclass) then
    create policy product_images_read on storage.objects
      for select to anon, authenticated
      using (bucket = 'product-images');
  end if;

  if not exists (select 1 from pg_policy where polname = 'product_images_insert' and polrelid = 'storage.objects'::regclass) then
    create policy product_images_insert on storage.objects
      for insert to anon, authenticated
      with check (bucket = 'product-images');
  end if;

  if not exists (select 1 from pg_policy where polname = 'product_images_update' and polrelid = 'storage.objects'::regclass) then
    create policy product_images_update on storage.objects
      for update to authenticated
      using (bucket = 'product-images')
      with check (bucket = 'product-images');
  end if;

  if not exists (select 1 from pg_policy where polname = 'product_images_delete' and polrelid = 'storage.objects'::regclass) then
    create policy product_images_delete on storage.objects
      for delete to authenticated
      using (bucket = 'product-images');
  end if;
end $$;

grant usage on schema storage to anon, authenticated;
grant select, insert on storage.objects to anon, authenticated;
grant update, delete on storage.objects to authenticated;
