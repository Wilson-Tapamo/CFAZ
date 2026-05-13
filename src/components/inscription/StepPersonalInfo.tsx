import React from 'react';
import { User, MapPin, Phone, Calendar, Globe, Camera } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  data: any;
  onChange: (field: string, value: any) => void;
}

const regions = ['Adamaoua','Centre','Est','Extrême-Nord','Littoral','Nord','Nord-Ouest','Ouest','Sud','Sud-Ouest'];

export default function StepPersonalInfo({ data, onChange }: Props) {
  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange('photo', reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <User className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-display font-bold dark:text-white">Informations Personnelles</h2>
        <p className="text-gray-500 text-sm mt-1">Renseignez les informations de l'élève</p>
      </div>

      {/* Photo */}
      <div className="flex justify-center">
        <label className="relative cursor-pointer group">
          <div className="w-28 h-28 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-800 group-hover:border-brand-gold transition-all">
            {data.photo ? (
              <img src={data.photo} alt="Photo" className="w-full h-full object-cover rounded-3xl" />
            ) : (
              <Camera className="w-8 h-8 text-gray-400 group-hover:text-brand-gold transition-colors" />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-brand-gold rounded-xl flex items-center justify-center shadow-lg">
            <Camera className="w-4 h-4 text-brand-blue" />
          </div>
          <input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nom Complet *</label>
          <input type="text" value={data.fullName || ''} onChange={e => onChange('fullName', e.target.value)} placeholder="Ex: Jean-Paul Moussa Diallo" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" required />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date de Naissance *</label>
          <input type="date" value={data.dateOfBirth || ''} onChange={e => onChange('dateOfBirth', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" required />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lieu de Naissance *</label>
          <input type="text" value={data.placeOfBirth || ''} onChange={e => onChange('placeOfBirth', e.target.value)} placeholder="Ex: Douala" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" required />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nationalité *</label>
          <input type="text" value={data.nationality || 'Camerounaise'} onChange={e => onChange('nationality', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sexe *</label>
          <div className="flex gap-3">
            {['M', 'F'].map(s => (
              <button key={s} type="button" onClick={() => onChange('sex', s)}
                className={`flex-1 py-3.5 rounded-2xl text-sm font-bold transition-all ${data.sex === s ? 'bg-brand-gold text-brand-blue shadow-lg' : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 hover:border-brand-gold'}`}>
                {s === 'M' ? 'Masculin' : 'Féminin'}
              </button>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Adresse</label>
          <input type="text" value={data.address || ''} onChange={e => onChange('address', e.target.value)} placeholder="Quartier, rue..." className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ville</label>
          <input type="text" value={data.city || ''} onChange={e => onChange('city', e.target.value)} placeholder="Ex: Yaoundé" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Région</label>
          <select value={data.region || ''} onChange={e => onChange('region', e.target.value)} className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all">
            <option value="">Sélectionner</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Téléphone (Élève)</label>
          <input type="tel" value={data.phone || ''} onChange={e => onChange('phone', e.target.value)} placeholder="+237 6XX XX XX XX" className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 text-sm dark:text-white focus:border-brand-gold transition-all" />
        </div>
      </div>
    </motion.div>
  );
}
