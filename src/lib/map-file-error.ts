import { ErrorCode, type FileError } from 'react-dropzone'
import errorToast from '@/components/toasts/error-toast'

export default function mapFileError(error: FileError) {
  switch (error.code) {
    case ErrorCode.FileInvalidType:
      errorToast('Неподдерживаемый тип файла')
      break
    case ErrorCode.FileTooLarge:
      errorToast('Файл слишком большой')
      break
    case ErrorCode.FileTooSmall:
      errorToast('Файл слишком маленький')
      break
    case ErrorCode.TooManyFiles:
      errorToast('Слишком много файлов')
      break
  }
}
