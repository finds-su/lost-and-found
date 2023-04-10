import Layout from '@/components/Layout'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { authOptions } from '@/server/auth'
import { getServerSession } from 'next-auth'

export default function Me() {
  const { data: session, status } = useSession()
  let profileInfo: { name: string; value: string }[] = []

  if (session) {
    profileInfo = [
      { name: 'Имя', value: session.user.name ? session.user.name : '-' },
      { name: 'Никнейм', value: session.user.nickname ? session.user.nickname : '-' },
      { name: 'Почта', value: session.user.email ? session.user.email : '-' },
      { name: 'Роль', value: session.user.role ? session.user.role : '-' },
      { name: 'Telegram', value: session.user.telegramLink ? session.user.telegramLink : '-' },
    ]
  }

  if (session) {
    return (
      <div className='loopple-min-height-78vh mx-auto w-full text-slate-500'>
        <div className='shadow-blur relative mb-4 flex min-w-0 flex-auto flex-col overflow-hidden break-words rounded-2xl border-0 bg-white/80 bg-clip-border p-4'>
          <div className='-mx-3 flex flex-wrap'>
            <div className='w-auto max-w-full flex-none px-3'>
              <div className='min-w-20 min-h-20 text-size-base ease-soft-in-out relative inline-flex items-center justify-center rounded-xl text-white transition-all duration-200'>
                <Image
                  src={session.user.image ? session.user.image : '/assets/kudzh.jpeg'}
                  alt='profile_image'
                  className='shadow-soft-sm object-fit w-20 w-full rounded-xl'
                  width={200}
                  height={200}
                />
              </div>
            </div>
            <div className='my-auto w-auto max-w-full flex-none px-3'>
              <div className='h-full'>
                <h5 className='mb-1'>{session.user.name}</h5>
                <p className='text-size-sm mb-0 font-semibold leading-normal'>
                  {session.user.role}
                </p>
              </div>
            </div>
            <div className='mx-auto mt-4 w-full max-w-full px-3 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12'></div>
          </div>
        </div>
        <div className='removable mx-auto mt-6 w-full p-3'>
          <div className='-mx-3 flex flex-wrap'>
            <div className='mb-4 w-full max-w-full px-3 xl:w-4/12'>
              <div className='shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border'>
                <div className='mb-0 rounded-t-2xl border-b-0 bg-white p-4 pb-0'>
                  <h6 className='mb-0'>Настройки платформы</h6>
                </div>
                <div className='flex-auto p-4'>
                  <h6 className='text-size-xs font-bold uppercase leading-tight text-slate-500'>
                    Аккаунт
                  </h6>
                  <ul className='mb-0 flex flex-col rounded-lg pl-0'>
                    <li className='relative block rounded-t-lg border-0 bg-white px-0 py-2 text-inherit'>
                      <div className='min-h-6 mb-0.5 block pl-0'>
                        <input
                          id='follow'
                          className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5-em relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                          type='checkbox'
                        />
                        <label
                          htmlFor=' follow'
                          className='text-size-sm mb-0 ml-4 w-4/5 cursor-pointer select-none overflow-hidden text-ellipsis whitespace-nowrap font-normal text-slate-500'
                        >
                          Email me when someone follows me
                        </label>
                      </div>
                    </li>
                    <li className='relative block border-0 bg-white px-0 py-2 text-inherit'>
                      <div className='min-h-6 mb-0.5 block pl-0'>
                        <input
                          id='answer'
                          className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5-em relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                          type='checkbox'
                        />
                        <label
                          htmlFor='answer'
                          className='text-size-sm mb-0 ml-4 w-4/5 cursor-pointer select-none overflow-hidden text-ellipsis whitespace-nowrap font-normal text-slate-500'
                        >
                          Email me when someone answers on my post
                        </label>
                      </div>
                    </li>
                    <li className='relative block rounded-b-lg border-0 bg-white px-0 py-2 text-inherit'>
                      <div className='min-h-6 mb-0.5 block pl-0'>
                        <input
                          id='mention'
                          className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5-em relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                          type='checkbox'
                        />
                        <label
                          htmlFor='mention'
                          className='text-size-sm mb-0 ml-4 w-4/5 cursor-pointer select-none overflow-hidden text-ellipsis whitespace-nowrap font-normal text-slate-500'
                        >
                          Email me when someone mentions me
                        </label>
                      </div>
                    </li>
                  </ul>
                  <h6 className='text-size-xs mt-6 font-bold uppercase leading-tight text-slate-500'>
                    Application
                  </h6>
                  <ul className='mb-0 flex flex-col rounded-lg pl-0'>
                    <li className='relative block rounded-t-lg border-0 bg-white px-0 py-2 text-inherit'>
                      <div className='min-h-6 mb-0.5 block pl-0'>
                        <input
                          id='launches projects'
                          className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5-em relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                          type='checkbox'
                        />
                        <label
                          htmlFor='launches projects'
                          className='text-size-sm mb-0 ml-4 w-4/5 cursor-pointer select-none overflow-hidden text-ellipsis whitespace-nowrap font-normal text-slate-500'
                        >
                          New launches and projects
                        </label>
                      </div>
                    </li>
                    <li className='relative block border-0 bg-white px-0 py-2 text-inherit'>
                      <div className='min-h-6 mb-0.5 block pl-0'>
                        <input
                          id='product updates'
                          className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5-em relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                          type='checkbox'
                        />
                        <label
                          htmlFor='product updates'
                          className='text-size-sm mb-0 ml-4 w-4/5 cursor-pointer select-none overflow-hidden text-ellipsis whitespace-nowrap font-normal text-slate-500'
                        >
                          Monthly product updates
                        </label>
                      </div>
                    </li>
                    <li className='relative block rounded-b-lg border-0 bg-white px-0 py-2 pb-0 text-inherit'>
                      <div className='min-h-6 mb-0.5 block pl-0'>
                        <input
                          id='subscribe'
                          className="mt-0.54 rounded-10 duration-250 ease-soft-in-out after:rounded-circle after:shadow-soft-2xl after:duration-250 checked:after:translate-x-5.25 h-5-em relative float-left ml-auto w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-slate-800/95 checked:bg-slate-800/95 checked:bg-none checked:bg-right"
                          type='checkbox'
                        />
                        <label
                          htmlFor='subscribe'
                          className='text-size-sm mb-0 ml-4 w-4/5 cursor-pointer select-none overflow-hidden text-ellipsis whitespace-nowrap font-normal text-slate-500'
                        >
                          Subscribe to newsletter
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='lg-max:mt-6 mb-4 w-full max-w-full px-3 xl:w-4/12'>
              <div className='shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border'>
                <div className='mb-0 rounded-t-2xl border-b-0 bg-white p-4 pb-0'>
                  <div className='-mx-3 flex flex-wrap'>
                    <div className='flex w-full max-w-full shrink-0 items-center px-3 md:w-8/12 md:flex-none'>
                      <h6 className='mb-0'>Profile Information</h6>
                    </div>
                    <div className='w-full max-w-full shrink-0 px-3 text-right md:w-4/12 md:flex-none'>
                      <a href='javascript:' data-target='tooltip_trigger' data-placement='top'>
                        <i
                          className='fas fa-user-edit text-size-sm leading-normal text-slate-400'
                          aria-hidden='true'
                        ></i>
                      </a>
                      <div
                        data-target='tooltip'
                        className='text-size-sm hidden rounded-lg bg-black px-2 py-1 text-center text-white'
                        role='tooltip'
                        data-popper-placement='top'
                      >
                        Edit Profile
                        <div
                          className="invisible absolute h-2 w-2 bg-inherit before:visible before:absolute before:h-2 before:w-2 before:rotate-45 before:bg-inherit before:content-['']"
                          data-popper-arrow=''
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex-auto p-4'>
                  <p className='text-size-sm leading-normal'>
                    Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer is no. If two
                    equally difficult paths, choose the one more painful in the short term (pain
                    avoidance is creating an illusion of equality).
                  </p>
                  <hr className='bg-gradient-horizontal-light my-6 h-px bg-transparent' />
                  <ul className='mb-0 flex flex-col rounded-lg pl-0'>
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
              </div>
            </div>
            <div className='lg-max:mt-6 mb-4 w-full max-w-full px-3 xl:w-4/12'>
              <div className='shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border'>
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
                        href='javascript:'
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
                        href='javascript:'
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
                        href='javascript:'
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
                        href='javascript:'
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
                        href='javascript:'
                      >
                        Reply
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (status === 'loading') {
    return <p>Загрузка</p>
  }
  return <p>Доступ запрещён</p>
}

Me.getLayout = function getLayout(page: any) {
  return <Layout pageName='Профиль'>{page}</Layout>
}

export async function getServerSideProps(context: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
  const session = await getServerSession(context.req, context.res, authOptions)
  if (session) {
    return {
      props: {
        session,
      },
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
}
