import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { accountService } from '../services/account.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Alert } from '../components/common/Alert.jsx';
import { Button } from '../components/common/Button.jsx';
import { Spinner } from '../components/common/Spinner.jsx';
import { FormField } from '../components/common/FormField.jsx';
import { Input } from '../components/common/Input.jsx';

const emptyProfile = { full_name: '', email: '', phone: '' };
const emptyAddress = { label: 'home', full_name: '', phone: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: '', is_default: false };
const addressFields = [
  ['label', 'Label'], ['full_name', 'Full name'], ['phone', 'Phone'],
  ['address_line1', 'Address line 1'], ['address_line2', 'Address line 2'],
  ['city', 'City'], ['state', 'State or province'], ['postal_code', 'Postal code'], ['country', 'Country'],
];

export function ProfilePage() {
  const { isAuthenticated, isLoading: authLoading, syncProfile } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(emptyProfile);
  const [password, setPassword] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [addressDraft, setAddressDraft] = useState(emptyAddress);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteAddressId, setDeleteAddressId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login', { replace: true, state: { from: { pathname: '/account' } } });
  }, [authLoading, isAuthenticated, navigate]);

  const refreshAddresses = async () => {
    const response = await accountService.getAddresses();
    setAddresses(response.addresses || []);
  };

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    let active = true;
    Promise.all([accountService.getProfile(), accountService.getAddresses()])
      .then(([profileResponse, addressResponse]) => {
        if (!active) return;
        setProfile(profileResponse.profile);
        setAddresses(addressResponse.addresses || []);
      })
      .catch((requestError) => { if (active) setError(requestError.message || 'Your account could not be loaded. Try again.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [isAuthenticated]);

  const saveProfile = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSavingProfile(true);
    try {
      const response = await accountService.updateProfile(profile);
      const updatedProfile = { ...response.profile, email: response.emailChangeRequested ? profile.email : response.profile.email };
      setProfile(updatedProfile);
      syncProfile(response.profile);
      setMessage(response.message);
    } catch (requestError) {
      setError(requestError.message || 'Your profile could not be saved. Review the details and try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSavingProfile(true);
    try {
      await accountService.updatePassword(password);
      setPassword('');
      setMessage('Password updated. Use the new password the next time you sign in.');
    } catch (requestError) {
      setError(requestError.message || 'Your password could not be updated. Review the requirements and try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const saveAddress = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSavingAddress(true);
    try {
      if (editingAddress) await accountService.updateAddress(editingAddress, addressDraft);
      else await accountService.createAddress(addressDraft);
      await refreshAddresses();
      setAddressDraft(emptyAddress);
      setEditingAddress(null);
      setMessage(editingAddress ? 'Address updated.' : 'Address saved.');
    } catch (requestError) {
      setError(requestError.message || 'This address could not be saved. Review the details and try again.');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const editAddress = (address) => {
    setEditingAddress(address.id);
    setAddressDraft(Object.fromEntries(Object.keys(emptyAddress).map((key) => [key, address[key] ?? emptyAddress[key]])));
  };

  const makeDefault = async (id) => {
    setError('');
    try {
      await accountService.setDefaultAddress(id);
      await refreshAddresses();
      setMessage('Default address updated.');
    } catch (requestError) {
      setError(requestError.message || 'The default address could not be changed. Try again.');
    }
  };

  const removeAddress = async (id) => {
    setError('');
    try {
      await accountService.deleteAddress(id);
      await refreshAddresses();
      setDeleteAddressId(null);
      setMessage('Address removed.');
    } catch (requestError) {
      setError(requestError.message || 'This address could not be removed. Try again.');
    }
  };

  if (authLoading || isLoading) return <div className="flex min-h-96 items-center justify-center" role="status"><Spinner size="lg" /><span className="ml-3 text-ink-2">Loading account...</span></div>;
  if (!isAuthenticated) return null;

  const sectionClass = 'grid grid-cols-1 gap-6 border-t border-ink pt-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10';
  const selectClass = 'block min-h-touch w-full rounded-control border border-line-strong bg-paper px-3.5 py-2.5 text-ink hover:border-ink';

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink pb-6">
        <h1 className="text-section">Profile and addresses</h1>
        <Link to="/orders" className="link inline-flex min-h-touch items-center text-sm">View order history</Link>
      </div>
      {error && <Alert variant="error" className="mt-6">{error}</Alert>}
      {message && <Alert variant="success" className="mt-6">{message}</Alert>}

      <div className="mt-8 space-y-10">
        <section aria-labelledby="profile-heading" className={sectionClass}>
          <h2 id="profile-heading" className="text-title">Profile details</h2>
          <form onSubmit={saveProfile} className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
            {[['full_name', 'Full name', 'name'], ['email', 'Email address', 'email'], ['phone', 'Phone', 'tel']].map(([field, label, autoComplete]) => <FormField key={field} id={`profile-${field}`} label={label} required={field !== 'phone'}><Input name={field} type={field === 'email' ? 'email' : 'text'} autoComplete={autoComplete} value={profile[field] || ''} onChange={(event) => setProfile((current) => ({ ...current, [field]: event.target.value }))} /></FormField>)}
            <div className="sm:col-span-2"><Button type="submit" isLoading={isSavingProfile} className="min-h-touch">Save profile</Button></div>
          </form>
        </section>

        <section aria-labelledby="password-heading" className={sectionClass}>
          <h2 id="password-heading" className="text-title">Change password</h2>
          <form onSubmit={savePassword} className="max-w-lg">
            <FormField id="profile-new-password" label="New password" required helperText="Use at least 8 characters, with an uppercase letter, a lowercase letter, and a number."><Input name="password" type="password" autoComplete="new-password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} /></FormField>
            <Button type="submit" variant="secondary" isLoading={isSavingProfile} className="mt-4 min-h-touch">Update password</Button>
          </form>
        </section>

        <section aria-labelledby="addresses-heading" className={sectionClass}>
          <h2 id="addresses-heading" className="text-title">Saved addresses</h2>
          <div className="min-w-0 max-w-3xl">
            {addresses.length === 0 && <p className="text-ink-2">No saved addresses yet.</p>}
            {addresses.length > 0 && <div className="ruled">{addresses.map((address) => <article key={address.id} className="py-4">
              <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><p className="flex flex-wrap items-center gap-2 font-semibold capitalize text-ink">{address.label}{address.is_default && <span className="tag normal-case">Default</span>}</p><p className="mt-2 text-sm leading-6 text-ink-2">{address.full_name}<br />{address.address_line1}{address.address_line2 ? `, ${address.address_line2}` : ''}<br />{address.city}, {address.state} {address.postal_code}<br />{address.country}<br />{address.phone}</p></div>
                <div className="flex flex-wrap gap-x-4"><Button variant="link" size="sm" onClick={() => editAddress(address)} className="min-h-touch">Edit</Button>{!address.is_default && <Button variant="link" size="sm" onClick={() => makeDefault(address.id)} className="min-h-touch">Set default</Button>}<Button variant="link" size="sm" onClick={() => setDeleteAddressId(address.id)} className="min-h-touch text-ink-2">Remove</Button></div></div>
              {deleteAddressId === address.id && <div className="mt-3 border-t border-rule-2 pt-3"><p className="text-sm text-ink-2">Remove this saved address?</p><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" onClick={() => removeAddress(address.id)} className="min-h-touch">Remove address</Button><Button variant="secondary" size="sm" onClick={() => setDeleteAddressId(null)} className="min-h-touch">Keep address</Button></div></div>}
            </article>)}</div>}

            <form onSubmit={saveAddress} className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-title">{editingAddress ? 'Edit address' : 'Add an address'}</h3>{editingAddress && <Button type="button" variant="link" size="sm" onClick={() => { setEditingAddress(null); setAddressDraft(emptyAddress); }} className="min-h-touch">Cancel edit</Button>}</div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{addressFields.map(([field, label]) => field === 'label'
                ? <label key={field} className="block text-sm font-semibold text-ink">{label}<select value={addressDraft.label} onChange={(event) => setAddressDraft((current) => ({ ...current, label: event.target.value }))} className={`mt-1.5 ${selectClass}`}><option value="home">Home</option><option value="work">Work</option><option value="other">Other</option></select></label>
                : <FormField key={field} id={`address-${field}`} label={label} required={field !== 'address_line2'} className={field === 'address_line1' || field === 'address_line2' ? 'sm:col-span-2' : ''}><Input name={field} value={addressDraft[field] || ''} onChange={(event) => setAddressDraft((current) => ({ ...current, [field]: event.target.value }))} /></FormField>)}</div>
              <label className="mt-4 flex min-h-touch items-center gap-2 text-ink"><input type="checkbox" checked={addressDraft.is_default} onChange={(event) => setAddressDraft((current) => ({ ...current, is_default: event.target.checked }))} className="h-4 w-4 accent-ink" />Set as default address</label>
              <Button type="submit" isLoading={isSavingAddress} className="mt-4 min-h-touch">{editingAddress ? 'Save address' : 'Add address'}</Button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}