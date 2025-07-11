type PaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  // Lógica para mostrar no máximo 5 páginas
  const maxPagesToShow = 5
  let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2))
  let endPage = startPage + maxPagesToShow - 1

  if (endPage > totalPages) {
    endPage = totalPages
    startPage = Math.max(1, endPage - maxPagesToShow + 1)
  }

  const pageNumbers = []
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex justify-center mt-6 gap-2 text-black">
      <button
        className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        Anterior
      </button>
      {startPage > 1 && (
        <button className="px-3 py-1 border rounded cursor-pointer" onClick={() => onPageChange(1)}>
          1
        </button>
      )}
      {startPage > 2 && <span className="px-2 py-1">...</span>}
      {pageNumbers.map((num) => (
        <button
          key={num}
          className={`px-3 py-1 border rounded cursor-pointer ${page === num ? 'bg-gray-300 font-bold' : ''}`}
          onClick={() => onPageChange(num)}
        >
          {num}
        </button>
      ))}
      {endPage < totalPages - 1 && <span className="px-2 py-1">...</span>}
      {endPage < totalPages && (
        <button className="px-3 py-1 border rounded cursor-pointer" onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </button>
      )}
      <button
        className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Próxima
      </button>
    </div>
  )
}
