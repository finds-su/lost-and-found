const columnsCount = 5
const rowsCount = 10

export default function TableSkeleton() {
  return (
    <table className='min-w-full divide-y divide-gray-300'>
      <thead className='bg-gray-50'>
        <tr className='animate-pulse'>
          {Array.from(Array(columnsCount).keys()).map((index) => (
            <th key={index} scope='col' className='py-3.5 pl-4 pr-3'>
              <div className='h-2.5 w-20 rounded-full bg-gray-200'></div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className='animate-pulse divide-y divide-gray-200 bg-white'>
        {Array.from(Array(rowsCount).keys()).map((index) => (
          <tr key={index}>
            {Array.from(Array(columnsCount).keys()).map((index) => (
              <td key={index} className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
                <div className='h-2 w-32 rounded-full bg-gray-200'></div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
