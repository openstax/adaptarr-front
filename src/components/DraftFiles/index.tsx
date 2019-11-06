import * as React from 'react'
import { Localized } from 'fluent-react/compat'

import Draft, { DraftFile } from 'src/api/draft'

import Spinner from 'src/components/Spinner'

import './index.css'

interface DraftFilesProps {
  draft: Draft
}

const DraftFiles = ({ draft }: DraftFilesProps) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [files, setFiles] = React.useState<DraftFile[]>([])

  const fetchFiles = async () => {
    const fls = await draft.files()
    setFiles(fls)
    setIsLoading(false)
  }

  React.useEffect(() => {
    fetchFiles()
  }, [])

  if (isLoading) return <Spinner />

  return (
    <div className="draft-files">
      <h3 className="draft-files__title">
        <Localized id="draft-files-title">
          Files associated with this draft:
        </Localized>
      </h3>
      <ul className="draft-files__list">
        {
          files.map(file => (
            <DraftFilePresentation
              key={file.name}
              draftId={draft.module}
              file={file}
            />
          ))
        }
      </ul>
    </div>
  )
}

export default DraftFiles

interface DraftFilePresentationProps {
  draftId: string
  file: DraftFile
}

const DraftFilePresentation = ({ draftId, file }: DraftFilePresentationProps) => {
  const url = `/api/v1/drafts/${draftId}/files/${file.name}`

  return (
    <li className="draft-files__file">
      <a
        className="draft-files__link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {
          /^image/.test(file.mime)
            ? <img className="draft-files__thumb" src={url}/>
            : null
        }
        {file.name}
      </a>
    </li>
  )
}
