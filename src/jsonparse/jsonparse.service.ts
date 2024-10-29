import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { Piscina } from 'piscina';

@Injectable()
export class JsonparseService {
    // Initializing Piscina with the path to the Piscina worker script
    jParseWorkerPiscina = new Piscina({
        filename: resolve(__dirname, 'json_parse.worker.piscina.js'),
        minThreads: 5,
    });

    parseJsonSync(): number {
        throw new Error('Method not implemented.');
    }


    async getData() {
        const url = "https://www.reddit.com/r/reactiongifs.json";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            console.log(json);
        } catch (error) {
            console.error(error.message);
        }
    }

    async *getDataLineByLine() {
        const url = "https://www.reddit.com/r/reactiongifs.json";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
            let { value: chunk, done: readerDone } = await reader.read();
            chunk = chunk || "";

            const newline = /\r?\n/gm;
            let startIndex = 0;

            while (true) {
                const result = newline.exec(chunk);
                if (!result) {
                    if (readerDone) break;
                    const remainder = chunk.substr(startIndex);
                    ({ value: chunk, done: readerDone } = await reader.read());
                    chunk = remainder + (chunk || "");
                    startIndex = newline.lastIndex = 0;
                    continue;
                }
                yield chunk.substring(startIndex, result.index);
                startIndex = newline.lastIndex;
            }

            if (startIndex < chunk.length) {
                // Last line didn't end in a newline char
                yield chunk.substring(startIndex);
            }

            //const json = await response.json();
            //console.log(json);
        } catch (error) {
            console.error(error.message);
        }
    }

    async callit() {
        for await (const line of this.getDataLineByLine()) {
            console.log(line);
        }
    }

    

    async getJSONListInBatches(): Promise<void> {
        let promises = [];
        //const url = "https://www.reddit.com/r/reactiongifs.json";
        const url = 'http://localhost:3001/static-files/new_list_50.json';

        //const url = new URL(`file:///${path}`).href;

        // const url = "file:///c:/tests/obj_list.json"
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            for await (const batch of this.parseStreaming3(response, 10)) {
                promises.push( this.handleBatch(batch));
            }
            Promise.all(promises).then (()=>{
                console.log('All done');
            })
        } catch (error) {
            console.error(error.message);
        }
    }
    
    handleBatch(batch: unknown) {
        //console.log(batch);
        return this.jParseWorkerPiscina.run(batch)
    }


    // Given a response that returns a JSON array of objects of type T, this
    // function returns an async generator that yields batches of objects of type T of a given batch size.
    // Note: If the batch size is too small, the many async calls reduce the performance
    async *parseStreaming3(response: Response, batchSize: number = 100): AsyncGenerator {
        // If the response has no response body, stop.  This will only happen if something went wrong with the request.
        if (null === response.body) {
            console.warn(`Response has no body.`)
        } else {
            // The JSON object start character, '{'
            const START_OBJECT = 123;
            // The JSON object end character, '}'
            const END_OBJECT = 125;
            // Create a decoder
            const decoder = new TextDecoder('utf-8');
            // Get a streaming reader for the response body
            const reader = response.body.getReader();
            // Keep track of the object depth
            let depth = 0
            // If an object spans two chunks, the previous bytes that represent the end of the previous buffer
            let previousBytes: Uint8Array | undefined = undefined;
            // The start index of the current object
            let startIndex: number | undefined = undefined;
            // The current batch of items
            let batch = new Array()
            // eslint-disable-next-line no-constant-condition
            while (true) {
                // Get the bytes and whether the body is done
                const { done, value: bytes } = await reader.read();
                // If there's no value, stop.
                // If we have values...
                if (undefined !== bytes) {
                    // noinspection JSIncompatibleTypesComparison
                    // For each byte in the value...
                    for (let i = 0; i < bytes.length; i++) {
                        // Get the byte
                        const byte = bytes[i];
                        // If the byte is the start of a JSON object...
                        if (START_OBJECT === byte) {
                            // Increment the depth
                            depth += 1;
                            // If the depth is 1, meaning that this is a top-level object, set the start index
                            if (1 === depth) {
                                startIndex = i;
                            }
                            // If the byte is the end of an object...
                        } else if (END_OBJECT === byte) {
                            // If this is a top-level object...
                            if (1 === depth) {
                                // If there's a previous start index and previous bytes...
                                if (undefined !== previousBytes) {
                                    try {
                                        // Combine the previous bytes with the current bytes
                                        const json = decoder.decode(previousBytes)
                                            + decoder.decode(bytes.subarray(0, i + 1));
                                        // Parse the JSON into an object of the given type
                                        //const obj: T = JSON.parse(json);
                                        const obj = JSON.parse(json);
                                        // Add the parsed object to the batch
                                        batch.push(obj);
                                    } catch (e) {
                                        console.warn(e)
                                        console.log(` - previous json = `, decoder.decode(previousBytes))
                                        console.log(` - json = `, decoder.decode(bytes.subarray(0, i + 1)))
                                        // Stop
                                        return
                                    }
                                    // Reset the previous bytes
                                    previousBytes = undefined;
                                    // If there's a start index...
                                } else if (undefined !== startIndex) {
                                    try {
                                        // Get the JSON from the start index to the current index (inclusive)
                                        const json = decoder.decode(bytes.subarray(startIndex, i + 1));
                                        // Parse the JSON into an object of the given type
                                        //const obj: T = JSON.parse(json);
                                        const obj = JSON.parse(json);
                                        // Add the parsed object to the batch
                                        batch.push(obj);
                                        // Un-set the start index
                                        startIndex = undefined;
                                    } catch (e) {
                                        console.warn(e)
                                    }
                                }
                                // If the batch is at the batch size...
                                if (batch.length === batchSize) {
                                    // Yield the batch
                                    yield batch;
                                    // Reset the batch
                                    batch = new Array()
                                }
                            }
                            // Decrement the depth
                            depth -= 1;
                        }
                    }
                    // Because the start index is cleared at the end of each object,
                    // if we're ending the loop with a start index, we must not have
                    // encountered the end of the object, meaning that the object
                    // spans (at least) two reads.
                    if (undefined !== startIndex) {
                        // If we have no previous bytes...
                        if (undefined === previousBytes) {
                            // Save the bytes from the start of the object to end of the buffer.
                            // We'll combine this json with the next when we encounter the end of the
                            // object in the next read.
                            previousBytes = bytes.subarray(startIndex);
                        } else {
                            // There must not have been an end of the object in the previous read,
                            // meaning that the read contains some middle section of an object
                            // It happens sometimes, if we happen to get a particularly short read.
                            // Combine the previous bytes with the current bytes, extending the data.
                            const combinedBytes: Uint8Array = new Uint8Array(previousBytes.length + bytes.length);
                            combinedBytes.set(previousBytes);
                            combinedBytes.set(bytes, previousBytes.length);
                            previousBytes = combinedBytes
                        }
                    }
                }
                // If we're at the end of the response body, stop.  There's no more data to read.
                if (done) {
                    break;
                }
            }
            // If items remain in the batch, yield them
            if (batch.length > 0) {
                yield batch;
            }
        }
    }




}
