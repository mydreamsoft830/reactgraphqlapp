import { useMemo } from 'react'
import { DropdownButton, DropdownItem } from 'components/dropdown'
import { AiOutlineDown, AiOutlineFileText } from 'react-icons/ai'
import { useExploreContext } from './explore_context'

const saveFile = async (filename, blob) => {
  const a = document.createElement('a')
  a.download = filename
  a.href = URL.createObjectURL(blob)
  a.addEventListener('click', (e) => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000)
  })
  a.click()
}

const GenerateCsv = (queryData) => {
  const columnNames = ['timestamp']
  const rows = []

  queryData.forEach((series) => {
    series.fields.forEach((fieldName) => {
      if (!columnNames.includes(fieldName.name)) {
        columnNames.push(fieldName.name)
      }
    })
  })

  const columnCount = Object.keys(columnNames).length
  //rows.push(columnNames)

  queryData.forEach((series) => {
    const seriesFields = series.fields.map((field) => field.name)
    const seriesFieldMap = columnNames.reduce((h, colName, i) => {
      if (seriesFields.includes(colName)) {
        return Object.assign({}, h, { [colName]: i })
      }

      return h
    }, {})

    series.timestamps.forEach((timestamp, i) => {
      const row = [timestamp]

      series.fields.forEach((field) => {
        const rowIdx = seriesFieldMap[field.name]

        row[rowIdx] = field.values[i]
      })

      for (let i = 0; i < columnCount; i++) {
        if (!row[i]) row[i] = null
      }

      rows.push(row)
    })
  })

  const csv = [columnNames.join(',')]
    .concat(rows.map((r) => r.join(',')))
    .join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const filename = 'test.csv'

  saveFile(filename, blob)
}

export const Export = () => {
  const { queryData } = useExploreContext()

  const buttonContent = useMemo(
    () => (
      <span className="export-button">
        Export
        <AiOutlineDown />
      </span>
    ),
    []
  )

  return (
    <div className="explore-export">
      <DropdownButton
        buttonContent={buttonContent}
        align="left"
        disabled={queryData === null}
      >
        <DropdownItem
          name="Export to CSV"
          icon={<AiOutlineFileText />}
          onClick={() => GenerateCsv(queryData)}
        />
        {/*}
        <DropdownSeparator />
        <DropdownItem
          name="Export to XLSX"
          icon={<AiOutlineFileExcel />}
          onClick={() => {}}
        /> 
        */}
      </DropdownButton>
    </div>
  )
}
