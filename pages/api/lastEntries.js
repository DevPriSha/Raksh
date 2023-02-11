import nc from 'next-connect';
import Entries from '../../models/Entries';
import db from '../../utils/db';

const handler = nc();


handler.get(async (req, res) => {
    await db.connect();
    const lastEntryDHT22_01 = await Entries.find({ deviceName: 'dht22_01' }).sort({ _id: -1 }).limit(1)
    await db.disconnect();  
    await db.connect();
    const lastEntryDHT22_02 = await Entries.find({ deviceName: 'dht22_02' }).sort({ _id: -1 }).limit(1)
    await db.disconnect();  
    await db.connect();
    const lastEntryDHT11_01 = await Entries.find({ deviceName: 'dht11_01' }).sort({ _id: -1 }).limit(1)
    await db.disconnect();  
    await db.connect();
    const lastEntry7a01 = await Entries.find({ deviceName: 'a840417eb1837a01' }).sort({ _id: -1 }).limit(1)
    await db.disconnect();  
    await db.connect();
    const lastEntry79fe = await Entries.find({ deviceName: 'a84041c2718379fe' }).sort({ _id: -1 }).limit(1)
    await db.disconnect();  
    await db.connect();
    const lastEntry7a0a = await Entries.find({ deviceName: 'a84041b931837a0a' }).sort({ _id: -1 }).limit(1)
    await db.disconnect();  
    
    console.log('Latest Entries Fetched')
    res.send({
        lastEntryDHT22_01: lastEntryDHT22_01,
        lastEntryDHT22_02: lastEntryDHT22_02,
        lastEntryDHT11_01: lastEntryDHT11_01,
        lastEntry7a01: lastEntry7a01,
        lastEntry79fe: lastEntry79fe,
        lastEntry7a0a: lastEntry7a0a,
    });

});

export default handler;
