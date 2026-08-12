import { InputText } from '@/components/ui/input-text.tsx'
import { Button } from '@/components/ui/button.tsx'
import { FormField } from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'
import { UpdatePasswordSchema } from '../../schemas/update-password.schema'
import AuthShell from '../auth-shell'
import '../page-login.css'

export interface UpdatePasswordProps {
  handleClick: () => void
}

export default function UpdatePassword({ handleClick }: UpdatePasswordProps) {
  const form = useFormContext<UpdatePasswordSchema>()
  const isPending = form.formState.isSubmitting

  return (
    <AuthShell
      title='Update your password'
      refLabel='security'
      description='Your password is temporary and must be updated before continuing.'
    >
      <form onSubmit={handleClick}>
        <div className='flex flex-col gap-4'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <InputText
                {...field}
                label='New password'
                name='password'
                type='password'
                className='w-full'
                error={form.formState.errors.password?.message}
              />
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <InputText
                {...field}
                label='Confirm password'
                name='confirmPassword'
                type='password'
                className='w-full'
                error={form.formState.errors.confirmPassword?.message}
              />
            )}
          />
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Updating...' : 'Update password'}
          </Button>
        </div>
      </form>
    </AuthShell>
  )
}
