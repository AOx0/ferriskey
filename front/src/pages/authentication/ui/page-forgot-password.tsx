import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form'
import { InputText } from '@/components/ui/input-text'
import { UseFormReturn } from 'react-hook-form'
import { useParams } from 'react-router'
import { type ForgotPasswordSchema } from '../schemas/forgot-password.schema'
import AuthShell, { AuthFooterLink } from './auth-shell'
import './page-login.css'

export interface PageForgotPasswordProps {
  form: UseFormReturn<ForgotPasswordSchema>
  onSubmit: (data: ForgotPasswordSchema) => void
  submitted: boolean
  isPending: boolean
}

export default function PageForgotPassword({ form, onSubmit, submitted, isPending }: PageForgotPasswordProps) {
  const { realm_name } = useParams()

  return (
    <AuthShell
      title='Reset password'
      refLabel='hamoc'
      footer={
        <AuthFooterLink
          linkText='Back to login'
          to={`/realms/${realm_name}/authentication/login`}
        />
      }
    >
      {submitted ? (
        <div className='auth-banner auth-banner--success'>
          If an account exists with this email, a reset link has been sent.
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <p className='text-[13px] leading-relaxed text-muted-foreground'>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <InputText
                  {...field}
                  label='Email'
                  name='email'
                  type='email'
                  className='w-full'
                  error={form.formState.errors.email?.message}
                />
              )}
            />
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? 'Sending...' : 'Send reset link'}
            </Button>
          </div>
        </form>
      )}
    </AuthShell>
  )
}
