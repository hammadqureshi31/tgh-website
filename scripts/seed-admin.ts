import dotenv from 'dotenv'
import path from 'path'
import process from 'process'
import { createAdminClient } from '@/lib/supabase/admin'

// Load env (only when running standalone)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })
}

/* -------------------------------------------------------------------------- */
/*                                CONFIG                                      */
/* -------------------------------------------------------------------------- */

const REQUIRED_ENV_VARS = [
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'EDITOR_EMAIL',
  'EDITOR_PASSWORD',
] as const

const DRY_RUN = process.argv.includes('--dry-run')

type Role = 'admin' | 'editor'

interface UserSeed {
  email: string
  password: string
  fullName: string
  role: Role
  slug: string
  bio: string
}

interface AuthorInsert {
  id: string
  name: string
  slug: string
  email: string
  bio: string
  avatar_url: string | null
}

/* -------------------------------------------------------------------------- */
/*                              VALIDATION                                    */
/* -------------------------------------------------------------------------- */

function validateEnvironment() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing
        .map((v) => ` - ${v}`)
        .join('\n')}`
    )
  }
}

function validatePassword(password: string, email: string): void {
  if (!password || password.length < 12) {
    throw new Error(
      `Password for ${email} must be at least 12 characters (got ${password?.length || 0})`
    )
  }

  if (!/[A-Z]/.test(password)) {
    throw new Error(`Password for ${email} must include an uppercase letter`)
  }

  if (!/[0-9]/.test(password)) {
    throw new Error(`Password for ${email} must include a number`)
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    throw new Error(`Password for ${email} must include a special character`)
  }
}

/* -------------------------------------------------------------------------- */
/*                          SUPABASE HELPERS                                  */
/* -------------------------------------------------------------------------- */

async function fetchAllUsers(adminClient: ReturnType<typeof createAdminClient>) {
  const allUsers: any[] = []
  let page = 1

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page })

    if (error) throw new Error(`Failed to fetch users: ${error.message}`)

    allUsers.push(...data.users)

    if (data.users.length < 50) break
    page++
  }

  return allUsers
}

/* -------------------------------------------------------------------------- */
/*                          CORE PROCESSING                                   */
/* -------------------------------------------------------------------------- */

async function processUser(
  adminClient: ReturnType<typeof createAdminClient>,
  existingUserMap: Map<string, any>,
  user: UserSeed
) {
  console.log(`→ Processing: ${user.email}`)

  let userId: string
  const existing = existingUserMap.get(user.email)

  if (existing) {
    userId = existing.id

    console.log(`  ℹ User exists → updating metadata`)

    if (!DRY_RUN) {
      const { error } = await adminClient.auth.admin.updateUserById(userId, {
        user_metadata: {
          full_name: user.fullName,
          role: user.role,
        },
      })

      if (error) {
        throw new Error(`Failed to update user ${user.email}: ${error.message}`)
      }
    }
  } else {
    console.log(`  + Creating new user`)

    if (!DRY_RUN) {
      const { data, error } = await adminClient.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          role: user.role,
        },
      })

      if (error) {
        throw new Error(`Failed to create user ${user.email}: ${error.message}`)
      }

      if (!data.user) {
        throw new Error(`No user returned for ${user.email}`)
      }

      userId = data.user.id
    } else {
      userId = 'dry-run-id'
    }
  }

  const authorPayload: AuthorInsert = {
    id: userId,
    name: user.fullName,
    slug: user.slug,
    email: user.email,
    bio: user.bio,
    avatar_url: null,
  }

  console.log(`  ↺ Upserting author record`)

  if (!DRY_RUN) {
    const { error } = await (adminClient as any)
      .from('authors')
      .upsert([authorPayload], { onConflict: 'id' })

    if (error) {
      throw new Error(
        `Failed to upsert author for ${user.email}: ${error.message}`
      )
    }
  }

  console.log(`  ✓ Done\n`)
}

/* -------------------------------------------------------------------------- */
/*                                 MAIN                                       */
/* -------------------------------------------------------------------------- */

async function main() {
  console.log('\n═══════════════════════════════════════')
  console.log('TGH Seed Script — Admin Users (v2)')
  console.log('═══════════════════════════════════════\n')

  if (DRY_RUN) {
    console.log('⚠ DRY RUN MODE — No changes will be applied\n')
  }

  validateEnvironment()

  const users: UserSeed[] = [
    {
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
      fullName: 'TGH Admin',
      role: 'admin',
      slug: 'tgh-admin',
      bio: "The Gentlemen's House team.",
    },
    {
      email: process.env.EDITOR_EMAIL!,
      password: process.env.EDITOR_PASSWORD!,
      fullName: 'TGH Editor',
      role: 'editor',
      slug: 'tgh-editor',
      bio: "Content team at The Gentlemen's House.",
    },
  ]

  users.forEach((u) => validatePassword(u.password, u.email))

  const adminClient = createAdminClient()
  console.log('✓ Connected to Supabase\n')

  const allUsers = await fetchAllUsers(adminClient)
  const existingUserMap = new Map(allUsers.map((u) => [u.email, u]))

  for (const user of users) {
    await processUser(adminClient, existingUserMap, user)
  }

  console.log('═══════════════════════════════════════')
  console.log('✓ Seed complete')
  console.log('═══════════════════════════════════════\n')
}

/* -------------------------------------------------------------------------- */
/*                              ENTRY POINT                                   */
/* -------------------------------------------------------------------------- */

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ Seed failed:\n', err.message)
    process.exit(1)
  })