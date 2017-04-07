export default timeline => {
  const items = timeline.getChildren(false);
  const rows = [];
  const freeRow = item => {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      let freeSpace = true;

      for (let i = 0; i < row.items.length; i++) {
        const segment = row.items[i];
        const itemStart = item.startTime();
        const itemEnd = item.endTime();
        const segmentStart = segment.startTime();
        const segmentEnd = segment.endTime();

        if (itemStart >= segmentStart && itemStart <= segmentEnd) {
          freeSpace = false;
        } else if (itemEnd >= segmentStart && itemEnd <= segmentEnd) {
          freeSpace = false;
        }
      }

      if (freeSpace) {
        return i;
      }
    }

    return -1;
  };
  const addRow = segment => rows.push({
    line: rows.length,
    items: [segment]
  });

  for (const item of items) {
    if (rows.length === 0) {
      addRow(item);
    } else {
      const index = freeRow(item);
      if (index > -1) {
        rows[index].items.push(item);
      } else {
        addRow(item);
      }
    }
  }

  return rows;
};
