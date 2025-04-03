type Props = Date | string | null;
/**
 *
 * @param start '2022-02-22 20:22:22'
 * @param end '2022-02-22 20:22:22'
 * @returns number
 */
export default function distanceTime(start: Props = null, end: Props = null) {
  if (start && typeof start === 'string') {
    const dateStr = start.replace(/-/g, '/');
    start = new Date(dateStr);
  } else if (!start) {
    start = new Date();
  }

  if (end && typeof end === 'string') {
    const dateStr = end.replace(/-/g, '/');
    end = new Date(dateStr);
  } else if (!end) {
    end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
  }

  const endTime = Date.parse(end.toString()) / 1000;
  const startTime = Date.parse(start.toString()) / 1000;
  return endTime - startTime;
}
