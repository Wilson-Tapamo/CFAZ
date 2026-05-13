import React, { useRef } from 'react';
import { FileText, Camera, Upload, CheckCircle2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { REQUIRED_DOCUMENTS, fileToBase64 } from '@/lib/api';

interface Props {
  uploadedDocs: Record<string, { fileName: string; preview?: string }>;
  onUpload: (type: string, fileName: string, fileData: string, mimeType: string) => void;
  onRemove: (type: string) => void;
}

export default function StepDocuments({ uploadedDocs, onUpload, onRemove }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentTypeRef = useRef<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    onUpload(currentTypeRef.current, file.name, base64, file.type);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerUpload = (type: string, capture?: boolean) => {
    currentTypeRef.current = type;
    if (fileInputRef.current) {
      if (capture) {
        fileInputRef.current.setAttribute('capture', 'environment');
      } else {
        fileInputRef.current.removeAttribute('capture');
      }
      fileInputRef.current.click();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4 }} className="space-y-8">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <FileText className="w-7 h-7 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-display font-bold dark:text-white">Pièces à Fournir</h2>
        <p className="text-gray-500 text-sm mt-1">Téléchargez ou prenez en photo les documents requis</p>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileSelect} className="hidden" />

      <div className="space-y-3">
        {REQUIRED_DOCUMENTS.map((doc) => {
          const uploaded = uploadedDocs[doc.type];
          return (
            <motion.div key={doc.type} whileHover={{ scale: 1.01 }}
              className={`p-5 rounded-2xl border-2 transition-all ${uploaded ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/40' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 border-dashed'}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${uploaded ? 'bg-green-100 dark:bg-green-800/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    {uploaded ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <FileText className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold dark:text-white truncate">{doc.label}</p>
                    {uploaded && <p className="text-[10px] text-green-600 font-medium truncate">{uploaded.fileName}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {uploaded ? (
                    <button type="button" onClick={() => onRemove(doc.type)} className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <button type="button" onClick={() => triggerUpload(doc.type, true)} className="p-2.5 bg-brand-gold/10 text-brand-gold rounded-xl hover:bg-brand-gold/20 transition-colors" title="Prendre une photo">
                        <Camera className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => triggerUpload(doc.type, false)} className="p-2.5 bg-brand-blue/10 dark:bg-white/10 text-brand-blue dark:text-white rounded-xl hover:bg-brand-blue/20 dark:hover:bg-white/20 transition-colors" title="Choisir un fichier">
                        <Upload className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30">
        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">📸 Vous pouvez prendre une photo directement avec votre appareil ou sélectionner un fichier existant (JPG, PNG, PDF).</p>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="text-gray-400">{Object.keys(uploadedDocs).length}</span>
        <span className="text-gray-400">/</span>
        <span className="text-gray-400">{REQUIRED_DOCUMENTS.length} documents fournis</span>
      </div>
    </motion.div>
  );
}
