import React, { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { adminService } from '../../services/admin.js';
import { Alert } from '../../components/common/Alert.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Spinner } from '../../components/common/Spinner.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

const emptyDiscount = { code: '', type: 'percentage', value: '', min_order_amount: '', max_uses: '', expires_at: '', is_active: true };

const control = 'mt-1.5 block w-full min-h-touch rounded-control border border-line-strong bg-paper px-3 py-2 text-base font-normal text-ink transition-colors hover:border-ink focus:border-ink';
const labelClass = 'block text-sm font-semibold text-ink';
const th = 'py-3 pr-4 text-sm font-normal text-muted';

export function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState([]);
  const [form, setForm] = useState(emptyDiscount);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const response = await adminService.getDiscounts();
    setDiscounts(response.discounts || []);
  };

  useEffect(() => {
    let active = true;
    adminService.getDiscounts()
      .then((response) => { if (active) setDiscounts(response.discounts || []); })
      .catch((requestError) => { if (active) setError(requestError.message || 'Discount codes could not be loaded.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSaving(true);
    const payload = {
      ...form,
      code: form.code.trim().toUpperCase(),
      value: Number(form.value),
      min_order_amount: form.min_order_amount === '' ? null : Number(form.min_order_amount),
      max_uses: form.max_uses === '' ? null : Number(form.max_uses),
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
    };
    try {
      if (editingId) await adminService.updateDiscount(editingId, payload);
      else await adminService.createDiscount(payload);
      await load();
      setForm(emptyDiscount);
      setEditingId(null);
      setMessage(editingId ? 'Discount code updated.' : 'Discount code created.');
    } catch (requestError) {
      setError(requestError.message || 'Discount code could not be saved.');
    } finally {
      setIsSaving(false);
    }
  };

  const edit = (discount) => {
    setEditingId(discount.id);
    setForm({
      code: discount.code,
      type: discount.type,
      value: String(discount.value),
      min_order_amount: discount.min_order_amount == null ? '' : String(discount.min_order_amount),
      max_uses: discount.max_uses == null ? '' : String(discount.max_uses),
      expires_at: discount.expires_at ? new Date(discount.expires_at).toISOString().slice(0, 16) : '',
      is_active: discount.is_active,
    });
  };

  const remove = async (discount) => {
    if (!window.confirm(`Remove discount code ${discount.code}?`)) return;
    setError('');
    try {
      await adminService.deleteDiscount(discount.id);
      await load();
      setMessage(`Discount code ${discount.code} removed.`);
    } catch (requestError) {
      setError(requestError.message || 'Discount code could not be removed.');
    }
  };

  const change = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  return (
    <div>
      <div className="border-b border-ink pb-5"><h1 className="text-section font-bold text-ink">Discount codes</h1></div>
      {error && <Alert variant="error" className="mt-5">{error}</Alert>}{message && <Alert variant="success" className="mt-5">{message}</Alert>}
      <form onSubmit={submit} className="well mt-6 grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2 xl:col-span-3"><h2 className="text-title font-bold text-ink">{editingId ? 'Edit code' : 'Create code'}</h2>{editingId && <Button type="button" variant="link" size="sm" className="min-h-touch" onClick={() => { setForm(emptyDiscount); setEditingId(null); }}>Cancel edit</Button>}</div>
        <label className={labelClass}>Code<input required minLength="3" maxLength="40" value={form.code} onChange={(event) => change('code', event.target.value.toUpperCase())} className={`${control} font-mono`} /></label>
        <label className={labelClass}>Discount type<select value={form.type} onChange={(event) => change('type', event.target.value)} className={control}><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select></label>
        <label className={labelClass}>{form.type === 'percentage' ? 'Percent' : 'Amount'}<input required type="number" min="0.01" step="0.01" max={form.type === 'percentage' ? '100' : undefined} value={form.value} onChange={(event) => change('value', event.target.value)} className={control} /></label>
        <label className={labelClass}>Minimum order amount<input type="number" min="0" step="0.01" value={form.min_order_amount} onChange={(event) => change('min_order_amount', event.target.value)} className={control} /></label>
        <label className={labelClass}>Maximum uses<input type="number" min="1" step="1" value={form.max_uses} onChange={(event) => change('max_uses', event.target.value)} className={control} /></label>
        <label className={labelClass}>Expires at<input type="datetime-local" value={form.expires_at} onChange={(event) => change('expires_at', event.target.value)} className={control} /></label>
        <label className="flex min-h-touch items-center gap-2 self-end text-sm font-semibold text-ink"><input type="checkbox" checked={form.is_active} onChange={(event) => change('is_active', event.target.checked)} className="h-4 w-4 accent-ink" />Active</label>
        <div className="sm:col-span-2 xl:col-span-3"><Button type="submit" isLoading={isSaving} className="min-h-touch">{editingId ? 'Save code' : 'Create code'}</Button></div>
      </form>
      {isLoading ? <div className="flex min-h-36 items-center justify-center"><Spinner /></div> : <div role="region" aria-label="Discount codes" tabIndex={0} className="relative mt-10 overflow-x-auto"><table className="w-full min-w-[50rem] text-left text-sm"><thead><tr className="border-b border-ink"><th className={th}>Code</th><th className={`${th} text-right`}>Offer</th><th className={`${th} text-right`}>Usage</th><th className={th}>Expires</th><th className={th}>Status</th><th className="py-3 text-right text-sm font-normal text-muted">Actions</th></tr></thead><tbody>{discounts.map((discount) => <tr key={discount.id} className="border-b border-rule"><td className="py-3 pr-4 font-mono font-semibold text-ink">{discount.code}</td><td className="py-3 pr-4 text-right tabular-nums text-ink-2">{discount.type === 'percentage' ? `${discount.value}%` : formatCurrency(discount.value)}{discount.min_order_amount != null && <span className="block text-xs text-muted">Min. {formatCurrency(discount.min_order_amount)}</span>}</td><td className="py-3 pr-4 text-right font-mono text-ink-2">{discount.current_uses}{discount.max_uses == null ? '' : ` / ${discount.max_uses}`}</td><td className="py-3 pr-4 tabular-nums text-ink-2">{discount.expires_at ? formatDate(discount.expires_at) : 'No expiry'}</td><td className="py-3 pr-4"><span className={discount.is_active ? 'tag tag-in' : 'tag tag-out'}>{discount.is_active ? 'Active' : 'Inactive'}</span></td><td className="py-1 text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="sm" className="min-h-touch" aria-label={`Edit ${discount.code}`} onClick={() => edit(discount)}><Pencil className="h-4 w-4" aria-hidden="true" />Edit</Button><Button variant="ghost" size="sm" className="min-h-touch" aria-label={`Remove ${discount.code}`} onClick={() => remove(discount)}><Trash2 className="h-4 w-4" aria-hidden="true" />Remove</Button></div></td></tr>)}{discounts.length === 0 && <tr><td colSpan="6" className="py-6 text-center text-ink-2">No discount codes yet.</td></tr>}</tbody></table></div>}
    </div>
  );
}
