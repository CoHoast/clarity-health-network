"use client";

import { useState, useCallback, useMemo } from "react";

export interface UseBulkSelectOptions<T> {
  items: T[];
  getItemId: (item: T) => string;
}

export interface UseBulkSelectReturn<T> {
  selectedIds: Set<string>;
  isSelected: (id: string) => boolean;
  isAllSelected: boolean;
  isSomeSelected: boolean;
  selectedCount: number;
  toggleSelect: (id: string) => void;
  toggleSelectAll: () => void;
  selectAll: () => void;
  clearSelection: () => void;
  getSelectedItems: () => T[];
}

export function useBulkSelect<T>({
  items,
  getItemId,
}: UseBulkSelectOptions<T>): UseBulkSelectReturn<T> {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const isSelected = useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const isAllSelected = useMemo(
    () => items.length > 0 && items.every((item) => selectedIds.has(getItemId(item))),
    [items, selectedIds, getItemId]
  );

  const isSomeSelected = useMemo(
    () => selectedIds.size > 0 && !isAllSelected,
    [selectedIds.size, isAllSelected]
  );

  const selectedCount = selectedIds.size;

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map(getItemId)));
    }
  }, [isAllSelected, items, getItemId]);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map(getItemId)));
  }, [items, getItemId]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const getSelectedItems = useCallback(() => {
    return items.filter((item) => selectedIds.has(getItemId(item)));
  }, [items, selectedIds, getItemId]);

  return {
    selectedIds,
    isSelected,
    isAllSelected,
    isSomeSelected,
    selectedCount,
    toggleSelect,
    toggleSelectAll,
    selectAll,
    clearSelection,
    getSelectedItems,
  };
}
