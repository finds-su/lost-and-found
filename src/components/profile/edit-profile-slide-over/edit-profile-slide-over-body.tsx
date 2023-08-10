import { useFormContext } from 'react-hook-form'
import TextArea from '@/components/form/text-area'
import Input from '@/components/form/input'
import { SocialNetwork as PrismaSocialNetwork } from '@prisma/client'
import { api, type RouterOutputs, type RouterInputs } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { XMarkIcon, LinkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import React from 'react'

const ConnectDialog = ({
  network,
  user,
  open,
  setOpen,
}: {
  network: string
  user: RouterInputs['users']['editUser']
  open: boolean
  setOpen: (open: boolean) => void
}) => {
  const generateVkAuthLink = api.users.generateVkAuthLink.useQuery<
    RouterOutputs['users']['generateVkAuthLink']
  >(undefined, {})

  const generateTgAuthLink = api.users.generateTgAuthLink.useQuery<
    RouterOutputs['users']['generateTgAuthLink']
  >(undefined, {})

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog
        as='div'
        static
        className='fixed inset-0 z-10 overflow-y-auto'
        open={open}
        onClose={setOpen}
      >
        <div className='flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0'>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>

          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            {generateVkAuthLink.isLoading || generateTgAuthLink.isLoading ? (
              <div className='inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle'>
                <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                  <div className='flex justify-center'>
                    <svg
                      className='-ml-1 mr-3 h-5 w-5 animate-spin text-gray-900'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className='inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle'
                style={{ width: '80%' }}
              >
                <div className='bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4'>
                  <div className='sm:flex sm:items-start'>
                    <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10'>
                      <Image
                        src={`/icons/${network}.svg`}
                        alt={network}
                        width={24}
                        height={24}
                        color='blue'
                      />
                    </div>
                    <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                      <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                        Привязать {network === 'VK' ? 'ВКонтакте' : network}
                      </Dialog.Title>
                      <div className='mt-2'>
                        {network === 'Telegram' ? (
                          <p className='text-sm text-gray-500'>
                            Перейдите по ссылке и откройте бота, чтобы привязать аккаунт Telegram.
                          </p>
                        ) : (
                          <p className='text-sm text-gray-500'>
                            Перейдите по ссылке, открыв диалог с ботов, а затем отправьте ему эту
                            команду: <br />
                            <code className='mt-1 rounded bg-gray-100 p-1 font-bold text-gray-900'>
                              {/* Get ref= param from url */}
                              {'/'}
                              {generateVkAuthLink.data?.authLink.match(
                                /ref=([a-zA-Z0-9_-]{1,})&/,
                              )?.[1] || ''}
                            </code>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {network === 'Telegram' ? (
                  <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                    <button
                      type='button'
                      className='inline-flex w-full justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
                      onClick={() => setOpen(false)}
                    >
                      Привязать
                    </button>
                  </div>
                ) : (
                  <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                    <Link
                      href={generateVkAuthLink.data?.authLink || 'https://vk.com/'}
                      className='inline-flex w-full justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm'
                      onClick={() => setOpen(false)}
                    >
                      <LinkIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
                      Открыть бота
                    </Link>
                  </div>
                )}
              </div>
            )}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

const SocialNetwork = ({
  network,
  user,
}: {
  network: string
  user: RouterInputs['users']['editUser']
}) => {
  const socialNetwork = user?.socialNetworks?.find(
    (socialNetwork) => socialNetwork.socialNetwork === network,
  )

  const externalId = socialNetwork?.externalId || ''
  const username = socialNetwork?.username || ''

  const isLinked = Boolean(externalId || username)

  const [open, setOpen] = React.useState(false)

  const handleLinkClick = () => {
    setOpen(true)
  }

  const handleUnlinkClick = () => {
    // handle unlink click
  }

  const socialNetworkName = network === 'VK' ? 'ВКонтакте' : network
  const socialNetworkUserUrl =
    network === 'VK' ? `https://vk.com/id${externalId}` : `https://t.me/${username}`

  return (
    <>
      <ConnectDialog network={network} user={user} open={open} setOpen={setOpen} />
      <div className='flex flex-row items-center justify-between space-x-8 md:justify-start'>
        <div className='flex flex-row items-center space-x-2'>
          <Image src={`/icons/${network}.svg`} alt={network} width={24} height={24} color='blue' />
          <span>{socialNetworkName}</span>
        </div>
        {isLinked ? (
          <>
            <Link className='cursor-pointer text-blue-500 underline' href={socialNetworkUserUrl}>
              {socialNetworkUserUrl}
            </Link>
            <button
              className='rounded-xl bg-red-500 px-2 py-2 text-white'
              onClick={handleUnlinkClick}
            >
              <XMarkIcon className='h-4 w-4' />
            </button>
          </>
        ) : (
          <button
            className='rounded-xl bg-green-500 px-4 py-2 text-white'
            onClick={handleLinkClick}
          >
            Привязать
          </button>
        )}
      </div>
    </>
  )
}

export interface EditProfileSlideOverBodyProps {
  user: RouterInputs['users']['editUser']
}

export default function EditProfileSlideOverBody({ user }: EditProfileSlideOverBodyProps) {
  const editProfileForm = useFormContext<RouterInputs['users']['editUser']>()
  // const editProfileSocialNetworks = useFieldArray({
  //   control: editProfileForm.control,
  //   name: 'socialNetworks',
  // })
  const editableProfileAttributes: {
    name: string
    register: ReturnType<typeof editProfileForm.register>
    type: 'input' | 'textArea'
    error?: string
  }[] = [
    {
      name: 'Имя',
      register: editProfileForm.register('name'),
      type: 'input',
      error: editProfileForm.formState.errors.name?.message,
    },
    {
      name: 'Никнейм',
      register: editProfileForm.register('nickname'),
      type: 'input',
      error: editProfileForm.formState.errors.nickname?.message,
    },
    {
      name: 'Почта',
      register: editProfileForm.register('email'),
      type: 'input',
      error: editProfileForm.formState.errors.email?.message,
    },
    {
      name: 'Обо мне',
      register: editProfileForm.register('userInfo'),
      type: 'textArea',
      error: editProfileForm.formState.errors.userInfo?.message,
    },
  ]

  console.log(user?.socialNetworks)

  return (
    <>
      <div className='space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0'>
        {editableProfileAttributes.map((attribute) => (
          <div
            key={attribute.name}
            className='space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5'
          >
            <div>
              <label
                htmlFor={attribute.name}
                className='block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2'
              >
                {attribute.name}
              </label>
            </div>
            <div className='sm:col-span-2'>
              {attribute.type === 'input' && (
                <Input
                  label={attribute.name}
                  hideLabel
                  inputProps={attribute.register}
                  error={attribute.error}
                />
              )}
              {attribute.type === 'textArea' && <TextArea textAreaProps={attribute.register} />}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>Привязка соцсетей</h3>
          <p className='mt-1 max-w-2xl text-sm text-gray-500'>
            Свяжите свой аккаунт с помощью наших ботов и получайте обратную связь и уведомления в
            любимых мессенджерах
          </p>
        </div>
        <div className='space-y-6 px-4 py-4 sm:px-6'>
          <div className='flex flex-col space-y-4'>
            <SocialNetwork network='Telegram' user={user} />
            <SocialNetwork network='VK' user={user} />
          </div>
        </div>
      </div>
    </>
  )
}
