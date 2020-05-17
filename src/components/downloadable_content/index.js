import './downloadable_content.scss'

const DownloadableContent = ({ content, filename, children }) => {
  const embeddedContent = `data:text/plain;charset=utf-8,${encodeURIComponent(
    content
  )}`

  return (
    <a
      href={embeddedContent}
      download={filename}
      className="downloadable-content"
    >
      {children}
    </a>
  )
}

export default DownloadableContent
