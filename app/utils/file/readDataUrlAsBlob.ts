export const readDataUrlAsBlob = async (dataUrl: string) =>
  new Promise<Blob>((resolve, reject) => {
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => resolve(blob))
      .catch(error => reject(error))
  })
