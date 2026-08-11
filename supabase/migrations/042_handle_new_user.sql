-- ============================================================================
-- Migration 042: handle_new_user trigger + backfill
-- Every auth signup gets a public.users profile row. The missing rows have
-- caused: duplicate Stripe customers per purchase (checkout can't find
-- stripe_customer_id), credential identity resolution falling through to the
-- Stripe payer record, and empty /account profile data.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(TRIM(COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      ''
    )), '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill profile rows for every existing auth user without one
INSERT INTO public.users (id, email, name)
SELECT
  au.id,
  au.email,
  NULLIF(TRIM(COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    ''
  )), '')
FROM auth.users au
LEFT JOIN public.users u ON u.id = au.id
WHERE u.id IS NULL
  AND au.email IS NOT NULL;
