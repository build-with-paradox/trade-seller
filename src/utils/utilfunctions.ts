export const formatErrorMessages = (errorData: Record<string, any>): string => {
    return Object.entries(errorData)
      .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
      .join(' | ');
  };