import { createError } from '../middleware/errorHandler.js';

export async function getProfile(req, res, next) {
  try {
    const { data, error } = await req.supabase
      .from('users')
      .select('id, email, full_name, phone, role, created_at')
      .eq('id', req.user.id)
      .single();
    if (error) throw error;
    res.json({ profile: data });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { full_name, email, phone } = req.body;
    const authUpdates = {};
    const emailChangeRequested = email.toLowerCase() !== req.user.email.toLowerCase();
    if (emailChangeRequested) authUpdates.email = email;

    if (Object.keys(authUpdates).length) {
      const { error } = await req.supabase.auth.updateUser(authUpdates);
      if (error) throw createError(400, error.message || 'Account changes could not be applied. Review the details and try again.');
    }

    const { data, error } = await req.supabase
      .from('users')
      .update({ full_name, phone: phone || null })
      .eq('id', req.user.id)
      .select('id, email, full_name, phone, role, created_at')
      .single();
    if (error) throw error;

    res.json({
      profile: data,
      emailChangeRequested,
      message: emailChangeRequested
        ? 'Profile saved. Confirm the link sent to your new email address to finish changing it.'
        : 'Profile saved.',
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const { error } = await req.supabase.auth.updateUser({ password: req.body.password });
    if (error) throw createError(400, error.message || 'Password could not be updated. Review the requirements and try again.');
    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
}