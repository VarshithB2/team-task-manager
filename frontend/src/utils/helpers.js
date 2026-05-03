export const isOverdue = (task) =>
  task.status !== 'Completed' && new Date(task.dueDate) < new Date();

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';

export const statusBadgeClass = (s) => {
  if (s === 'Pending') return 'badge pending';
  if (s === 'In Progress') return 'badge progress';
  if (s === 'Completed') return 'badge completed';
  return 'badge';
};

export const priorityBadgeClass = (p) => {
  if (p === 'Low') return 'badge low';
  if (p === 'Medium') return 'badge medium';
  if (p === 'High') return 'badge high';
  return 'badge';
};
