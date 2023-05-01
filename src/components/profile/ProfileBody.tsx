import Image from 'next/image'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import successToast from '@/components/toasts/SuccessToast'
import {
  ArrowLeftIcon,
  ClipboardDocumentCheckIcon,
  PencilSquareIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import ProfileWindow from '@/components/profile/ProfileWindow'
import { Avatar, Button, Label, Spinner, Textarea, TextInput } from 'flowbite-react'
import { formatDate } from '@/utils/formatDate'
import { useEffect, useState } from 'react'
import { api } from '@/utils/api'
import errorToast from '@/components/toasts/ErrorToast'
import { type Role } from '@prisma/client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { removeEmptyFields } from '@/utils/removeEmptyFields'

interface User {
  nickname: string
  name: string
  email?: string
  role: Role
  image?: string
  userInfo: string
  telegramLink?: string
  isBlockedUntil?: string
}

export type EditableUser = Omit<User, 'role'>

export interface ProfileProps {
  isOwner: boolean
  user: User
}

export default function ProfileBody(props: ProfileProps) {
  const router = useRouter()
  const [editProfile, setEditProfile] = useState(false)

  const initialEditableUser: EditableUser = {
    name: props.user.name,
    nickname: props.user.nickname,
    email: props.user.email ?? '',
    telegramLink: props.user.telegramLink ?? '',
    userInfo: props.user.userInfo,
  }
  const [editableUser, setEditableUser] = useState<EditableUser>(initialEditableUser)
  useEffect(() => {
    if (editProfile) {
      setEditableUser(initialEditableUser)
    }
  }, [editProfile])

  const oldNickname = props.user.nickname
  const oldName = props.user.name
  const invalidNicknameReason = api.users.isValidNewNickname.useQuery(
    { nickname: editableUser.nickname },
    { enabled: editableUser.nickname !== props.user.nickname },
  )
  const invalidEmailReason = api.users.isValidNewEmail.useQuery(
    { email: editableUser.email ?? '' },
    {
      enabled: editableUser.email !== props.user.email,
    },
  )
  const editUser = api.users.editUser.useMutation({
    onSuccess: () => {
      if (oldNickname !== editableUser.nickname || oldName !== editableUser.name) {
        void router.push(`/u/${editableUser.nickname}/`)
      }
      setEditProfile(false)
    },
    onError: (error) => errorToast(error.message),
  })

  const editableFields = [
    {
      label: 'Ваше имя',
      oldValue: props.user.name,
      placeholder: 'Валера Верхотуров',
      value: editableUser.name,
      setValue: (userName: string) => setEditableUser({ ...editableUser, name: userName }),
      isRequired: true,
    },
    {
      label: 'Ваш никнейм',
      oldValue: props.user.nickname,
      placeholder: 'my-username',
      value: editableUser.nickname,
      setValue: (nickname: string) => setEditableUser({ ...editableUser, nickname }),
      isRequired: true,
      result: invalidNicknameReason,
    },
    {
      label: 'Ваша почта',
      oldValue: props.user.email,
      placeholder: 'mail@bk.ru',
      value: editableUser.email,
      setValue: (email: string) => setEditableUser({ ...editableUser, email }),
      isRequired: false,
      result: invalidEmailReason,
    },
    {
      label: 'Ваш Telegram',
      oldValue: props.user.telegramLink,
      placeholder: 'tg-username',
      value: editableUser.telegramLink,
      setValue: (telegramLink: string) => setEditableUser({ ...editableUser, telegramLink }),
      isRequired: false,
    },
  ]

  const profileInfo = [
    { name: 'Имя', value: editableUser.name },
    { name: 'Никнейм', value: editableUser.nickname },
    { name: 'Почта', value: editableUser.email },
    { name: 'Telegram', value: editableUser.telegramLink },
    { name: 'Роль', value: props.user.role },
    {
      name: 'Заблокирован до',
      value: props.user.isBlockedUntil && formatDate(props.user.isBlockedUntil),
    },
  ]

  return (
    <>
      <Head>
        <title>{props.user.name}</title>
      </Head>
      <div className='loopple-min-height-78vh mx-auto w-full text-slate-500'>
        <div className='shadow-blur relative mb-4 flex min-w-0 flex-auto flex-col overflow-hidden break-words rounded-2xl border-0 bg-white/80 bg-clip-border p-4'>
          <div className='-mx-3 flex flex-wrap'>
            <div className='w-auto max-w-full flex-none px-3'>
              <div className='relative'>
                <Avatar
                  size='lg'
                  placeholderInitials={props.user.nickname.slice(0, 2).toUpperCase()}
                  img={props.user.image ?? ''}
                  rounded
                />
                {['ADMIN', 'MODERATOR'].includes(props.user.role) && (
                  <span className='absolute bottom-0 right-3  h-5 w-5 rounded-full border-2 border-blue-500 bg-blue-500 text-black'>
                    <ShieldCheckIcon />
                  </span>
                )}
              </div>
            </div>
            <div className='my-auto w-auto max-w-full flex-none px-3'>
              <div className='h-full'>
                {oldName && <h5 className='mb-1 font-semibold'>{oldName}</h5>}
                <div className='flex flex-row'>
                  <CopyToClipboard
                    text={oldNickname}
                    onCopy={() =>
                      successToast('Никнейм скопирован.', <ClipboardDocumentCheckIcon />)
                    }
                  >
                    <button className='text-size-sm mb-0 font-mono font-thin leading-normal'>
                      @{oldNickname}
                    </button>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
            <div className='mx-auto mt-4 w-full max-w-full px-3 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12'></div>
          </div>
        </div>
        <div className='removable mx-auto mt-6 w-full p-3'>
          <div className='-mx-3 flex flex-wrap'>
            <ProfileWindow>
              <div className='mb-0 rounded-t-2xl border-b-0 bg-white p-4 pb-0'>
                <div className='-mx-3 flex flex-wrap'>
                  <div className='flex w-full max-w-full shrink-0 items-center justify-between px-3 md:flex-none'>
                    <h6 className='mb-0 md:w-8/12'>Профиль</h6>
                    {props.isOwner && (
                      <div className='flex flex-row space-x-2'>
                        {!editProfile && (
                          <Button onClick={() => setEditProfile(!editProfile)} color='light'>
                            <PencilSquareIcon className='mr-2 h-5 w-5' />
                            Редактировать
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex-auto p-4'>
                {editProfile ? (
                  <>
                    <div>
                      <div className='mb-2 block'>
                        <Label value='Описание профиля' />
                      </div>
                      <Textarea
                        className='min-h-16 max-h-24'
                        rows={3}
                        maxLength={280}
                        placeholder='Расскажите о себе'
                        value={editableUser.userInfo}
                        onChange={(e) =>
                          e.currentTarget.value.split('\n').length <= 4 &&
                          setEditableUser({
                            ...editableUser,
                            userInfo: e.currentTarget.value.replaceAll('\n\n', '\n'),
                          })
                        }
                      />
                    </div>
                    <div className='mt-2 grid gap-2 md:grid-cols-2'>
                      {editableFields.map((item, index) => (
                        <div key={index}>
                          <div className='mb-2 block'>
                            <Label value={item.label} />
                          </div>
                          <TextInput
                            color={
                              item.result && item.result.status === 'error' ? 'failure' : 'gray'
                            }
                            value={item.value}
                            placeholder={item.placeholder}
                            onChange={(e) => item.setValue(e.currentTarget.value)}
                            required={item.isRequired}
                          />
                          {item.result &&
                            item.result.status === 'error' &&
                            item.oldValue !== item.value && (
                              <div className='text-sm text-red-500'>
                                {item.result.error && item.result.error.message}
                              </div>
                            )}
                          {item.result &&
                            item.result.status === 'loading' &&
                            item.oldValue !== item.value && (
                              <div className='h-5'>
                                <Spinner size='xs' />
                              </div>
                            )}
                          {(!item.result || item.result.status === 'success') && (
                            <div className='h-5' />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className='mt-2 flex flex-row space-x-2'>
                      <Button onClick={() => setEditProfile(false)} color='light'>
                        <ArrowLeftIcon className='mr-2 h-5 w-5' />
                        Отменить
                      </Button>
                      <Button
                        onClick={() => {
                          if (
                            editableUser.name !== props.user.name ||
                            editableUser.nickname !== props.user.nickname ||
                            editableUser.email !== props.user.email ||
                            editableUser.telegramLink !== props.user.telegramLink ||
                            editableUser.userInfo !== props.user.userInfo
                          ) {
                            editUser.mutate(removeEmptyFields(editableUser) as User)
                          }
                        }}
                        color='light'
                      >
                        {editUser.isLoading ? (
                          <div className='mr-2 h-5 w-5'>
                            <Spinner />
                          </div>
                        ) : (
                          <PencilSquareIcon className='mr-2 h-5 w-5' />
                        )}
                        Сохранить
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {editableUser.userInfo && (
                      <>
                        <p className='text-size-sm whitespace-pre-line leading-normal'>
                          {editableUser.userInfo}
                        </p>
                        <hr className='bg-gradient-horizontal-light my-6 h-px bg-transparent' />
                      </>
                    )}
                    <ul className='flex flex-col rounded-lg'>
                      {profileInfo.map(
                        (item) =>
                          item.value && (
                            <li
                              key={item.name}
                              className='text-size-sm relative block rounded-t-lg border-0 bg-white px-4 py-2 pl-0 pt-0 leading-normal text-inherit'
                            >
                              <strong className='text-slate-700'>{item.name}:</strong> &nbsp;{' '}
                              {item.value}
                            </li>
                          ),
                      )}
                    </ul>
                  </>
                )}
              </div>
            </ProfileWindow>
            <ProfileWindow>
              <div className='mb-0 rounded-t-2xl border-b-0 bg-white p-4 pb-0'>
                <h6 className='mb-0'>Conversations</h6>
              </div>
              <div className='flex-auto p-4'>
                <ul className='mb-0 flex flex-col rounded-lg pl-0'>
                  <li className='relative mb-2 flex items-center rounded-t-lg border-0 bg-white px-0 py-2 text-inherit'>
                    <div className='text-size-base ease-soft-in-out mr-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white transition-all duration-200'>
                      <Image
                        width={100}
                        height={100}
                        src='/assets/kudzh.jpeg'
                        alt='kal'
                        className='shadow-soft-2xl w-full rounded-xl'
                      />
                    </div>
                    <div className='flex flex-col items-start justify-center'>
                      <h6 className='text-size-sm mb-0 leading-normal'>Sophie B.</h6>
                      <p className='text-size-xs mb-0 leading-tight'>
                        Hi! I need more information..
                      </p>
                    </div>
                    <a
                      className='leading-pro text-size-xs ease-soft-in hover:scale-102 hover:active:scale-102 active:opacity-85 mb-0 ml-auto inline-block cursor-pointer rounded-lg border-0 bg-transparent py-3 pl-0 pr-4 text-center align-middle font-bold uppercase text-fuchsia-500 shadow-none transition-all hover:text-fuchsia-800 hover:shadow-none active:scale-100'
                      href='#'
                    >
                      Reply
                    </a>
                  </li>
                  <li className='relative mb-2 flex items-center border-0 border-t-0 bg-white px-0 py-2 text-inherit'>
                    <div className='text-size-base ease-soft-in-out mr-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white transition-all duration-200'>
                      <Image
                        width={100}
                        height={100}
                        src='/assets/kudzh.jpeg'
                        alt='kal'
                        className='shadow-soft-2xl w-full rounded-xl'
                      />
                    </div>
                    <div className='flex flex-col items-start justify-center'>
                      <h6 className='text-size-sm mb-0 leading-normal'>Anne Marie</h6>
                      <p className='text-size-xs mb-0 leading-tight'>Awesome work, can you..</p>
                    </div>
                    <a
                      className='leading-pro text-size-xs ease-soft-in hover:scale-102 hover:active:scale-102 active:opacity-85 mb-0 ml-auto inline-block cursor-pointer rounded-lg border-0 bg-transparent py-3 pl-0 pr-4 text-center align-middle font-bold uppercase text-fuchsia-500 shadow-none transition-all hover:text-fuchsia-800 hover:shadow-none active:scale-100'
                      href='#'
                    >
                      Reply
                    </a>
                  </li>
                  <li className='relative mb-2 flex items-center border-0 border-t-0 bg-white px-0 py-2 text-inherit'>
                    <div className='text-size-base ease-soft-in-out mr-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white transition-all duration-200'>
                      <Image
                        width={100}
                        height={100}
                        src='/assets/kudzh.jpeg'
                        alt='kal'
                        className='shadow-soft-2xl w-full rounded-xl'
                      />
                    </div>
                    <div className='flex flex-col items-start justify-center'>
                      <h6 className='text-size-sm mb-0 leading-normal'>Ivanna</h6>
                      <p className='text-size-xs mb-0 leading-tight'>About files I can..</p>
                    </div>
                    <a
                      className='leading-pro text-size-xs ease-soft-in hover:scale-102 hover:active:scale-102 active:opacity-85 mb-0 ml-auto inline-block cursor-pointer rounded-lg border-0 bg-transparent py-3 pl-0 pr-4 text-center align-middle font-bold uppercase text-fuchsia-500 shadow-none transition-all hover:text-fuchsia-800 hover:shadow-none active:scale-100'
                      href='#'
                    >
                      Reply
                    </a>
                  </li>
                  <li className='relative mb-2 flex items-center border-0 border-t-0 bg-white px-0 py-2 text-inherit'>
                    <div className='text-size-base ease-soft-in-out mr-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white transition-all duration-200'>
                      <Image
                        width={100}
                        height={100}
                        src='/assets/kudzh.jpeg'
                        alt='kal'
                        className='shadow-soft-2xl w-full rounded-xl'
                      />
                    </div>
                    <div className='flex flex-col items-start justify-center'>
                      <h6 className='text-size-sm mb-0 leading-normal'>Peterson</h6>
                      <p className='text-size-xs mb-0 leading-tight'>Have a great afternoon..</p>
                    </div>
                    <a
                      className='leading-pro text-size-xs ease-soft-in hover:scale-102 hover:active:scale-102 active:opacity-85 mb-0 ml-auto inline-block cursor-pointer rounded-lg border-0 bg-transparent py-3 pl-0 pr-4 text-center align-middle font-bold uppercase text-fuchsia-500 shadow-none transition-all hover:text-fuchsia-800 hover:shadow-none active:scale-100'
                      href='#'
                    >
                      Reply
                    </a>
                  </li>
                  <li className='relative flex items-center rounded-b-lg border-0 border-t-0 bg-white px-0 py-2 text-inherit'>
                    <div className='text-size-base ease-soft-in-out mr-4 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white transition-all duration-200'>
                      <Image
                        width={100}
                        height={100}
                        src='/assets/kudzh.jpeg'
                        alt='kal'
                        className='shadow-soft-2xl w-full rounded-xl'
                      />
                    </div>
                    <div className='flex flex-col items-start justify-center'>
                      <h6 className='text-size-sm mb-0 leading-normal'>Nick Daniel</h6>
                      <p className='text-size-xs mb-0 leading-tight'>
                        Hi! I need more information..
                      </p>
                    </div>
                    <a
                      className='leading-pro text-size-xs ease-soft-in hover:scale-102 hover:active:scale-102 active:opacity-85 mb-0 ml-auto inline-block cursor-pointer rounded-lg border-0 bg-transparent py-3 pl-0 pr-4 text-center align-middle font-bold uppercase text-fuchsia-500 shadow-none transition-all hover:text-fuchsia-800 hover:shadow-none active:scale-100'
                      href='#'
                    >
                      Reply
                    </a>
                  </li>
                </ul>
              </div>
            </ProfileWindow>
          </div>
        </div>
      </div>
    </>
  )
}
