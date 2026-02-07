export function formatWon(value) {
  const n = Number(value) || 0;
  return `${n.toLocaleString("ko-KR")}원`;
}

