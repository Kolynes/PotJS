export interface PaginationData<T> {
  items: T[];
  numberOfPages: number;
  previousPage: number;
  nextPage: number;
}

export function paginate<T>(array: T[], size: number, page: number): PaginationData<T> {
  let items: T[];
  if(size * (page - 1) > array.length)
    items = [];
  else items = array.slice(
    size * (page - 1), 
    Math.min(size * page, array.length)
  );
  let numberOfPages = Math.ceil(array.length / size);
  let previousPage = page - 1;
  let nextPage = (page + 1) % numberOfPages;
  return {
    items,
    numberOfPages,
    previousPage,
    nextPage
  }
}