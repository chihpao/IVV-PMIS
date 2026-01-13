import { loadEnvConfig } from '@next/env';
import { Client, Databases, Query, Users } from 'node-appwrite';

loadEnvConfig(process.cwd());

// Initialize Client
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
  .setKey(process.env.NEXT_APPWRITE_KEY!); // Ensure this key has permissions

const databases = new Databases(client);
const users = new Users(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const MEMBERS_ID = process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!;

async function migrate() {
  console.log('Starting migration...');

  try {
    // 1. Create Attributes (if they don't exist)
    // Note: Attribute creation is async and might take time.
    // We'll attempt to create and catch errors if they exist.
    console.log('Creating attributes...');
    try {
      await databases.createStringAttribute(DATABASE_ID, MEMBERS_ID, 'name', 256, false);
      console.log('Created "name" attribute.');
    } catch (e: any) {
      console.log('"name" attribute might already exist or failed:', e.message);
    }

    try {
      await databases.createEmailAttribute(DATABASE_ID, MEMBERS_ID, 'email', false);
      console.log('Created "email" attribute.');
    } catch (e: any) {
      console.log('"email" attribute might already exist or failed:', e.message);
    }

    // Wait a bit for attributes to be ready (Appwrite attribute creation can be slow)
    console.log('Waiting 5 seconds for attributes to be processed...');
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 2. Fetch all members
    let hasNextPage = true;
    let lastId = null;
    let processedCount = 0;

    console.log('Backfilling data...');

    while (hasNextPage) {
      const queries = [Query.limit(100)];
      if (lastId) queries.push(Query.cursorAfter(lastId));

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, queries);

      if (members.documents.length === 0) {
        hasNextPage = false;
        break;
      }

      for (const member of members.documents) {
        // Skip if already has name and email
        if (member.name && member.email) {
          console.log(`Skipping member ${member.$id} (already migrated)`);
          continue;
        }

        try {
          // Fetch user details
          const user = await users.get(member.userId);

          // Update member document
          await databases.updateDocument(DATABASE_ID, MEMBERS_ID, member.$id, {
            name: user.name,
            email: user.email,
          });

          console.log(`Updated member ${member.$id} with name: ${user.name}`);
        } catch (e: any) {
          console.error(`Failed to update member ${member.$id}:`, e.message);
        }
      }

      processedCount += members.documents.length;
      lastId = members.documents[members.documents.length - 1].$id;
      console.log(`Processed ${processedCount} members so far...`);
    }

    console.log('Migration complete!');
  } catch (error: any) {
    console.error('Migration failed:', error);
  }
}

migrate();
