import { api, type RouterOutputs } from '@/lib/api'
import { useState } from 'react'
import Window from '@/components/form/window'
import TableSkeleton from '@/components/table-skeleton'
import errorToast from '@/components/toasts/error-toast'
import dynamic from 'next/dynamic'

const DynamicUserListTable = dynamic(() => import('@/components/admin/user-list/user-list-table'), {
  ssr: false,
})

export default function UserList() {
  const [users, setUsers] = useState<RouterOutputs['adminMenu']['getUsers']>([])
  const usersQuery = api.adminMenu.getUsers.useQuery(undefined, {
    onSuccess: (data) => setUsers(data),
    onError: (error) => errorToast(error.message),
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
                {usersQuery.isLoading ? <TableSkeleton /> : <DynamicUserListTable users={users} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  )
}
