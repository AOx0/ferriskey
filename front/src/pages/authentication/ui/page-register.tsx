import { Form, FormField } from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'
import { RegisterSchema } from '../feature/page-register-feature'
import { InputText } from '@/components/ui/input-text'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router'
import AuthShell, { AuthFooterLink } from './auth-shell'
import './page-login.css'
import type { PublicPasswordPolicy } from '@/api/password-policy.api'
import PasswordRequirements from '../components/password-requirements'

export interface PageRegisterProps {
  form: UseFormReturn<RegisterSchema>
  onSubmit: (data: RegisterSchema) => void
  backToLogin?: () => void
  policy: PublicPasswordPolicy
}

export default function PageRegister({ form, onSubmit, backToLogin, policy }: PageRegisterProps) {
  const { realm_name } = useParams()
  const password = form.watch('password')
  const isPasswordValid = !form.formState.errors.password && password.length > 0
  const isFormSubmittable =
    form.formState.isValid && !form.formState.isSubmitting

  return (
    <AuthShell
      title='Create account'
      refLabel='hamoc'
      footer={
        backToLogin ? (
          <AuthFooterLink
            text='Already registered?'
            linkText='Back to login'
            to={`/realms/${realm_name}/authentication/login`}
          />
        ) : undefined
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='username'
                render={({ field, fieldState }) => (
                  <div className='flex flex-col gap-1'>
                    <InputText {...field} label='Username' className='w-full' />
                    {fieldState.error && (
                      <p className='text-xs text-destructive'>{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field, fieldState }) => (
                  <div className='flex flex-col gap-1'>
                    <InputText {...field} label='Email' className='w-full' />
                    {fieldState.error && (
                      <p className='text-xs text-destructive'>{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className='grid gap-4'>
              <FormField
                control={form.control}
                name='password'
                render={({ field, fieldState }) => (
                  <div className='flex flex-col gap-1'>
                    <InputText
                      {...field}
                      label='Password'
                      type='password'
                      className='w-full'
                    />
                    {fieldState.error && isPasswordValid === false && password.length > 0 && (
                      <p className='text-xs text-destructive'>{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
              <PasswordRequirements password={password} policy={policy} />

              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field, fieldState }) => (
                  <div className='flex flex-col gap-1'>
                    <InputText
                      {...field}
                      label='Confirm Password'
                      type='password'
                      className='w-full'
                    />
                    {fieldState.error && (
                      <p className='text-xs text-destructive'>{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field, fieldState }) => (
                  <div className='flex flex-col gap-1'>
                    <InputText {...field} label='Firstname' className='w-full' />
                    {fieldState.error && (
                      <p className='text-xs text-destructive'>{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />

              <FormField
                control={form.control}
                name='lastName'
                render={({ field, fieldState }) => (
                  <div className='flex flex-col gap-1'>
                    <InputText {...field} label='Lastname' className='w-full' />
                    {fieldState.error && (
                      <p className='text-xs text-destructive'>{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>

            <Button type='submit' className='w-full' disabled={!isFormSubmittable}>
              Create Account
            </Button>
          </div>
        </form>
      </Form>
    </AuthShell>
  )
}
