export const formatBytes = (bytes: number, decimals = 0) => {
    if (!+bytes) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  export const syncAriaDescribedBy = (id: string, tooltip?: string, description?: string, error?: string) => {
    const descriptions = [];

    if (description) {
        descriptions.push(`${id}__longdescription`);
    }
    if (tooltip) {
        descriptions.push(`${id}__shortdescription`);
    }
    if (error) {
        descriptions.push(`${id}__errormessage`);
    }

    return descriptions.join(' ');
};