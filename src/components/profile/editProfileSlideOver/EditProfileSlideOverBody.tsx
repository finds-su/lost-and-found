import { useFormContext } from 'react-hook-form'
import { type EditableProfile } from '@/lib/types/EditableProfile'
import TextArea from '@/components/form/TextArea'
import Input from '@/components/form/Input'

export default function EditProfileSlideOverBody() {
  const editProfileForm = useFormContext<EditableProfile>()
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
    // ...Object.values(PrismaSocialNetwork).map((prismaSocialNetwork, index) => ({
    //   name: SocialNetwork[prismaSocialNetwork],
    //   register: editProfileForm.register(`socialNetworks.${index}.link`),
    //   type: 'input' as 'input' | 'textArea',
    // })),
  ]

  return (
    <div className='space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0'>
      {/* Project name */}
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
  )
}
