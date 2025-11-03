import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

async function checkDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully!');
    
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\nCollections found:', collections.map(c => c.name));
    
    // Check notes collection
    if (collections.find(c => c.name === 'notes')) {
      const notesCount = await db.collection('notes').countDocuments();
      console.log(`\nNotes collection: ${notesCount} documents`);
      
      if (notesCount > 0) {
        const sampleNotes = await db.collection('notes').find().limit(3).toArray();
        console.log('\nSample notes:');
        sampleNotes.forEach((note, i) => {
          console.log(`${i + 1}. Title: ${note.title}, User: ${note.user}`);
        });
      }
    } else {
      console.log('\nNo notes collection found');
    }
    
    // Check users collection
    if (collections.find(c => c.name === 'users')) {
      const usersCount = await db.collection('users').countDocuments();
      console.log(`\nUsers collection: ${usersCount} documents`);
      
      if (usersCount > 0) {
        const sampleUsers = await db.collection('users').find({}, { password: 0 }).limit(3).toArray();
        console.log('\nSample users:');
        sampleUsers.forEach((user, i) => {
          console.log(`${i + 1}. Email: ${user.email}, Role: ${user.role}`);
        });
      }
    } else {
      console.log('\nNo users collection found');
    }
    
  } catch (error) {
    console.error('Database check failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from database');
  }
}

checkDatabase();