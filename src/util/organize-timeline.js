// @flow

const getTime = (item, start = true) => {
  let offset = 0;
  let timeline = item;

  while (timeline.timeline) {
    timeline = timeline.timeline;
    offset += timeline.startTime();
  }

  return offset + (start ? item.startTime() : item.endTime());
};

const createSegment = segment => ({
  item: segment,
  startTime: getTime(segment),
  endTime: getTime(segment, false)
});

/**
 * Organize the elements of a timeline into rows, based on how much space each element takes up.
 * Items are added in the order they appear in the timeline, and they're added to the uppermost
 * row they can fit in.
 * @param {Object[]} items - GSAP timeline elements.
 * @returns {TimelineRow[]} Timeline sorted into rows.
 */
export default items => {
  /**
   * Data structure for sorting a timeline's elements into rows.
   * @typedef {Object} TimelineRow
   * @prop {Integer} line - Line number of row.
   * @prop {Object[]} items - GSAP timeline items in row.
   */
  const rows = [];
  const freeRow = item => {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      let freeSpace = true;

      for (let i = 0; i < row.items.length; i++) {
        const segment = row.items[i];
        const itemStart = item.startTime;
        const itemEnd = item.endTime;
        const segmentStart = segment.startTime;
        const segmentEnd = segment.endTime;

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
    const segment = createSegment(item);

    if (rows.length === 0) {
      addRow(segment);
    } else {
      const index = freeRow(segment);
      if (index > -1) {
        rows[index].items.push(segment);
      } else {
        addRow(segment);
      }
    }
  }

  return rows;
};
