import nc from 'next-connect';
import Entries from '../../../models/Entries';
import db from '../../../utils/db';
import data from '../../../utils/data';

const handler = nc();

handler.get(async (req, res) => {
  await db.connect();
//   await Organisation.deleteMany();
  await Entries.insertMany(data.entries);
  await db.disconnect();
  res.send({ message: 'seeded successfully' });
});

export default handler;