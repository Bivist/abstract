import React, { useState } from 'react';
import { X, FolderPlus, Folder } from 'lucide-react';

interface FolderSheetProps {
  isOpen: boolean;
  onClose: () => void;
  folderNames: string[];
  onSelectFolder: (name: string) => void;
  onCreateFolder: (name: string) => void;
  langDict: Record<string, string>;
  isAssigning: boolean;
}

export const FolderSheet: React.FC<FolderSheetProps> = ({
  isOpen,
  onClose,
  folderNames,
  onSelectFolder,
  onCreateFolder,
  langDict,
  isAssigning
}) => {
  const [newFolderName, setNewFolderName] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    onCreateFolder(trimmed);
    setNewFolderName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[80dvh] bg-[#eef7fb] dark:bg-[#020f1a] rounded-t-3xl border-t border-[#c5dfe9] dark:border-[#0d2f45] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="w-10 h-1 bg-[#c5dfe9] dark:bg-[#0d2f45] rounded-full mx-auto my-2.5 shrink-0" />

        <div className="flex items-center justify-between px-5 py-2 border-b border-[#c5dfe9] dark:border-[#0d2f45] shrink-0">
          <h3 className="font-serif text-lg font-bold text-[#0a2540] dark:text-[#e0f4ff]">
            {isAssigning ? "Makaleyi Klasöre Taşı" : (langDict.folder_select_title || "Klasör Seç")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#dff0f7] dark:bg-[#0d2236] flex items-center justify-center hover:bg-sky-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 flex-1 overflow-y-auto no-scrollbar">
          {/* Create new folder input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Yeni klasör adı…"
              className="flex-1 px-3.5 py-2.5 bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-sky-600"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreate();
              }}
            />
            <button
              type="button"
              onClick={handleCreate}
              disabled={!newFolderName.trim()}
              className="px-4 py-2.5 bg-gradient-to-r from-sky-700 to-cyan-600 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-40"
            >
              {langDict.create_btn || "Oluştur"}
            </button>
          </div>

          {/* Folder List */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#4a7a96] dark:text-[#5fa8c8] block mb-2">
              Mevcut Klasörler
            </span>
            {!folderNames.length ? (
              <p className="text-xs text-[#4a7a96] dark:text-[#5fa8c8] py-4 text-center">
                Henüz özel bir klasör oluşturulmadı. Yukarıdan yeni bir tane ekleyebilirsiniz.
              </p>
            ) : (
              folderNames.map(fName => (
                <button
                  key={fName}
                  type="button"
                  onClick={() => {
                    onSelectFolder(fName);
                    onClose();
                  }}
                  className="w-full p-3 rounded-2xl bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] flex items-center gap-3 text-left hover:border-sky-600 transition-colors"
                >
                  <Folder className="w-4 h-4 text-sky-600" />
                  <span className="text-xs sm:text-sm font-semibold text-[#0a2540] dark:text-[#e0f4ff]">
                    {fName}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
