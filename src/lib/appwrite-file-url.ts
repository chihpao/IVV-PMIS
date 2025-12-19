export const getFileViewUrl = (fileId: string) => {
  const encodedFileId = encodeURIComponent(fileId);

  return `/api/images/${encodedFileId}`;
};
