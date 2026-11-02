import React, { useState, useEffect } from 'react';
import { FilterState, TaxonomyNode } from '../types';
import { TAXONOMY, TAXONOMY_NODES } from '../constants/taxonomy';
import { normalizeString, hasAncestorSelected, countSelectedChildren, getEffectiveNodes, resolveEntity, normalizeYears } from '../utils/openalex';
import { X, Search, ChevronDown, Check } from 'lucide-react';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filter: FilterState;
  onApply: (newFilter: FilterState) => void;
  langDict: Record<string, string>;
  onTriggerEasterEgg?: (mode: 'pink-flowers' | 'ocean-fish') => void;
  onTriggerPolarNight?: () => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  isOpen,
  onClose,
  filter,
  onApply,
  langDict,
  onTriggerEasterEgg,
  onTriggerPolarNight
}) => {
  const [draft, setDraft] = useState<FilterState>(() => ({
    ...filter,
    sel: new Set(filter.sel)
  }));
  const [searchQuery, setSearchQuery] = useState("");
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());
  const [authorInput, setAuthorInput] = useState(filter.aName || "");
  const [journalInput, setJournalInput] = useState(filter.jName || "");
  const [statusMessage, setStatusMessage] = useState("");

  // Panel her açıldığında taslağı uygulanmış filtreyle senkronla (örn. dışarıdan sıfırlandıysa)
  useEffect(() => {
    if (isOpen) {
      setDraft({ ...filter, sel: new Set(filter.sel) });
      setAuthorInput(filter.aName || "");
      setJournalInput(filter.jName || "");
      setStatusMessage("");
    }
  }, [isOpen]);

  const checkPolarNightKeyword = (val: string) => {
    const norm = normalizeString(val.trim());
    if (/(antarktika|antarctica|antartika)/i.test(norm)) {
      onTriggerPolarNight?.();
    }
  };

  const handleAuthorChange = (val: string) => {
    setAuthorInput(val);
    const norm = normalizeString(val.trim());
    checkPolarNightKeyword(val);
    if (/(acuci|açuçi|asude|asoude)/i.test(norm)) {
      onTriggerEasterEgg?.('pink-flowers');
    } else if (/(binali|binosh|binos|binoş)/i.test(norm)) {
      onTriggerEasterEgg?.('ocean-fish');
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    checkPolarNightKeyword(val);
  };

  const handleJournalChange = (val: string) => {
    setJournalInput(val);
    checkPolarNightKeyword(val);
  };

  if (!isOpen) return null;

  const normQ = normalizeString(searchQuery.trim());

  const nodeMatches = (n: TaxonomyNode): boolean => {
    if (!normQ) return true;
    if (normalizeString(n.label).includes(normQ)) return true;
    return n.children.some(nodeMatches);
  };

  const toggleSelect = (node: TaxonomyNode) => {
    setDraft(prev => {
      const nextSel = new Set(prev.sel);
      if (nextSel.has(node.id)) {
        nextSel.delete(node.id);
      } else {
        nextSel.add(node.id);
        // Clear all descendants
        const removeDescendants = (m: TaxonomyNode) => {
          m.children.forEach(c => {
            nextSel.delete(c.id);
            removeDescendants(c);
          });
        };
        removeDescendants(node);
      }
      return { ...prev, sel: nextSel };
    });
  };

  const toggleOpen = (id: string) => {
    setOpenNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleYearPreset = (y: number) => {
    const curYear = new Date().getFullYear();
    setDraft(prev => ({
      ...prev,
      from: y === 0 ? "" : String(y > 100 ? y : curYear - y),
      to: ""
    }));
  };

  const handleApply = async () => {
    setStatusMessage("Uygulanıyor…");
    try {
      const [authorRes, journalRes] = await Promise.all([
        resolveEntity("authors", authorInput),
        resolveEntity("sources", journalInput)
      ]);

      const years = normalizeYears(draft.from, draft.to);
      const finalFilter: FilterState = {
        ...draft,
        from: years.from,
        to: years.to,
        authorId: authorRes.id,
        aName: authorRes.name || "",
        journalId: journalRes.id,
        jName: journalRes.name || ""
      };

      onApply(finalFilter);
      setStatusMessage("");
      onClose();
    } catch (err: any) {
      setStatusMessage("Filtreler uygulanamadı.");
    }
  };

  const handleClear = () => {
    setDraft({
      sel: new Set(),
      from: "",
      to: "",
      authorId: "",
      journalId: "",
      aName: "",
      jName: "",
      en: true
    });
    setAuthorInput("");
    setJournalInput("");
    setSearchQuery("");
  };

  const effectiveNodes = getEffectiveNodes(draft.sel);
  const rootGroups = Array.from(new Set(effectiveNodes.map(n => n.root)));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="w-full max-w-lg max-h-[92dvh] bg-[#eef7fb] dark:bg-[#020f1a] rounded-t-3xl border-t border-[#c5dfe9] dark:border-[#0d2f45] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-[#c5dfe9] dark:bg-[#0d2f45] rounded-full mx-auto my-2.5 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-[#c5dfe9] dark:border-[#0d2f45] shrink-0">
          <h3 className="font-serif text-lg font-bold text-[#0a2540] dark:text-[#e0f4ff]">
            {langDict.filters_title || "Filtreler"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#dff0f7] dark:bg-[#0d2236] flex items-center justify-center hover:bg-sky-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4">
          {/* Selected chips bar */}
          {effectiveNodes.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {effectiveNodes.map(node => (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => toggleSelect(node)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0369a1] text-white flex items-center gap-1 shrink-0"
                >
                  <span>{node.label}</span>
                  <X className="w-3 h-3 opacity-75" />
                </button>
              ))}
            </div>
          )}

          {/* Intersection note if multi-domain */}
          {rootGroups.length > 1 && (
            <div className="p-3 rounded-2xl bg-[#dbeafe] text-[#0369a1] dark:bg-[#0c2d44] dark:text-[#7dd3fc] text-xs leading-relaxed">
              ✦ <b>{rootGroups.map(r => r?.label).join(" × ")}</b> — önce bu alanların hepsini birlikte ele alan disiplinlerarası yayınlar gösterilir; bittikçe tek tek devam edilir.
            </div>
          )}

          {/* Search within taxonomy */}
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#4a7a96] dark:text-[#5fa8c8] mb-1.5 block">
              {langDict.filter_fields || "Alanlar"}
            </span>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#4a7a96]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Alan veya alt dal ara…"
                className="w-full pl-9 pr-3 py-2 bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-sky-600"
              />
            </div>
          </div>

          {/* Taxonomy Accordion */}
          <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
            {TAXONOMY.filter(nodeMatches).map(rootNode => {
              const isSelected = draft.sel.has(rootNode.id);
              const count = countSelectedChildren(rootNode, draft.sel);
              const isOpen = openNodes.has(rootNode.id) || (Boolean(normQ) && nodeMatches(rootNode));

              return (
                <div
                  key={rootNode.id}
                  className={`rounded-2xl border transition-colors ${
                    isSelected || count > 0
                      ? 'border-sky-600 bg-white dark:bg-[#071828]'
                      : 'border-[#c5dfe9] dark:border-[#0d2f45] bg-white dark:bg-[#071828]'
                  }`}
                >
                  <div className="flex items-center justify-between p-3 cursor-pointer">
                    <div
                      className="flex-1 flex flex-col"
                      onClick={() => toggleOpen(rootNode.id)}
                    >
                      <b className="text-xs sm:text-sm text-[#0a2540] dark:text-[#e0f4ff]">{rootNode.label}</b>
                      <span className="text-[10px] text-[#4a7a96] dark:text-[#5fa8c8]">
                        {isSelected ? "Tüm alan seçili" : count > 0 ? `${count} alt dal seçili` : `${rootNode.children.length} alt dal`}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleSelect(rootNode)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isSelected
                            ? 'bg-sky-600 text-white'
                            : 'bg-[#dff0f7] dark:bg-[#0d2236] text-[#4a7a96] dark:text-[#5fa8c8]'
                        }`}
                      >
                        {isSelected ? "✓ Tümü" : "Tümü"}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleOpen(rootNode.id)}
                        className="p-1 text-[#4a7a96]"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Subfield chips & 3rd-level branches */}
                  {isOpen && rootNode.children.length > 0 && (
                    <div className="p-3 pt-0 flex flex-col gap-2 border-t border-[#c5dfe9]/60 dark:border-[#0d2f45]/60 mt-1">
                      <div className="flex flex-wrap gap-1.5">
                        {rootNode.children.filter(nodeMatches).map(child => {
                          const childSelected = draft.sel.has(child.id);
                          const parentHas = isSelected;
                          const hasSubChildren = child.children && child.children.length > 0;
                          const subOpen = openNodes.has(child.id) || (Boolean(normQ) && nodeMatches(child));
                          const subSelectedCount = countSelectedChildren(child, draft.sel);

                          return (
                            <div key={child.id} className="flex flex-col gap-1 w-full sm:w-auto">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => toggleSelect(child)}
                                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                                    childSelected
                                      ? 'bg-sky-600 text-white'
                                      : parentHas
                                      ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 opacity-60 pointer-events-none'
                                      : subSelectedCount > 0
                                      ? 'border-2 border-sky-600 bg-[#dff0f7] dark:bg-[#0d2236] text-sky-700 dark:text-sky-300 font-semibold'
                                      : 'bg-[#dff0f7] dark:bg-[#0d2236] border border-[#c5dfe9] dark:border-[#0d2f45] text-[#0a2540] dark:text-[#e0f4ff]'
                                  }`}
                                >
                                  {child.label}
                                  {hasSubChildren && subSelectedCount > 0 && ` (${subSelectedCount})`}
                                </button>
                                {hasSubChildren && (
                                  <button
                                    type="button"
                                    onClick={() => toggleOpen(child.id)}
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-[#4a7a96] hover:bg-sky-200/50"
                                    title="Alt Dalları Göster"
                                  >
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${subOpen ? 'rotate-180' : ''}`} />
                                  </button>
                                )}
                              </div>

                              {/* Nested Level 3 Sub-branches */}
                              {hasSubChildren && subOpen && (
                                <div className="pl-3 py-1 flex flex-wrap gap-1 border-l-2 border-sky-300 dark:border-sky-800 ml-2">
                                  {child.children.filter(nodeMatches).map(grandChild => {
                                    const gcSelected = draft.sel.has(grandChild.id);
                                    const gcParentHas = childSelected || parentHas;
                                    return (
                                      <button
                                        key={grandChild.id}
                                        type="button"
                                        onClick={() => toggleSelect(grandChild)}
                                        className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                                          gcSelected
                                            ? 'bg-sky-600 text-white'
                                            : gcParentHas
                                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 opacity-60 pointer-events-none'
                                            : 'bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] text-[#4a7a96] dark:text-[#5fa8c8]'
                                        }`}
                                      >
                                        {grandChild.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Year Range Filter */}
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#4a7a96] dark:text-[#5fa8c8] mb-1.5 block">
              {langDict.filter_pub_year || "Yayın Yılı"}
            </span>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#dff0f7] dark:bg-[#0d2236] rounded-xl mb-2">
              <button
                type="button"
                onClick={() => handleYearPreset(0)}
                className={`py-1.5 text-xs font-semibold rounded-lg ${
                  !draft.from && !draft.to ? 'bg-white dark:bg-[#071828] text-sky-600 shadow-sm' : 'text-[#4a7a96]'
                }`}
              >
                Hepsi
              </button>
              <button
                type="button"
                onClick={() => handleYearPreset(5)}
                className={`py-1.5 text-xs font-semibold rounded-lg ${
                  (draft.from === String(new Date().getFullYear() - 5) && !draft.to) ? 'bg-white dark:bg-[#071828] text-sky-600 shadow-sm' : 'text-[#4a7a96]'
                }`}
              >
                Son 5 yıl
              </button>
              <button
                type="button"
                onClick={() => handleYearPreset(10)}
                className={`py-1.5 text-xs font-semibold rounded-lg ${
                  (draft.from === String(new Date().getFullYear() - 10) && !draft.to) ? 'bg-white dark:bg-[#071828] text-sky-600 shadow-sm' : 'text-[#4a7a96]'
                }`}
              >
                Son 10 yıl
              </button>
              <button
                type="button"
                onClick={() => handleYearPreset(2000)}
                className={`py-1.5 text-xs font-semibold rounded-lg ${
                  (draft.from === "2000" && !draft.to) ? 'bg-white dark:bg-[#071828] text-sky-600 shadow-sm' : 'text-[#4a7a96]'
                }`}
              >
                2000+
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={1000}
                max={9999}
                value={draft.from}
                onChange={(e) => setDraft(prev => ({ ...prev, from: e.target.value }))}
                placeholder="Başlangıç yılı (örn. 2018)"
                className="w-full px-3 py-2 bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-xl text-xs focus:outline-none focus:border-sky-600"
              />
              <input
                type="number"
                inputMode="numeric"
                min={1000}
                max={9999}
                value={draft.to}
                onChange={(e) => setDraft(prev => ({ ...prev, to: e.target.value }))}
                placeholder="Bitiş yılı (örn. 2026)"
                className="w-full px-3 py-2 bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-xl text-xs focus:outline-none focus:border-sky-600"
              />
            </div>
          </div>

          {/* Author and Journal */}
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#4a7a96] dark:text-[#5fa8c8] mb-1.5 block">
              {langDict.filter_author || "Yazar"}
            </span>
            <input
              type="text"
              value={authorInput}
              onChange={(e) => handleAuthorChange(e.target.value)}
              placeholder="Örn. Daniel Pauly"
              className="w-full px-3 py-2 bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-sky-600"
            />
          </div>

          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#4a7a96] dark:text-[#5fa8c8] mb-1.5 block">
              {langDict.filter_journal || "Dergi / Kaynak"}
            </span>
            <input
              type="text"
              value={journalInput}
              onChange={(e) => handleJournalChange(e.target.value)}
              placeholder="Örn. Aquaculture"
              className="w-full px-3 py-2 bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] rounded-xl text-xs sm:text-sm focus:outline-none focus:border-sky-600"
            />
          </div>

          {/* English only */}
          <label className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#071828] border border-[#c5dfe9] dark:border-[#0d2f45] cursor-pointer">
            <span className="text-xs font-semibold text-[#0a2540] dark:text-[#e0f4ff]">
              {langDict.filter_en_only || "Yalnızca İngilizce makaleler"}
            </span>
            <input
              type="checkbox"
              checked={draft.en}
              onChange={(e) => setDraft(prev => ({ ...prev, en: e.target.checked }))}
              className="w-4 h-4 text-sky-600 rounded focus:ring-sky-500"
            />
          </label>

          {statusMessage && (
            <p className="text-xs text-sky-700 dark:text-sky-300 italic">{statusMessage}</p>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex gap-2.5 p-4 border-t border-[#c5dfe9] dark:border-[#0d2f45] bg-white dark:bg-[#071828] shrink-0">
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 py-2.5 rounded-xl border border-[#c5dfe9] dark:border-[#0d2f45] text-xs font-bold hover:bg-sky-50 dark:hover:bg-sky-950"
          >
            {langDict.clear_btn || "Temizle"}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-sky-700 to-cyan-600 text-white text-xs font-bold shadow-md shadow-sky-900/20 hover:opacity-95"
          >
            {langDict.apply_btn || "Uygula"}
          </button>
        </div>
      </div>
    </div>
  );
};
