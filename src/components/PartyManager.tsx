import React from 'react';
import { Users, Plus, Trash2, Building, UserCheck } from 'lucide-react';
import { PartyInput, PartyRole, PartyLegalType } from '../types';

interface PartyManagerProps {
  parties: PartyInput[];
  setParties: React.Dispatch<React.SetStateAction<PartyInput[]>>;
}

const AVAILABLE_ROLES: PartyRole[] = [
  'Discloser',
  'Recipient',
  'Landlord',
  'Tenant',
  'Employer',
  'Employee',
  'Contractor',
  'Client',
  'Service Provider',
  'Other',
];

const AVAILABLE_LEGAL_TYPES: PartyLegalType[] = [
  'Individual',
  'Corporation',
  'Limited Liability Company (LLC)',
  'Partnership',
  'Sole Proprietorship',
  'Other Legal Entity',
];

export const PartyManager: React.FC<PartyManagerProps> = ({ parties, setParties }) => {
  const addParty = () => {
    const newParty: PartyInput = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      role: 'Other',
      legal_type: 'Individual',
      address: '',
      signatory_name: '',
      signatory_title: '',
    };
    setParties((prev) => [...prev, newParty]);
  };

  const removeParty = (id: string) => {
    if (parties.length <= 1) {
      alert('A legal agreement must specify at least one party.');
      return;
    }
    setParties((prev) => prev.filter((p) => p.id !== id));
  };

  const updateParty = (id: string, field: keyof PartyInput, value: string) => {
    setParties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-amber-50 rounded-lg text-amber-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-base">Contracting Parties</h3>
            <p className="text-xs text-slate-500">
              Define the legal entities entering into this agreement ({parties.length} configured)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={addParty}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Party</span>
        </button>
      </div>

      <div className="space-y-4">
        {parties.map((party, index) => {
          const isEntity = party.legal_type !== 'Individual';

          return (
            <div
              key={party.id}
              className="p-4 rounded-lg bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-colors space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-200 text-slate-800">
                  Party {index + 1}
                </span>

                {parties.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParty(party.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Remove this party"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Party Name */}
                <div className="md:col-span-1">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={party.name}
                    onChange={(e) => updateParty(party.id, 'name', e.target.value)}
                    placeholder="e.g. Acme Innovations Corp. or Jane Doe"
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Role in Agreement <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={party.role}
                    onChange={(e) => updateParty(party.id, 'role', e.target.value as PartyRole)}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  >
                    {AVAILABLE_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Legal Entity Type */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Entity / Legal Status
                  </label>
                  <select
                    value={party.legal_type}
                    onChange={(e) => updateParty(party.id, 'legal_type', e.target.value as PartyLegalType)}
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  >
                    {AVAILABLE_LEGAL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Registered Address / Jurisdiction <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={party.address}
                    onChange={(e) => updateParty(party.id, 'address', e.target.value)}
                    placeholder="e.g. 100 Tech Blvd, Suite 400, San Francisco, CA 94105"
                    className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  />
                </div>

                {/* Entity Signatory (if Corporation, LLC, etc.) */}
                {isEntity && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
                        <UserCheck className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        Authorized Signatory Name
                      </label>
                      <input
                        type="text"
                        value={party.signatory_name || ''}
                        onChange={(e) => updateParty(party.id, 'signatory_name', e.target.value)}
                        placeholder="e.g. Michael Vance (Authorized Officer)"
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center">
                        <Building className="w-3.5 h-3.5 mr-1 text-slate-500" />
                        Officer Title
                      </label>
                      <input
                        type="text"
                        value={party.signatory_title || ''}
                        onChange={(e) => updateParty(party.id, 'signatory_title', e.target.value)}
                        placeholder="e.g. CEO, Managing Member, Director"
                        className="w-full text-xs px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 bg-white"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
