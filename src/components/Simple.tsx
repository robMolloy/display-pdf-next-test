import { useEffect, useState } from "react";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const getBufferFromFile = (file: File) => {
  return new Promise<Buffer | undefined>((resolve, reject) => {
    const reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = function (e) {
      const arrayBuffer = (e.target as unknown as { result?: Buffer }).result;
      resolve(arrayBuffer);
      reader.abort();
    };

    // Read file as ArrayBuffer
    reader.readAsArrayBuffer(file);
  });
};

const getTextArrayFromPdfBuffer = async (data: Buffer) => {
  try {
    const loadingTask = pdfjs.getDocument({ data });
    const pdfDocument = await loadingTask.promise;
    const page = await pdfDocument.getPage(1);
    const textContent = await page.getTextContent();
    const textArray = textContent.items
      .map((textItem) => {
        if ("str" in textItem) return textItem.str;
      })
      .filter((x) => !!x) as string[];

    return textArray;
  } catch (error) {}
};

export default function Sample() {
  const [textLines, setLines] = useState(["new"]);
  const [buffer, setBuffer] = useState<Buffer | undefined>();

  useEffect(() => {
    (async () => {
      if (!buffer) return;
      const newTextArray = await getTextArrayFromPdfBuffer(buffer);
      if (newTextArray) setLines(newTextArray);
    })();
  }, [buffer]);

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const fileBuffer = await getBufferFromFile(file);
    if (fileBuffer) setBuffer(fileBuffer);
  }

  return (
    <div className="Example">
      <div className="Example__container">
        <div className="Example__container__load">
          <label htmlFor="file">Load from file:</label>{" "}
          <input onChange={onFileChange} type="file" />
        </div>
        {textLines.map((x, j) => (
          <div key={`line-${j}`}>{x}</div>
        ))}
      </div>
    </div>
  );
}
