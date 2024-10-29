// src/fibonacci/fibonacci.worker.piscina.ts
async function handle_batch(batch) {
  console.log("handling batch");
  for (let i = 0; i < batch.length; i++) {
    let object = batch[i];
    console.log(`${new Date().toISOString()} - index:${object.index} id: ${object.id}`);
    await new Promise(resolve => setTimeout(resolve, object.timeout));
    console.log(`${new Date().toISOString()} - index:${object.index} OUT`);
  }
  return 3;
}

module.exports = (batch) => {
  console.log("exporting");
  return handle_batch(batch);
};