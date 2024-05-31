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
import { updateNpub, updateViewProfileTab } from '../../redux/features/siteNavigation/slice'
import { noProfilePicUrl } from '../../const'
import { nip19 } from 'nostr-tools'
import { returnWoTScore } from '../../helpers/brainstorm'

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
    dispatch(updateViewProfileTab('about'))
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
    name: 'Follow Count',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span># Follows</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.followers, {
    id: 'followers',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span># Followers</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.mutes, {
    id: 'mutes',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span># Mutes</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.mutedBy, {
    id: 'mutedBy',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span># Muted by</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.wotScore, {
    id: 'wotScore',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>WoT Score</span>,
    footer: (info) => info.column.id,
    sortUndefined: 'last', //force undefined values to the end
    sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
  }),
  columnHelper.accessor((row) => row.degreeOfSeparation, {
    id: 'degreeOfSeparation',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>degree of separation</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.influence, {
    id: 'influence',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>influence</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.averageScore, {
    id: 'averageScore',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>average score</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.certainty, {
    id: 'certainty',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>certainty</span>,
    footer: (info) => info.column.id,
  }),
  columnHelper.accessor((row) => row.input, {
    id: 'input',
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>input</span>,
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

const createData = ({
  oProfilesByPubkey,
  oProfilesByNpub,
  aNpubsToDisplay,
  aPubkeysToDisplay,
  myNpub,
}) => {
  const aData = []
  // aNpubsToDisplay.forEach(async (npub, item) => {
  aPubkeysToDisplay.forEach(async (pubkey, item) => {
    let npub = ''
    if (oProfilesByPubkey[pubkey]) {
      npub = oProfilesByPubkey[pubkey]
    }
    if (!npub) {
      npub = nip19.npubEncode(pubkey)
    }
    if (
      npub &&
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
        followers: oProfilesByNpub[npub].followers.length,
        mutes: oProfilesByNpub[npub].mutes.length,
        mutedBy: oProfilesByNpub[npub].mutedBy.length,
        degreeOfSeparation: returnDegreeOfSeparation({ oProfilesByNpub, npub }),
        wotScore: Number(oProfilesByNpub[npub].wotScores.coracle),
        // wotScore: returnWoTScore(npub, myNpub, oProfilesByNpub),
        influence: Number(oProfilesByNpub[npub].wotScores.baselineInfluence.influence),
        certainty: Number(oProfilesByNpub[npub].wotScores.baselineInfluence.certainty),
        averageScore: Number(oProfilesByNpub[npub].wotScores.baselineInfluence.averageScore),
        input: Number(oProfilesByNpub[npub].wotScores.baselineInfluence.input),
      }
      aData.push(oNextEntry)
    } else {
      const oNextEntry = {
        npub: npub,
        picture: { url: noProfilePicUrl, npub: npub },
        name: '',
        displayName: '',
        followCount: returnFollowCount({ oProfilesByNpub, npub }),
        followers: oProfilesByNpub[npub].followers.length,
        mutes: oProfilesByNpub[npub].mutes.length,
        mutedBy: oProfilesByNpub[npub].mutedBy.length,
        degreeOfSeparation: returnDegreeOfSeparation({ oProfilesByNpub, npub }),
        wotScore: Number(oProfilesByNpub[npub].wotScores.coracle),
        // wotScore: returnWoTScore(npub, myNpub, oProfilesByNpub),
        influence: Number(oProfilesByNpub[npub].wotScores.baselineInfluence.influence),
        certainty: Number(oProfilesByNpub[npub].wotScores.baselineInfluence.certainty),
        averageScore: Number(oProfilesByNpub[npub].wotScores.baselineInfluence.averageScore),
        input: Number(oProfilesByNpub[npub].wotScores.baselineInfluence.input),
      }
      aData.push(oNextEntry)
    }
    // }
  })
  return aData
}

const TanstackProfilesTable = ({ aPubkeysToDisplay, aNpubsToDisplay, oProfilesByNpub }) => {
  // const aNpubsToDisplay = Object.keys(oProfilesByNpub)
  const myNpub = useSelector((state) => state.profile.npub)
  const oProfilesByPubkey = useSelector((state) => state.profiles.oProfiles.byPubkey)
  const [data, _setData] = React.useState(() => [
    ...createData({
      oProfilesByPubkey,
      oProfilesByNpub,
      aNpubsToDisplay,
      aPubkeysToDisplay,
      myNpub,
    }),
  ])
  const rerender = React.useReducer(() => ({}), {})[1]
  const [columnVisibility, setColumnVisibility] = React.useState({
    npub: false,
    picture: true,
    name: true,
    displayName: true,
    followCount: true,
    followers: true,
    mutes: true,
    mutedBy: true,
    wotScore: true,
    degreeOfSeparation: true,
  })

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })

  const [columnResizeMode, setColumnResizeMode] = React.useState('onChange')
  const [columnResizeDirection, setColumnResizeDirection] = React.useState('ltr')

  const [sorting, setSorting] = React.useState([{ id: 'wotScore', desc: true }])

  const table = useReactTable({
    data,
    columns,
    columnResizeMode,
    columnResizeDirection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      columnVisibility,
      pagination,
      sorting,
    },
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
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

      <div style={{ direction: table.options.columnResizeDirection }}>
        <div className="h-4" />
        <div className="overflow-x-auto">
          <table
            {...{
              style: {
                width: table.getCenterTotalSize(),
              },
            }}
          >
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
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

                        <div
                          {...{
                            onDoubleClick: () => header.column.resetSize(),
                            onMouseDown: header.getResizeHandler(),
                            onTouchStart: header.getResizeHandler(),
                            className: `resizer ${table.options.columnResizeDirection} ${
                              header.column.getIsResizing() ? 'isResizing' : ''
                            }`,
                            style: {
                              transform:
                                columnResizeMode === 'onEnd' && header.column.getIsResizing()
                                  ? `translateX(${
                                      (table.options.columnResizeDirection === 'rtl' ? -1 : 1) *
                                      (table.getState().columnSizingInfo.deltaOffset ?? 0)
                                    }px)`
                                  : '',
                            },
                          }}
                        />
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
                    <td key={cell.id} style={{ width: 'cell.column.getSize()' }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
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
        </div>
      </div>
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
