const helpers = {
  formatDate: (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  },

  sanitizeHTML: (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  truncate: (str, length) => {
    return str.length > length ? str.substring(0, length) + '...' : str;
  }
};

export default helpers;
