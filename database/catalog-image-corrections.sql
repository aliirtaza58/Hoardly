-- Correct the catalog photos without replacing products or changing their URLs.
-- Only update the previously verified image values, preserving later admin edits.
begin;
update public.products p
set images = array[patch.new_url]
from (values
  ('mechanical-keyboard-tkl', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1626958390916-90be78b9bfe6?auto=format&fit=crop&w=800&q=80'),
  ('heavyweight-organic-cotton-tee', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1722310752951-4d459d28c678?auto=format&fit=crop&w=800&q=80'),
  ('ceramic-pour-over-coffee-dripper', 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1783206695207-aa4deabafa7b?auto=format&fit=crop&w=800&q=80')
) as patch(slug,old_url,new_url)
where p.slug=patch.slug and p.images=array[patch.old_url];
update public.products set name='Mechanical Keyboard TKL'
where slug='mechanical-keyboard-tkl' and name='Mechanical Mechanical Keyboard';
update public.categories
set image_url='https://images.unsplash.com/photo-1722310752951-4d459d28c678?auto=format&fit=crop&w=800&q=80'
where slug='apparel' and image_url='https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';
commit;
