import { type RouterOutputs } from '@/lib/api'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<RouterOutputs['adminMenu']['getUsers'][number]>()

const columns = [
  columnHelper.group({
    id: 'identifier',
    header: () => <span className='font-semibold'>Идентификаторы</span>,
    columns: [
      columnHelper.accessor('id', {
        cell: (cell) => <div className='font-medium'>{cell.getValue()}</div>,
      }),
      columnHelper.accessor('nickname', {
        header: () => 'Никнейм',
        cell: (cell) => <div className='font-medium'>{cell.getValue()}</div>,
      }),
    ],
  }),
  columnHelper.group({
    id: 'information',
    header: () => <span className='font-semibold'>Информация</span>,
    columns: [
      columnHelper.accessor('name', {
        header: () => 'Имя',
      }),
      columnHelper.accessor('email', {
        header: () => 'Email',
      }),
      columnHelper.accessor('emailVerified', {
        header: () => 'Email подтвержден',
      }),
      columnHelper.accessor('userInfo', {
        header: () => 'Обо мне',
      }),
      columnHelper.accessor('role', {
        header: () => 'Роль',
      }),
      columnHelper.accessor('isBlocked', {
        header: () => 'Заблокирован',
      }),
      columnHelper.accessor('blockReason', {
        header: () => 'Причина блокировки',
      }),
    ],
  }),
]

interface UserListTableProps {
  users: RouterOutputs['adminMenu']['getUsers']
}

export default function UserListTable({ users }: UserListTableProps) {
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className='min-w-full divide-y divide-gray-300'>
      <thead className='bg-gray-50'>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                colSpan={header.colSpan}
                scope='col'
                className='px-3 py-3.5 text-left text-sm text-gray-900'
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className='divide-y divide-gray-200 bg-white'>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className='whitespace-nowrap px-3 py-4 text-gray-900'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
