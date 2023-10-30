import { decodeBuffer } from './decoder';
import { AsterixFile, DataRecord } from './model';

export type DecodeFilesMessage = File[];

addEventListener('message', (e) => {
  const files = e.data as DecodeFilesMessage;

  files.forEach((file) => {
    const filename = file.name;
    file.arrayBuffer().then((content) => {
      const dataRecords = decodeBuffer(content);
      postMessage({ filename, dataRecords } as AsterixFile);
    });
  });
});
