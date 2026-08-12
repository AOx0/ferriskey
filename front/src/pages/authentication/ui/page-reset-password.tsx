import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form'
import { InputText } from '@/components/ui/input-text'
import { UseFormReturn } from 'react-hook-form'
import { useParams } from 'react-router'
import { type ResetPasswordSchema } from '../schemas/reset-password.schema'
import { Loader2 } from 'lucide-react'
import AuthShell, { AuthFooterLink } from './auth-shell'
import './page-login.css'
import type { PublicPasswordPolicy } from '@/api/password-policy.api'
import PasswordRequirements from '../components/password-requirements'

export interface PageResetPasswordProps {
  form: UseFormReturn<ResetPasswordSchema>
  onSubmit: (data: ResetPasswordSchema) => void
  isPending: boolean
  tokenStatus: 'loading' | 'valid' | 'invalid'
  errorMessage: string | null
  policy: PublicPasswordPolicy
}

export default function PageResetPassword({
  form,
  onSubmit,
  isPending,
  tokenStatus,
  errorMessage,
  policy,
}: PageResetPasswordProps) {
  const { realm_name } = useParams()
  const password = form.watch('password')
  const isFormSubmittable = form.formState.isValid && !form.formState.isSubmitting && !isPending

  return (
    <AuthShell
      title='Set a new password'
      refLabel='hamoc'
      footer={
        <AuthFooterLink
          linkText='Back to login'
          to={`/realms/${realm_name}/authentication/login`}
        />
      }
    >
      {tokenStatus === 'loading' ? (
        <LoadingMessage />
      ) : tokenStatus === 'invalid' ? (
        <InvalidTokenMessage realmName={realm_name} />
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            {errorMessage && (
              <div className='rounded-md border border-destructive/30 border-l-[3px] border-l-destructive bg-destructive/10 px-3 py-2.5 text-[13px] text-destructive'>
                {errorMessage}
              </div>
            )}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <div className='flex flex-col gap-1'>
                  <InputText
                    {...field}
                    label='New password'
                    name='password'
                    type='password'
                    className='w-full'
                    error={
                      form.formState.errors.password?.message && password.length > 0
                        ? form.formState.errors.password.message
                        : undefined
                    }
                  />
                  <PasswordRequirements password={password} policy={policy} />
                </div>
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
            <Button type='submit' className='w-full' disabled={!isFormSubmittable}>
              {isPending ? 'Resetting...' : 'Reset password'}
            </Button>
          </div>
        </form>
      )}
    </AuthShell>
  )
}

function LoadingMessage() {
  return (
    <div className='flex flex-col items-center gap-3 py-4'>
      <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
      <p className='text-center text-[13px] text-muted-foreground'>Verifying your reset link...</p>
    </div>
  )
}

function InvalidTokenMessage({ realmName }: { realmName?: string }) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='auth-banner auth-banner--warning'>
        This reset link is invalid or has expired.
      </div>
      <AuthFooterLink
        linkText='Request a new reset link'
        to={`/realms/${realmName}/authentication/forgot-password`}
      />
    </div>
  )
}
