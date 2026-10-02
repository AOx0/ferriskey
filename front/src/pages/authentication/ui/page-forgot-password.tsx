import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form'
import { InputText } from '@/components/ui/input-text'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { type ForgotPasswordSchema } from '../schemas/forgot-password.schema'
import AuthShell, { AuthFooterLink } from './auth-shell'
import './page-login.css'
import { AUTH_NAMESPACE } from '../constants'

export interface PageForgotPasswordProps {
  form: UseFormReturn<ForgotPasswordSchema>
  onSubmit: (data: ForgotPasswordSchema) => void
  submitted: boolean
  isPending: boolean
}

export default function PageForgotPassword({ form, onSubmit, submitted, isPending }: PageForgotPasswordProps) {
  const { realm_name } = useParams()
  const { t } = useTranslation(AUTH_NAMESPACE)

  return (
    <AuthShell
      title={t('forgot_password.title')}
      footer={
        <AuthFooterLink
          linkText={t('actions.back_to_login')}
          to={`/realms/${realm_name}/authentication/login`}
        />
      }
    >
      {submitted ? (
        <div className='auth-banner auth-banner--success'>
          {t('forgot_password.sent')}
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <p className='text-[13px] leading-relaxed text-muted-foreground'>
              {t('forgot_password.description')}
            </p>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <InputText
                  {...field}
                  label={t('forgot_password.email_label')}
                  name='email'
                  type='email'
                  className='w-full'
                  error={form.formState.errors.email?.message}
                />
              )}
            />
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? t('forgot_password.submitting') : t('forgot_password.submit')}
            </Button>
          </div>
        </form>
      )}
    </AuthShell>
  )
}
