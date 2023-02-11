import mongoose from 'mongoose';

const entriesSchema = new mongoose.Schema(
  {
    deviceName: { type: String, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    timestamp: { type: Date, required: true },
  }
);

const Entries = mongoose.models.Entries || mongoose.model('Entries', entriesSchema,'temp-humidity-entries');
export default Entries;
