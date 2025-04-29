import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import {user} from './db/schemas/auth-schema'
  
const db = drizzle(process.env.DATABASE_URL!);

async function main() {
    const person: typeof user.$inferInsert = {
        id: "1",
        name: 'John',
        email: "bgml@cin.ufpe.br",    
        emailVerified: false,
        image: "",
        createdAt: new Date("2022-07-13"), // atenção ao formato ISO
        updatedAt: new Date("2023-08-20")
      };
      

  await db.insert(user).values(person);
  console.log('New user created!')

  const users = await db.select().from(user);
  console.log('Getting all users from the database: ', users)
  /*
  const users: {
    id: number;
    name: string;
    age: number;
    email: string;
  }[]
  */

//   await db
//     .update(user)
//     .set({
//       age: 31,
//     })
//     .where(eq(user.email, user.email));
//   console.log('User info updated!')

//   await db.delete(user).where(eq(user.email, user.email));
//   console.log('User deleted!')
// }

}
    
main();
