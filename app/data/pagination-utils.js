exports.getDataByPage = (data, pageNumber = 1, pageSize = 50) => {
  --pageNumber // because pages logically start with 1, but technically with 0
  return data.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
}

exports.getPaginationItems = (pageNumber, pageCount, pageSize = 50) => {
  let startItem = 1
  let endItem = (pageCount < 5) ? pageCount : 5

  // First five pages
  if (pageNumber > 3) {
    startItem = (pageCount < 5) ? 1 : pageNumber - 2
    endItem = pageNumber + 2
  }

  // Last five pages
  if (pageCount > 4 && pageNumber > (pageCount - 3)) {
    startItem = (pageCount - 4) ? pageCount - 4 : startItem
    endItem = pageCount
  }

  const itemArray = []
  for (let i = startItem; i <= endItem; i++) {
    let item = {}
    item.text = i
    item.href = '?page=' + i + '&limit=' + pageSize
    item.selected = true ? parseInt(pageNumber) === i : false
    itemArray.push(item)
  }

  return itemArray
}

exports.getPagination = (data, pageNumber = 1, pageSize = 50) => {
  // Total number of things
  const totalCount = data.length

  // Make sure pageSize is positive
  pageSize = Math.abs(pageSize)

  // Prevent users putting in a limit not in the pre-defined set: 10, 25, 50, 100
  pageSize = ([10,25,50,100].indexOf(parseInt(pageSize)) !== -1) ? parseInt(pageSize) : 50

  // Make sure pageNumber is positive
  pageNumber = Math.abs(pageNumber)

  // Make sure pageNumber is an integer
  pageNumber = (pageNumber) ? parseInt(pageNumber) : 1

  // Total number of pages
  const pageCount = Math.ceil(totalCount / pageSize)

  // Calculate the previous and next pages
  const prevPage = (pageNumber - 1) ? (pageNumber - 1) : 1
  const nextPage = ((pageNumber + 1) > pageCount) ? pageCount : (pageNumber + 1)

  const startItem = (pageNumber == 1) ? pageNumber : ((pageNumber * pageSize) - pageSize) + 1
  let endItem = (pageNumber == 1) ? (pageNumber * pageSize) : ((startItem + pageSize) - 1)

  // We don't want the end item number shown to go beyond the total count
  endItem = (endItem > totalCount) ? totalCount : endItem

  return { totalCount, pageSize, pageNumber, pageCount, prevPage, nextPage, startItem, endItem, pageItems: this.getPaginationItems(pageNumber, pageCount, pageSize) }
}
