import { createError } from '../middleware/errorHandler.js';

const requiredFields = ['full_name', 'phone', 'address_line1', 'city', 'state', 'postal_code', 'country'];
function addressPayload(input) {
  const payload = {};
  for (const field of [...requiredFields, 'address_line2', 'label']) payload[field] = String(input[field] || '').trim() || null;
  for (const field of requiredFields) if (!payload[field]) throw createError(400, `${field.replaceAll('_', ' ')} is required. Please complete the address and try again.`);
  payload.label = payload.label || 'home';
  return payload;
}

export async function getAddresses(req, res, next) { try { const { data, error } = await req.supabase.from('addresses').select('*').eq('user_id', req.user.id).order('is_default', { ascending: false }); if (error) throw error; res.json({ addresses: data || [] }); } catch (error) { next(error); } }
export async function createAddress(req, res, next) { try { const { data, error } = await req.supabase.from('addresses').insert({ user_id: req.user.id, ...addressPayload(req.body) }).select().single(); if (error) throw error; res.status(201).json({ address: data }); } catch (error) { next(error); } }
export async function updateAddress(req, res, next) { try { const id = Number.parseInt(req.params.id, 10); if (!Number.isInteger(id)) throw createError(400, 'Address could not be identified.'); const { data, error } = await req.supabase.from('addresses').update(addressPayload(req.body)).eq('id', id).eq('user_id', req.user.id).select().single(); if (error || !data) throw createError(404, 'Address not found.'); res.json({ address: data }); } catch (error) { next(error); } }
export async function deleteAddress(req, res, next) { try { const id = Number.parseInt(req.params.id, 10); if (!Number.isInteger(id)) throw createError(400, 'Address could not be identified.'); const { error } = await req.supabase.from('addresses').delete().eq('id', id).eq('user_id', req.user.id); if (error) throw error; res.json({ message: 'Address deleted.' }); } catch (error) { next(error); } }
