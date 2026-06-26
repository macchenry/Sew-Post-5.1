const https = require('https');
const ids = [
  '1531746020798-e6953c6e8e04', // African fashion
  '1611042553365-9b101441c135', // African woman
  '1580489944761-15a19d654956', // African woman
  '1574676118182-b7d1e8c9b910', // African man fashion
  '1523309375637-b3f4f2347f2d', // African fashion
  '1503342394128-c104d54dba01',
  '1517841905240-472988babdf9',
  '1530745342582-08d5c9c9a515',
  '1544365558-35aa4afcf11f',
  '1601007673574-8bba2d3a3397',
  '1550614000-4b95d4662d5f',
  '1621086820202-b2f7b88ec7b0',
  '1606902965551-dce093cda6e7',
  '1515664069236-68a71836c231',
  '1483985988355-763728e1935b', // fashion woman
  '1515886657613-9f3515b0c78f',
  '1520975954732-57dd06d6dcd0'
];
ids.forEach(id => {
  https.get(`https://images.unsplash.com/photo-${id}?w=800&q=80`, (res) => {
    console.log(`${id}: ${res.statusCode}`);
  });
});
