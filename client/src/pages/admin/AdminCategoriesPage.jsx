import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { adminService } from '../../services/admin.js';
import { Alert } from '../../components/common/Alert.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';

const emptyCategory = { name: '', slug: '', description: '', image_url: '', parent_id: '' };

const control = 'mt-1.5 block w-full min-h-touch rounded-control border border-line-strong bg-paper px-3 py-2 text-base font-normal text-ink transition-colors hover:border-ink focus:border-ink';
const labelClass = 'block text-sm font-semibold text-ink';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyCategory);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const response = await adminService.getCategories();
    setCategories(response.categories || []);
  };

  useEffect(() => {
    let active = true;
    adminService.getCategories()
      .then((response) => { if (active) setCategories(response.categories || []); })
      .catch((requestError) => { if (active) setError(requestError.message || 'Categories could not be loaded.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSaving(true);
    const payload = { ...form, description: form.description || null, image_url: form.image_url || null, parent_id: form.parent_id ? Number(form.parent_id) : null };
    try {
      if (editingId) await adminService.updateCategory(editingId, payload);
      else await adminService.createCategory(payload);
      await load();
      setForm(emptyCategory);
      setEditingId(null);
      setMessage(editingId ? 'Category updated.' : 'Category created.');
    } catch (requestError) {
      setError(requestError.message || 'Category could not be saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (category) => {
    if (!window.confirm(`Remove ${category.name}?`)) return;
    setError('');
    try {
      await adminService.deleteCategory(category.id);
      await load();
      setMessage('Category removed.');
    } catch (requestError) {
      setError(requestError.message || 'Category could not be removed.');
    }
  };

  return (
    <div>
      <div className="border-b border-ink pb-5"><h1 className="text-section font-bold text-ink">Categories</h1></div>
      {error && <Alert variant="error" className="mt-5">{error}</Alert>}{message && <Alert variant="success" className="mt-5">{message}</Alert>}
      <form onSubmit={submit} className="well mt-6 grid gap-4 p-5 sm:grid-cols-2 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2"><h2 className="text-title font-bold text-ink">{editingId ? 'Edit category' : 'Add category'}</h2>{editingId && <Button type="button" variant="link" size="sm" className="min-h-touch" onClick={() => { setForm(emptyCategory); setEditingId(null); }}>Cancel edit</Button>}</div>
        <label className={labelClass}>Name<input required minLength="2" maxLength="100" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className={control} /></label>
        <label className={labelClass}>URL slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} className={control} /></label>
        <label className={labelClass}>Image URL<input type="url" value={form.image_url} onChange={(event) => setForm((current) => ({ ...current, image_url: event.target.value }))} className={control} /></label>
        <label className={labelClass}>Parent category<select value={form.parent_id} onChange={(event) => setForm((current) => ({ ...current, parent_id: event.target.value }))} className={control}><option value="">None</option>{categories.filter((category) => category.id !== editingId).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label className={`${labelClass} sm:col-span-2`}>Description<textarea rows="2" maxLength="2000" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className={control} /></label>
        <div className="sm:col-span-2"><Button type="submit" isLoading={isSaving} className="min-h-touch">{editingId ? 'Save category' : 'Create category'}</Button></div>
      </form>
      {isLoading ? <div className="flex min-h-36 items-center justify-center"><Spinner /></div> : <div role="region" aria-label="Categories" tabIndex={0} className="relative mt-10 overflow-x-auto"><table className="w-full min-w-[36rem] text-left text-sm"><thead><tr className="border-b border-ink"><th className="py-3 pr-4 text-sm font-normal text-muted">Category</th><th className="py-3 pr-4 text-sm font-normal text-muted">Slug</th><th className="py-3 pr-4 text-right text-sm font-normal text-muted">Products</th><th className="py-3 text-right text-sm font-normal text-muted">Actions</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id} className="border-b border-rule"><td className="py-3 pr-4 font-semibold text-ink">{category.name}</td><td className="py-3 pr-4 font-mono text-xs text-ink-2">/{category.slug}</td><td className="py-3 pr-4 text-right font-mono text-ink-2">{category.product_count}</td><td className="py-1 text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="sm" className="min-h-touch" aria-label={`Edit ${category.name}`} onClick={() => { setForm({ name: category.name, slug: category.slug, description: category.description || '', image_url: category.image_url || '', parent_id: category.parent_id || '' }); setEditingId(category.id); }}><Pencil className="h-4 w-4" aria-hidden="true" />Edit</Button><Button variant="ghost" size="sm" className="min-h-touch" aria-label={`Remove ${category.name}`} onClick={() => remove(category)}><Trash2 className="h-4 w-4" aria-hidden="true" />Remove</Button></div></td></tr>)}{categories.length === 0 && <tr><td colSpan="4" className="py-6 text-center text-ink-2">No categories yet.</td></tr>}</tbody></table></div>}
    </div>
  );
}
