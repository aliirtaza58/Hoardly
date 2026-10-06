-- Trigger functions run through their triggers and are not public RPC endpoints.
alter function public.handle_updated_at() set search_path = public;
alter function public.is_admin() set search_path = public;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.sync_user_email() from public, anon, authenticated;
revoke execute on function public.handle_updated_at() from public, anon, authenticated;
revoke execute on function public.refresh_product_rating() from public, anon, authenticated;
revoke execute on function public.restore_cancelled_order_stock() from public, anon, authenticated;

-- Supabase default grants can explicitly grant anon access even after PUBLIC
-- is revoked. These RPCs require a signed-in user and validate ownership/role.
revoke execute on function public.place_order(jsonb, text) from public, anon;
revoke execute on function public.set_default_address(integer) from public, anon;
revoke execute on function public.get_admin_stats() from public, anon;
grant execute on function public.place_order(jsonb, text) to authenticated;
grant execute on function public.set_default_address(integer) to authenticated;
grant execute on function public.get_admin_stats() to authenticated;

-- Catalog RLS policies call this helper for both anonymous and signed-in reads.
-- It only returns whether auth.uid() owns an administrator profile.
revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;
