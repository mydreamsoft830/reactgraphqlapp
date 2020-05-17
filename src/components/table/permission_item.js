const PermissionItem = ({ token }) => {
  const [prefix, suffix] = token.split(':')

  return (
    <span className="permission-token">
      <span className={prefix}>{prefix}</span>
      <span>{suffix}</span>
    </span>
  )
}

export default PermissionItem
