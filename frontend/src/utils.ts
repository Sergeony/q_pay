export const formatTime = (stringDate: string | null) => {
  if (stringDate === null)
    stringDate = new Date().toISOString();
  const date = new Date(stringDate);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export const formatDate = (stringDate: string | null) => {
    if (stringDate === null)
      stringDate = new Date().toISOString();

    const date = new Date(stringDate);

    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${month}.${day}.${year}`;
}