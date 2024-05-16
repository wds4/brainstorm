import * as React from 'react'

import './index.css'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { CNavLink } from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { updateNpub } from '../../redux/features/siteNavigation/slice'
import { noProfilePicUrl } from '../../const'

const columnHelper = createColumnHelper()

const returnDegreeOfSeparation = ({ oProfilesByNpub, npub }) => {
  let doSeparation = 9999
  if (oProfilesByNpub[npub].wotScores) {
    doSeparation = oProfilesByNpub[npub].wotScores.degreesOfSeparationFromMe
  }
  return doSeparation
}

const returnFollowCount = ({ oProfilesByNpub, npub }) => {
  let aTags_p = []
  if (
    oProfilesByNpub[npub].kind3 &&
    oProfilesByNpub[npub].kind3.oEvent &&
    oProfilesByNpub[npub].kind3.oEvent.tags
  ) {
    aTags_p = oProfilesByNpub[npub].kind3.oEvent.tags.filter(([k, v]) => k === 'p' && v && v !== '')
  }
  return aTags_p.length
}

const FollowCountCell = ({ npub }) => {
  const oProfilesByNpub = useSelector((state) => state.profiles.oProfiles.byNpub)

  let aTags_p = []
  if (
    oProfilesByNpub[npub].kind3 &&
    oProfilesByNpub[npub].kind3.oEvent &&
    oProfilesByNpub[npub].kind3.oEvent.tags
  ) {
    aTags_p = oProfilesByNpub[npub].kind3.oEvent.tags.filter(([k, v]) => k === 'p' && v && v !== '')
  }
  return <>{aTags_p.length}</>
}

const ProfileImageCell = ({ picture }) => {
  const dispatch = useDispatch()
  const updateProfileNpub = () => {
    dispatch(updateNpub(picture.npub))
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="profileAvatarContainerSmall">
        <CNavLink
          href="#/profile"
          onClick={() => {
            updateProfileNpub()
          }}
        >
          <img src={picture.url} className="profileAvatarSmall" />
        </CNavLink>
      </div>
    </div>
  )
}

const columns = [
  columnHelper.accessor('npub', {
    cell: (info) => info.getValue(),
    header: () => <span>NPUB!</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.picture, {
    id: 'picture',
    cell: (info) => <ProfileImageCell picture={info.getValue()} />,
    header: () => <span>Picture</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.displayName, {
    id: 'displayName',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>display name</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.followCount, {
    id: 'followCount',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span># Follows</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.wotScore, {
    id: 'wotScore',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>WoT Score (coming soon!)</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.degreeOfSeparation, {
    id: 'degreeOfSeparation',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>degree of separation</span>,
    footer: (info) => info.column.id,
  }),
]

function Filter({ column, table }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
      <input
        type="number"
        value={columnFilterValue?.[0] ?? ''}
        onChange={(e) => column.setFilterValue((old) => [e.target.value, old?.[1]])}
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={columnFilterValue?.[1] ?? ''}
        onChange={(e) => column.setFilterValue((old) => [old?.[0], e.target.value])}
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      className="w-36 border shadow rounded"
      onChange={(e) => column.setFilterValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      placeholder={`Search...`}
      type="text"
      value={columnFilterValue ?? ''}
    />
  )
}

const createData = ({ oProfilesByNpub, aNpubsToDisplay }) => {
  const aData = []
  aNpubsToDisplay.forEach(async (npub, item) => {
    if (1) {
      if (
        oProfilesByNpub[npub].kind0 &&
        oProfilesByNpub[npub].kind0.oEvent &&
        oProfilesByNpub[npub].kind0.oEvent.content
      ) {
        const oContent = JSON.parse(oProfilesByNpub[npub].kind0.oEvent.content)
        const oNextEntry = {
          npub: npub,
          picture: { url: oContent?.picture, npub: npub },
          name: oContent?.name,
          displayName: oContent?.display_name,
          followCount: returnFollowCount({ oProfilesByNpub, npub }),
          degreeOfSeparation: returnDegreeOfSeparation({ oProfilesByNpub, npub }),
          wotScore: 999,
        }
        aData.push(oNextEntry)
      } else {
        const oNextEntry = {
          npub: npub,
          picture: { url: noProfilePicUrl, npub: npub },
          name: '',
          displayName: '',
          followCount: returnFollowCount({ oProfilesByNpub, npub }),
          degreeOfSeparation: returnDegreeOfSeparation({ oProfilesByNpub, npub }),
          wotScore: 5,
        }
        aData.push(oNextEntry)
      }
    }
  })
  return aData
}

const TanstackProfilesTable = ({ aNpubsToDisplay, oProfilesByNpub }) => {
  // const aNpubsToDisplay = Object.keys(oProfilesByNpub)
  const [data, _setData] = React.useState(() => [
    ...createData({ oProfilesByNpub, aNpubsToDisplay }),
  ])
  const rerender = React.useReducer(() => ({}), {})[1]
  const [columnVisibility, setColumnVisibility] = React.useState({
    npub: false,
    picture: true,
    name: true,
    displayName: true,
    followCount: true,
    wotScore: true,
    degreeOfSeparation: true,
  })

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      columnVisibility,
      pagination,
    },
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  const totalRows = table.getPrePaginationRowModel().rows.length

  return (
    <div className="p-2">
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ display: 'flex', flexGrow: '1', alignItems: 'flex-end' }}>
          <div>{totalRows} rows displayed</div>
        </div>
        <div style={{ display: 'flex', flexGrow: 'auto' }}>
          <div className="inline-block border border-black shadow rounded">
            <div className="px-1 border-b border-black">
              <label>
                <input
                  {...{
                    type: 'checkbox',
                    checked: table.getIsAllColumnsVisible(),
                    onChange: table.getToggleAllColumnsVisibilityHandler(),
                  }}
                />{' '}
                Toggle All
              </label>
            </div>
            {table.getAllLeafColumns().map((column) => {
              return (
                <div key={column.id} className="px-1">
                  <label>
                    <input
                      {...{
                        type: 'checkbox',
                        checked: column.getIsVisible(),
                        onChange: column.getToggleVisibilityHandler(),
                      }}
                    />{' '}
                    {column.id}
                  </label>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="h-4" />
      <br />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    <div
                      {...{
                        className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </div>
                  </th>
                )
              })}
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

      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
}

export default TanstackProfilesTable

/*
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
        */
