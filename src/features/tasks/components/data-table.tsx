'use client';

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowHref?: (row: TData) => string;
}

export function DataTable<TData, TValue>({ columns, data, getRowHref }: DataTableProps<TData, TValue>) {
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnFilters,
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      {/* Bento Grid Container */}
      <div className="grid overflow-hidden rounded-none border border-[var(--border-subtle)] shadow-card">
        {/* Table Header */}
        {table.getHeaderGroups().map((headerGroup) => {
          const headerTemplate = headerGroup.headers
            .map((header) => (header.column.id === 'actions' ? '64px' : 'minmax(0, 1fr)'))
            .join(' ');

          return (
            <div
              key={headerGroup.id}
              className="sticky top-0 z-10 grid border-b border-[var(--border-subtle)]"
              style={{
                gridTemplateColumns: headerTemplate,
              }}
            >
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className={[
                    header.column.id === 'actions' ? 'px-2' : 'px-4',
                    'bg-[var(--bg-surface)] py-3 text-[13px] font-medium tracking-tight text-[var(--text-secondary)]',
                  ].join(' ')}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </div>
              ))}
            </div>
          );
        })}

        {/* Table Body */}
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const rowTemplate = row
              .getVisibleCells()
              .map((cell) => (cell.column.id === 'actions' ? '64px' : 'minmax(0, 1fr)'))
              .join(' ');

            return (
              <div
                key={row.id}
                className={[
                  'group grid border-b border-[var(--border-subtle)] transition-colors duration-150 last:border-b-0',
                  getRowHref ? 'cursor-pointer' : '',
                ].join(' ')}
                style={{
                  gridTemplateColumns: rowTemplate,
                }}
                onClick={() => {
                  if (!getRowHref) return; // router.push logic handled by children or parent link usually, but here we can push
                  router.push(getRowHref(row.original));
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className={[
                      cell.column.id === 'actions' ? 'px-2' : 'px-4',
                      'bg-[var(--bg-surface)] py-3 text-[14px] text-[var(--text-primary)] group-hover:bg-[var(--bg-hover)]',
                    ].join(' ')}
                  >
                    <div className="tabular-data">{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                  </div>
                ))}
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-[var(--bg-surface)] px-4 py-12 text-center text-[var(--text-tertiary)]">
            {tCommon('noResults')}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="rounded-none"
        >
          {tCommon('previous')}
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="rounded-none">
          {tCommon('next')}
        </Button>
      </div>
    </div>
  );
}
