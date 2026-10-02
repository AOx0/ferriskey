import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form'
import { InputText } from '@/components/ui/input-text'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { MagicLinkSchema } from '@/pages/authentication/schemas/magic-link.schema'
import AuthShell, { AuthFooterLink } from './auth-shell'
import './page-login.css'
import { AUTH_NAMESPACE } from '../constants'

export interface PageMagicLinkRequestProps {
  form: UseFormReturn<MagicLinkSchema>
  onSubmit: (data: MagicLinkSchema) => void
  /**
   * `true` once the API has accepted the request and the user should now go
   * check their inbox. Drives the success view that replaces the form.
   */
  sent: boolean
  isPending: boolean
}

/**
 * Dedicated "request a magic link" page. Reached from the magic-link button
 * inside the customizable portal tree (`data-fk-action="magic-link"`), which
 * navigates here instead of trying to collect the email inline — so the user
 * always lands on a focused, full-page form regardless of how the realm's
 * login screen was authored.
 */
export default function PageMagicLinkRequest({
  form,
  onSubmit,
  sent,
  isPending,
}: PageMagicLinkRequestProps) {
  const { realm_name } = useParams()
  const { t } = useTranslation(AUTH_NAMESPACE)

  return (
    <AuthShell
      title={sent ? t('magic_link.sent.title') : t('magic_link.form.title')}
      footer={
        <AuthFooterLink
          linkText={t('actions.back_to_login')}
          to={`/realms/${realm_name}/authentication/login`}
        />
      }
    >
      {sent ? (
        <div className='auth-banner'>
          <div>
            <p>{t('magic_link.sent.description')}</p>
            <p className='mt-1.5 text-xs text-muted-foreground'>{t('magic_link.sent.hint')}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-4'>
            <p className='text-[13px] leading-relaxed text-muted-foreground'>
              {t('magic_link.form.description')}
            </p>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <InputText
                  {...field}
                  label={t('magic_link.form.email_label')}
                  name='email'
                  type='email'
                  required
                  className='w-full'
                  autoComplete='email'
                  error={form.formState.errors.email?.message}
                />
              )}
            />
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? t('magic_link.form.submitting') : t('magic_link.form.submit')}
            </Button>
          </div>
        </form>
      )}
    </AuthShell>
  )
}
