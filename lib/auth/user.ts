import { hashPassword, verifyPassword } from './password'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { users } from './db/schema'

export async function createUser(email: string, password: string, name: string) {
  const passwordHash = await hashPassword(password)
  
  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      name,
    })
    .returning()
  
  return user
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
  
  return user
}

export async function getUserById(id: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
  
  return user
}

export async function verifyUserPassword(email: string, password: string) {
  const user = await getUserByEmail(email)
  
  if (!user) {
    return null
  }
  
  const isValid = await verifyPassword(password, user.passwordHash)
  
  if (!isValid) {
    return null
  }
  
  return user
}
