import Image from 'next/image'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import successToast from '@/components/toasts/SuccessToast'
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'
import ProfileWindow from '@/components/profile/ProfileWindow'
import { PencilIcon } from '@heroicons/react/24/solid'
import { type Role } from '@prisma/client'
import { Avatar } from 'flowbite-react'

export interface User {
  nickname: string
  name?: string
  email?: string
  role: Role
  image?: string
  userInfo?: string
  telegramLink?: string
}

export default function ProfileBody(props: { user: User; isOwner: boolean }) {
  const profileInfo = [
    { name: 'Имя', value: props.user.name ?? '-' },
    { name: 'Никнейм', value: props.user.nickname ?? '-' },
    { name: 'Почта', value: props.user.email ?? '-' },
    { name: 'Telegram', value: props.user.telegramLink ?? '-' },
    { name: 'Роль', value: props.user.role ?? '-' },
  ]

  return (
    <div className='loopple-min-height-78vh mx-auto w-full text-slate-500'>
      <div className='shadow-blur relative mb-4 flex min-w-0 flex-auto flex-col overflow-hidden break-words rounded-2xl border-0 bg-white/80 bg-clip-border p-4'>
        <div className='-mx-3 flex flex-wrap'>
          <div className='w-auto max-w-full flex-none px-3'>
            <Avatar
              size='lg'
              placeholderInitials={props.user.nickname.slice(0, 2).toUpperCase()}
              img={props.user.image ?? ''}
              rounded
            />
          </div>
          <div className='my-auto w-auto max-w-full flex-none px-3'>
            <div className='h-full'>
              {props.user.name && <h5 className='mb-1 font-semibold'>{props.user.name}</h5>}
              <div className='flex flex-row'>
                <CopyToClipboard
                  text={props.user.nickname}
                  onCopy={() => successToast('Никнейм скопирован.', <ClipboardDocumentCheckIcon />)}
                >
                  <button className='text-size-sm mb-0 font-mono font-thin leading-normal'>
                    @{props.user.nickname}
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
                  <PencilIcon className='h-5 w-5' />
                </div>
              </div>
            </div>
            <div className='flex-auto p-4'>
              {props.user.userInfo && (
                <>
                  <p className='text-size-sm leading-normal'>{props.user.userInfo}</p>
                  <hr className='bg-gradient-horizontal-light my-6 h-px bg-transparent' />
                </>
              )}
              <ul className='flex flex-col rounded-lg'>
                {profileInfo.map((item) => (
                  <li
                    key={item.name}
                    className='text-size-sm relative block rounded-t-lg border-0 bg-white px-4 py-2 pl-0 pt-0 leading-normal text-inherit'
                  >
                    <strong className='text-slate-700'>{item.name}:</strong> &nbsp; {item.value}
                  </li>
                ))}
              </ul>
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
                    <p className='text-size-xs mb-0 leading-tight'>Hi! I need more information..</p>
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
                    <p className='text-size-xs mb-0 leading-tight'>Hi! I need more information..</p>
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
  )
}
