export const getInitials = (name: string) => {
  return name.split('@')[0].substring(0, 2).toUpperCase();
};

export const formatDate = (date: Date) => {
  const now = new Date();
  const emailDate = new Date(date);
  const diffInHours = (now.getTime() - emailDate.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return emailDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else {
    return emailDate.toLocaleDateString();
  }
};