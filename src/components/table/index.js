import './table.scss'

export const Table = ({ children }) => {
  return <table className="table">{children}</table>
}

export const TableHeader = ({ children }) => {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  )
}

export const TableHeaderColumn = ({ children, width }) => {
  const style = {}

  if (width) style['width'] = width

  return <th style={style}>{children}</th>
}

export const TableBody = ({ children }) => {
  return <tbody>{children}</tbody>
}

export const TableRow = ({ children }) => {
  return <tr>{children}</tr>
}
