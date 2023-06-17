import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { SortOption } from '@/lib/types/sort-option'
import { Campus as PrismaCampus, PostItemReason } from '@prisma/client'

const reasons = Object.values(PostItemReason)
type reasonType = (typeof reasons)[number]

export interface ScrollGridOptions {
  enabledSortOption: SortOption
  checkedFilters: string[]
  setSortOption: (option: SortOption) => void
  addFilter: (newFilter: string) => void
  deleteFilter: (filterToDelete: string) => void
}

type ScrollGridsState = Record<reasonType, ScrollGridOptions>

const useScrollGridStore = create<ScrollGridsState>()(
  devtools(
    (set) => ({
      LOST: {
        enabledSortOption: SortOption.newFirst,
        checkedFilters: Object.values(PrismaCampus),
        setSortOption: (option) =>
          set((state) => {
            return { ...state, LOST: { ...state.LOST, enabledSortOption: option } }
          }),
        addFilter: (filter) =>
          set((state) => {
            return {
              ...state,
              LOST: { ...state.LOST, checkedFilters: [...state.LOST.checkedFilters, filter] },
            }
          }),
        deleteFilter: (filterToDelete) =>
          set((state) => {
            return {
              ...state,
              LOST: {
                ...state.LOST,
                checkedFilters: state.LOST.checkedFilters.filter(
                  (value) => value !== filterToDelete,
                ),
              },
            }
          }),
      },
      FOUND: {
        enabledSortOption: SortOption.newFirst,
        checkedFilters: Object.values(PrismaCampus),
        setSortOption: (option) =>
          set((state) => {
            return { ...state, FOUND: { ...state.FOUND, enabledSortOption: option } }
          }),
        addFilter: (filter) =>
          set((state) => {
            return {
              ...state,
              FOUND: { ...state.FOUND, checkedFilters: [...state.FOUND.checkedFilters, filter] },
            }
          }),
        deleteFilter: (filterToDelete) =>
          set((state) => {
            return {
              ...state,
              FOUND: {
                ...state.FOUND,
                checkedFilters: state.FOUND.checkedFilters.filter(
                  (value) => value !== filterToDelete,
                ),
              },
            }
          }),
      },
    }),
    {
      name: 'scroll-grids-storage',
    },
  ),
)

export default useScrollGridStore
