'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SUPER_ADMIN } from '@/constants/super-admin'

function isSuperAdmin(user: Awaited<ReturnType<ReturnType<typeof createClient>['auth']['getUser']>>['user']): boolean {
  if (!user) return false
  return (
    user.email === SUPER_ADMIN.EMAIL ||
    user.id === SUPER_ADMIN.UID ||
    user.app_metadata?.active_tenant_type === 'SUPER_ADMIN'
  )
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=' + error.message)
  }

  revalidatePath('/', 'layout')

  // Super Admin vai direto para /super-admin, nunca para /select-company
  if (isSuperAdmin(data.user)) {
    redirect('/super-admin/dashboard')
  }

  redirect('/select-company')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=' + error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/login?message=Check your email for confirmation')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
