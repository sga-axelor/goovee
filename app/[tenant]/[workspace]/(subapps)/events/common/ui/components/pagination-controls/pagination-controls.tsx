import {MdOutlineNavigateBefore, MdOutlineNavigateNext} from 'react-icons/md';

// ---- CORE IMPORTS ---- //
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/ui/components';

// ---- LOCAL IMPORTS ---- //
import type {PaginationProps} from '@/subapps/events/common/ui/components';

export const PaginationControls = ({
  totalItems,
  currentPage,
  itemsPerPage,
  setCurrentPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderPaginationItems = () => {
    let items = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              className={
                currentPage === i
                  ? 'bg-success-dark dark:bg-success-dark hover:text-white text-white dark:hover:bg-success-dark hover:bg-success-dark rounded-full'
                  : 'text-main-black rounded-full hover:bg-transparent dark:hover:bg-transparent dark:hover:text-main-black cursor-pointer'
              }
              onClick={() => setCurrentPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                className={
                  currentPage === i
                    ? 'bg-success-dark dark:bg-success-dark hover:text-white text-white dark:hover:bg-success-dark hover:bg-success-dark rounded-full'
                    : 'text-main-black rounded-full hover:bg-transparent dark:hover:bg-transparent dark:hover:text-main-black cursor-pointer'
                }
                onClick={() => setCurrentPage(i)}>
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        }
        if (currentPage === 3) {
          items.push(
            <PaginationItem key={4}>
              <PaginationLink
                className={
                  'text-main-black rounded-full hover:bg-transparent dark:hover:bg-transparent dark:hover:text-main-black cursor-pointer'
                }
                onClick={() => setCurrentPage(4)}>
                4
              </PaginationLink>
            </PaginationItem>,
          );
        }
        items.push(
          <PaginationEllipsis
            key="ellipsis1"
            className="cursor-pointer"
            onClick={() =>
              setCurrentPage(
                currentPage === 1 ? currentPage + 3 : currentPage + 2,
              )
            }
          />,
        );
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              className={
                currentPage === totalPages
                  ? 'bg-success-dark dark:bg-success-dark hover:text-white text-white dark:hover:bg-success-dark hover:bg-success-dark rounded-full'
                  : 'text-main-black rounded-full hover:bg-transparent dark:hover:bg-transparent dark:hover:text-main-black cursor-pointer'
              }
              onClick={() => setCurrentPage(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if (currentPage >= totalPages - 2) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              className={
                currentPage === 1
                  ? 'bg-success-dark dark:bg-success-dark hover:text-white text-white dark:hover:bg-success-dark hover:bg-success-dark rounded-full'
                  : 'text-main-black rounded-full hover:bg-transparent dark:hover:bg-transparent dark:hover:text-main-black cursor-pointer'
              }
              onClick={() => setCurrentPage(1)}>
              {1}
            </PaginationLink>
          </PaginationItem>,
        );
        items.push(
          <PaginationEllipsis
            key="ellipsis2"
            className="cursor-pointer"
            onClick={() =>
              setCurrentPage(
                currentPage === totalPages ? currentPage - 3 : currentPage - 2,
              )
            }
          />,
        );
        if (currentPage == totalPages - 2) {
          items.push(
            <PaginationItem key={totalPages - 3}>
              <PaginationLink
                className={
                  currentPage === totalPages - 3
                    ? 'bg-success-dark dark:bg-success-dark hover:text-white text-white dark:hover:bg-success-dark hover:bg-success-dark rounded-full'
                    : 'text-main-black rounded-full hover:bg-transparent dark:hover:bg-transparent dark:hover:text-main-black cursor-pointer'
                }
                onClick={() => setCurrentPage(totalPages - 3)}>
                {totalPages - 3}
              </PaginationLink>
            </PaginationItem>,
          );
        }

        for (let i = totalPages - 2; i <= totalPages; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                className={
                  currentPage === i
                    ? 'bg-success-dark dark:bg-success-dark hover:text-white text-white dark:hover:bg-success-dark hover:bg-success-dark rounded-full'
                    : 'text-main-black rounded-full hover:bg-transparent dark:hover:bg-transparent dark:hover:text-main-black cursor-pointer'
                }
                onClick={() => setCurrentPage(i)}>
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        }
      } else {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink
              className={
                currentPage === 1
                  ? 'bg-success-dark dark:bg-success-dark hover:text-white text-white dark:hover:bg-success-dark hover:bg-success-dark rounded-full'
                  : 'text-main-black rounded-full hover:bg-transparent dark:hover:bg-transparent dark:hover:text-main-black cursor-pointer'
              }
              onClick={() => setCurrentPage(1)}>
              {1}
            </PaginationLink>
          </PaginationItem>,
        );
        items.push(
          <PaginationEllipsis
            key="ellipsis3"
            className="cursor-pointer"
            onClick={() => setCurrentPage(currentPage - 2)}
          />,
        );
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                className={
                  currentPage === i
                    ? 'bg-success-dark dark:bg-success-dark hover:text-white text-white dark:hover:bg-success-dark hover:bg-success-dark rounded-full'
                    : 'text-main-black rounded-full hover:bg-transparent dark:hover:bg-transparent dark:hover:text-main-black cursor-pointer'
                }
                onClick={() => setCurrentPage(i)}>
                {i}
              </PaginationLink>
            </PaginationItem>,
          );
        }
        items.push(
          <PaginationEllipsis
            key="ellipsis4"
            className="cursor-pointer"
            onClick={() => setCurrentPage(currentPage + 2)}
          />,
        );
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              className={
                currentPage === totalPages
                  ? 'bg-success-dark dark:bg-success-dark hover:text-white text-white dark:hover:bg-success-dark hover:bg-success-dark rounded-full'
                  : 'text-main-black rounded-full hover:bg-transparent dark:hover:bg-transparent dark:hover:text-main-black cursor-pointer'
              }
              onClick={() => setCurrentPage(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    }

    return items;
  };

  return (
    <Pagination className="text-main-black">
      <PaginationContent className="select-none">
        <PaginationItem>
          <MdOutlineNavigateBefore
            className={`w-5 h-5 ${currentPage > 1 ? 'cursor-pointer' : 'opacity-40'}`}
            onClick={handlePrevPage}
          />
        </PaginationItem>
        {renderPaginationItems()}
        <PaginationItem>
          <MdOutlineNavigateNext
            size={20}
            className={
              currentPage < totalPages ? 'cursor-pointer' : 'opacity-40'
            }
            onClick={handleNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
