import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      console.log({ existing, args, cache });
      const { skip, first } = args;
      console.log(first)

      // Read number of items on page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // Check if we have existing items
      // filter filters out any undefined items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // If there are items
      // AND there aren't enough items to satisfy how many were required
      // AND we are on the last page
      // then just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we don't have any items, must go to network to fetch them
        return false;
      }

      // if there items, return from cache
      if (items.length) {
        console.log(
          `There are ${items.length} items in the cache! Will send to apollo`
        );
        return items;
      }

      return false; // fallback to network
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      // Runs when the Apollo client comes back from the network with our products
      console.log(`Merging items from the network ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log(merged);
      // return merged items from cache
      // when returned from a merge, it will back to the read function and try it again
      return merged;
    },
  };
}
