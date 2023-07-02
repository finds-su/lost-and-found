import { api, type RouterOutputs } from '@/lib/api'
import { useState } from 'react'
import Window from '@/components/form/window'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import TableSkeleton from '@/components/table-skeleton'
import errorToast from '@/components/toasts/error-toast'

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

export default function UserList() {
  const [users, setUsers] = useState<RouterOutputs['adminMenu']['getUsers']>([])
  const usersQuery = api.adminMenu.getUsers.useQuery(undefined, {
    onSuccess: (data) => setUsers(data),
    onError: (error) => errorToast(error.message),
  })
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Window>
      <div className='px-4 sm:px-6 lg:px-8'>
        <div className='sm:flex sm:items-center'>
          <div className='sm:flex-auto'>
            <h1 className='text-xl font-semibold text-gray-900'>Пользователи</h1>
            <p className='mt-2 text-sm text-gray-700'>Список всех пользователей.</p>
          </div>
        </div>
        <div className='mt-8 flex flex-col'>
          <div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
              <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
                {usersQuery.isLoading ? (
                  <TableSkeleton />
                ) : (
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  )
}
