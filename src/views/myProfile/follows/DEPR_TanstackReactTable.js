import * as React from 'react'

import './index.css'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper()

const columns = [
  columnHelper.accessor('npub', {
    cell: (info) => info.getValue(),
    header: () => <span>NPUB!</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.picture, {
    id: 'picture',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Picture</span>,
    footer: (info) => info.column.id,
  }),
]

const createData = (aFollows) => {
  const aData = []
  aFollows.forEach( async (npub, item)=>{
    const oNextEntry = {
      npub: npub,
      picture: 'bar',
    }
    aData.push(oNextEntry)
  })
  return aData
}

const TanstackReactTable = ({aFollows}) => {
  const [data, _setData] = React.useState(() => [...createData(aFollows)])
  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.footer, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
}

export default TanstackReactTable
